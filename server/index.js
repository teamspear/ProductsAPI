const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    info: 'Node.js, Express, and Postgres API!!!',
  });
});

const db = require('./queries');
app.get('/products/list', db.getProducts);
app.get('/products/:product_id', db.getProductById);
app.get('/products/', db.getProductById);
app.get('/products/:product_id/styles', db.getStyles);
app.get('/products/:product_id/related', db.getRelatedById);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
