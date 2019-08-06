const pgp = require('pg-promise')(/* options */);
const db = pgp('postgres://sdc:greenfield@localhost:5432/product');

//get a list of product with user specified count and page
//defualt count is 5, and page is 1
const getProducts = (req, res) => {
  let limit = req.query.count || 5;
  let offset = req.query.count * (req.query.page - 1) || 0;
  db.many(
    `SELECT *
  FROM product
  LIMIT $1
  OFFSET $2`,
    [limit, offset]
  )
    .then(function(data) {
      res.status(200).json(data);
    })
    .catch(err => {
      if ((err.name = 'QueryResultError')) {
        res.status(404);
      }
      res.status(500);
      throw err;
    });
};

//get product with features by product id
const getProductById = (req, res) => {
  //when end point if /product/:product_id => product_id is set to params
  //when end point if /product[/]?product_id => product_id is set to query
  let product_id = req.params.product_id || req.query.product_id || undefined;
  let results = {};
  if (!product_id) {
    res.status(400).json('missing product id');
  }
  db.one(
    `SELECT *
    FROM product
    WHERE id=$1`,
    [product_id]
  )
    .then(data => {
      Object.assign(results, data);
      return db.many(
        `SELECT feature, value
        FROM features
        WHERE product_id = $1`,
        [product_id]
      );
    })
    .then(data => {
      results.features = data;
      res.status(200).json(results);
    })
    .catch(err => {
      if ((err.name = 'QueryResultError')) {
        res.status(404);
      }
      res.status(500);
      throw err;
    });
};

// //get product with features by product id
// const getProductById = (req, res) => {
//   //when end point if /product/:product_id => product_id is set to params
//   //when end point if /product[/]?product_id => product_id is set to query
//   let product_id = req.params.product_id || req.query.product_id || undefined;
//   let results = {};
//   if (!product_id) {
//     res.status(400).json('missing product id');
//   }
//   db.one(
//     `SELECT p.*, json_agg(f.*) as features
//     FROM(
//     (
//       SELECT *
//       FROM product
//       WHERE product.id=$1
//     )AS p
//     LEFT JOIN
//     features AS f
//     ON p.id=f.product_id
//     )
//     Group by p.id, p.name, p.slogan, p.description, p.category, p.default_price;
//     `,
//     [product_id]
//   )

//     .then(data => {
//       results.features = data;
//       res.status(200).json(results);
//     })
//     .catch(function(error) {
//       res.status(500);
//       throw error;
//     });
// };

//get product styles by product id
const getStyles = (req, res) => {
  const product_id = req.params.product_id || undefined;
  if (!product_id) {
    res.status(400).json('invalid id');
  }
  let results = [];
  db.many(
    `
    SELECT s.*, 
        json_agg(DISTINCT p.*) AS photos, 
        json_agg(DISTINCT sk.*) AS skus
    FROM (select * from styles where product_id=${product_id}) s
    JOIN (select * from photos where photos.styleid in (select id from styles where product_id=${product_id})) as p ON p.styleid = s.id
    JOIN (select * from skus where skus.styleid in (select id from styles where product_id=${product_id})) as sk ON s.id = sk.styleid
    GROUP BY s.id, s.sale_price, s.original_price, s.default_style, s.name, s.product_id
 `
  )
    .then(data => {
      return Promise.all(
        data.map(style => {
          let obj = {};
          let skus = style.skus;
          for (let i = 0; i < skus.length; i++) {
            obj[skus[i].size] = skus[i].quantity;
          }
          style.skus = obj;
          results = data;
        })
      );
    })
    .then(data => {
      res.send({
        product_id: product_id,
        results: results,
      });
    })
    .catch(err => {
      if ((err.name = 'QueryResultError')) {
        res.status(404);
      }
      res.status(500);
      throw err;
    });
};

// const getStyles = (req, res) => {
//   const product_id = req.params.product_id || undefined;
//   if (!product_id) {
//     res.status(400).json('invalid id');
//   }
//   let wait = undefined;
//   db.many(`SELECT * FROM styles where product_id=$1`, [product_id])
//     .then(styles => {
//       wait = styles.length;
//       for (let i = 0; i < styles.length; i++) {
//         db.multi(
//           `SELECT size, quantity FROM skus WHERE styleId=${styles[i].id};
//           SELECT url, thumbnail_url FROM photos WHERE styleId=${styles[i].id}`
//         )
//           .then(([skus, photos]) => {
//             wait--;
//             styles[i].skus = skus;
//             styles[i].photos = photos;
//             if (wait === 0) {
//               res.json({
//                 product_id: product_id,
//                 results: styles,
//               });
//             }
//           })
//           .catch(err => {
//             throw err;
//           });
//       }
//     })
//     .catch(err => {
//       throw err;
//     });
// };

//get related product by product id
const getRelatedById = (req, res) => {
  const product_id = req.params.product_id || undefined;
  if (!product_id) {
    res.status(400);
  }
  db.one(
    `SELECT product_id, json_agg(related_product_id) as related
    FROM related
    WHERE product_id = ${product_id}
    group by product_id;`
  )
    .then(data => {
      res.status(200).json(data.related);
    })
    .catch(err => {
      console.log(err);
      if ((err.name = 'QueryResultError')) {
        res.sendStatus(404);
      }
      res.sendStatus(500);
      throw err;
    });
};
module.exports = {
  getProducts,
  getProductById,
  getStyles,
  getRelatedById,
};
