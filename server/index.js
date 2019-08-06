require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const router = require('./router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    info: 'Node.js, Express, and Postgres API!!!',
  });
});

app.use(router);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

module.exports = app;
