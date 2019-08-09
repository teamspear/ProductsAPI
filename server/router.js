const db = require('./queries');
const express = require('express');
const router = express.Router();

//for loader.io load test
router.get('/loaderio-41d956bc6bf42972bdd147d1b38eed8e', (req, res) => {
  res.send('loaderio-41d956bc6bf42972bdd147d1b38eed8e');
});
router.get('/products/list', db.getProducts);
router.get('/products/:product_id', db.getProductById);
router.get('/products/', db.getProductById);
router.get('/products/:product_id/styles', db.getStyles);
router.get('/products/:product_id/related', db.getRelatedById);

module.exports = router;
