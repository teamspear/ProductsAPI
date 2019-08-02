var pgp = require('pg-promise')(/* options */);
var db = pgp('postgres://sdc:greenfield@localhost:5432/product');

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
      throw error;
    });
};

const getProductInfo = (req, res) => {
  let product_id = req.query.product_id || 5;
  let results = {};
  db.one(
    `SELECT *
    FROM product
    WHERE id=$1`,
    [product_id]
  )
    .then(data => {
      Object.assign(results, data);
      db.many(
        `
      SELECT *
      FROM features
      WHERE product_id = $1
      `,
        [product_id]
      ).then(data => {
        results.features = data;
        res.status(200).json(results);
      });
    })
    .catch(function(error) {
      throw error;
    });
};

module.exports = {
  getProducts,
  getProductInfo,
};
