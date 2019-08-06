const db = require('./queries');
const express = require('express');
const router = express.Router();

router.get('/products/list', db.getProducts);
router.get('/products/:product_id', db.getProductById);
router.get('/products/', db.getProductById);
router.get('/products/:product_id/styles', db.getStyles);
router.get('/products/:product_id/related', db.getRelatedById);

module.exports = router;
