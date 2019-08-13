const redis = require('redis');
const client = redis.createClient();

const pgp = require('pg-promise')(/* options */);
//const db = pgp('postgres://sdc:greenfield@localhost:5432/product');
const db = pgp(
  'postgres://power_user:greenfield@ec2-34-230-49-12.compute-1.amazonaws.com:5432/products'
);

const logErr = (error, code, request) => {
  db.one(`insert into errorlog(error, code, request) values ($1, $2, $3)`, [
    error,
    code,
    request,
  ]).catch(err => {
    console.log('logged err:', request);
  });
};

//get a list of product with user specified count and page
//defualt count is 5, and page is 1
const getProducts = (req, res) => {
  let limit = req.query.count || 5;
  let offset = req.query.count * (req.query.page - 1) || 0;
  let query = `SELECT * FROM product WHERE row_number > ${offset} LIMIT ${limit}`;
  // Try fetching the result from Redis first in case we have it cached
  return client.get(query, (err, result) => {
    // If that key exist in Redis store
    if (result) {
      res.status(200).json(JSON.parse(result));
    } else {
      return db
        .many(query)
        .then(function(data) {
          res.status(200).json(data);
          client.setex(query, 3600, JSON.stringify(data));
          // Send JSON response to client
          // })
        })
        .catch(err => {
          console.log(err.code);
          if (err.code === 'No data returned from the query.') {
            res.status(404).end();
            logErr(err, 404, query);
          } else {
            res.status(500).end();
            logErr('error', 500, query);
          }
        });
    }
  });
};

//get product with features by product id
const getProductById = (req, res) => {
  //when end point if /product/:product_id => product_id is set to params
  //when end point if /product[/]?product_id => product_id is set to query
  let product_id = req.params.product_id || req.query.product_id || undefined;
  let results = {};
  if (!product_id) {
    res.status(400).end;
  }
  const query = `SELECT * FROM product WHERE id=${product_id}`;
  // Try fetching the result from Redis first in case we have it cached
  return client.get(query, (err, result) => {
    // If that key exist in Redis store
    if (result) {
      res.status(200).json(JSON.parse(result));
    } else {
      return db
        .one(query)
        .then(data => {
          if (data) {
            Object.assign(results, data);
            return db.many(
              `SELECT feature, value
          FROM features
          WHERE product_id = $1`,
              [product_id]
            );
          }
        })
        .then(data => {
          results.features = data;
          res.status(200).json(results);
          client.setex(query, 3600, JSON.stringify(results));
        })
        .catch(err => {
          if (err.message === 'No data returned from the query.') {
            res.status(404).end();
            logErr(err.message, 404, query);
          } else {
            res.status(500).end();
            logErr(err.message, 500, query);
          }
        });
    }
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
//       res.status(500).end();
//       throw error;
//     });
// };

//get product styles by product id
const getStyles = (req, res) => {
  const product_id = req.params.product_id || undefined;
  if (!product_id) {
    res.status(400).end();
  }
  let results = [];
  const query = `
  SELECT s.*, json_agg(DISTINCT p.*) AS photos, json_agg(DISTINCT sk.*) AS skus
    FROM (select * from styles where product_id=${product_id}) s
    JOIN (select * from photos where photos.styleid in (select id from styles where product_id=${product_id})) as p ON p.styleid = s.id
    JOIN (select * from skus where skus.styleid in (select id from styles where product_id=${product_id})) as sk ON s.id = sk.styleid
    GROUP BY s.id, s.sale_price, s.original_price, s.default_style, s.name, s.product_id`;
  return client.get(query, (err, result) => {
    // If that key exist in Redis store
    if (result) {
      res.status(200).json(JSON.parse(result));
    } else {
      return db
        .many(query)
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
          client.setex(
            query,
            3600,
            JSON.stringify({
              product_id: product_id,
              results: results,
            })
          );
        })
        .catch(err => {
          if (err.message === 'No data returned from the query.') {
            res.status(404).end();
            logErr(err.message, 404, query);
          } else {
            res.status(500).end();
            logErr(err.message, 500, query);
          }
        });
    }
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
//             console.log(err)
//           });
//       }
//     })
//     .catch(err => {
//       console.log(err)
//     });
// };

//get related product by product id
const getRelatedById = (req, res) => {
  const product_id = req.params.product_id || undefined;
  if (!product_id) {
    res.status(400).end();
  }
  const query = `
    SELECT product_id, json_agg(related_product_id) as related
    FROM related
    WHERE product_id = ${product_id}
    group by product_id;`;
  return client.get(query, (err, result) => {
    // If that key exist in Redis store
    if (result) {
      res.status(200).json(JSON.parse(result));
    } else {
      return db
        .one(query)
        .then(data => {
          res.status(200).json(data.related);
          client.setex(query, 3600, JSON.stringify(data.related));
        })
        .catch(err => {
          if (err.message === 'No data returned from the query.') {
            res.status(404).end();
            logErr(err.message, 404, query);
          } else {
            res.status(500).end();
            logErr(err.message, 500, query);
          }
        });
    }
  });
};
module.exports = {
  getProducts,
  getProductById,
  getStyles,
  getRelatedById,
};
