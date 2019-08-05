const pgp = require('pg-promise')(/* options */);
const db = pgp('postgres://sdc:greenfield@localhost:5432/product');
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
    .catch(function(error) {
      res.status(500);
      throw error;
    });
};

const getProductById = (req, res) => {
  //when end point if /product/:product_id => product_id is set to params
  //when end point if /product[/]?product_id => product_id is set to query
  let product_id = req.params.product_id || req.query.product_id || undefined;
  let results = {};
  if (!product_id) {
    console.log(product_id);
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
    .catch(function(error) {
      res.status(500);
      throw error;
    });
};

const getStyles = (req, res) => {
  const product_id = req.params.product_id || undefined;
  if (!product_id) {
    res.status(400).json('invalid id');
  }
  let wait = undefined;
  db.many(`SELECT * FROM styles where product_id=$1`, [product_id])
    .then(styles => {
      wait = styles.length;
      for (let i = 0; i < styles.length; i++) {
        db.multi(
          `SELECT size, quantity FROM skus WHERE styleId=${styles[i].id};
          SELECT url, thumbnail_url FROM photos WHERE styleId=${styles[i].id}`
        ).then(([skus, photos]) => {
          wait--;
          styles[i].skus = skus;
          styles[i].photos = photos;
          if (wait === 0) {
            res.json({
              product_id: product_id,
              results: styles,
            });
          }
        });
      }
    })
    .catch(err => {
      throw err;
    });
};
const getRelatedById = (req, res) => {
  const product_id = req.params.product_id || undefined;
  if (!product_id) {
    res.status(400);
  }
  db.many(
    `SELECT related_product_id FROM related WHERE product_id=${product_id}`
  )
    .then(data => {
      let related = [];
      data.map(r => {
        related.push(r.related_product_id);
      });
      res.status(200).json(related);
    })
    .catch(err => {
      res.status(500);
      throw err;
    });
};
module.exports = {
  getProducts,
  getProductById,
  getStyles,
  getRelatedById,
};
