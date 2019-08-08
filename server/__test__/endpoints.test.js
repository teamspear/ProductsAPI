const express = require('express');
const app = express();
const router = require('../router');
const request = require('supertest');
const randomNumber = Math.floor(Math.random(1, 1) * 600000 + 1);
const randomPage = Math.floor(Math.random(0, 1) * 100000 + 1);
const randomCount = Math.floor(Math.random(0, 1) * 9 + 1);

const productList = '/products/list';
const productListWithCount = `/products/list?count=${randomCount}&page=${randomPage}`;
const productByQuery = `/products/${randomNumber}`;
const productByParam = `/products/?product_id=${randomNumber}`;
const stylesByProductId = `/products/${randomNumber}/styles`;
const relatedByProductId = `/products/${randomNumber}/related`;

// router.get('/products/:product_id/related', db.getRelatedById);

app.use(router);

//close connection after testing
afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

//==================== Products API test ====================

/**
 * Testing get all products list
 */
describe(`GET ${productList}`, () => {
  test('It responds with an array of products, with default number of 5', async () => {
    const response = await request(app).get(productList);
    expect(response.body.length).toBe(5);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('slogan');
    expect(response.body[0]).toHaveProperty('description');
    expect(response.body[0]).toHaveProperty('category');
    expect(response.body[0]).toHaveProperty('default_price');
    expect(response.statusCode).toBe(200);
  });
});

/**
 * Testing get products list with given count number
 */
describe(`GET ${productListWithCount}`, () => {
  test('It responds with an array of product with given count number', async () => {
    const response = await request(app).get(productListWithCount);
    expect(response.body.length).toBe(randomCount);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('slogan');
    expect(response.body[0]).toHaveProperty('description');
    expect(response.body[0]).toHaveProperty('category');
    expect(response.body[0]).toHaveProperty('default_price');
    expect(response.statusCode).toBe(200);
  });
});

/**
 * Testing get product with features by product id as parameter
 */
describe(`GET ${productByQuery}`, () => {
  test('It responds with an the requested product details with all features using product_id as query', async () => {
    const response = await request(app).get(productByQuery);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(randomNumber);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('slogan');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('category');
    expect(response.body).toHaveProperty('default_price');
    expect(response.body).toHaveProperty('features');
    expect(response.body.features[0]).toHaveProperty('feature');
    expect(response.body.features[0]).toHaveProperty('value');
    expect(response.statusCode).toBe(200);
  });
});

/**
 * Testing get product with features by product id as query
 */
describe(`GET ${productByParam}`, () => {
  test('It responds with an the requested product details with all features using product_id as param', async () => {
    const response = await request(app).get(productByParam);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(randomNumber);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('slogan');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('category');
    expect(response.body).toHaveProperty('default_price');
    expect(response.body).toHaveProperty('features');
    expect(response.body.features[0]).toHaveProperty('feature');
    expect(response.body.features[0]).toHaveProperty('value');
    expect(response.statusCode).toBe(200);
  });
});

/**
 * Testing get styles by product id as query
 */
describe(`GET ${stylesByProductId}`, () => {
  test('It responds with an array of style by requested product_id', async () => {
    const response = await request(app).get(stylesByProductId);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('product_id');
    expect(response.body.product_id).toBe(`${randomNumber}`);
    expect(response.body).toHaveProperty('results');
    expect(response.body.results[0]).toHaveProperty('id');
    expect(response.body.results[0]).toHaveProperty('name');
    expect(response.body.results[0]).toHaveProperty('sale_price');
    expect(response.body.results[0]).toHaveProperty('original_price');
    expect(response.body.results[0]).toHaveProperty('default_style');
    expect(response.body.results[0]).toHaveProperty('photos');
    expect(response.body.results[0].photos[0]).toHaveProperty('url');
    expect(response.body.results[0].photos[0]).toHaveProperty('thumbnail_url');
    expect(response.body.results[0]).toHaveProperty('skus');
    expect(typeof response.body.results[0].skus).toBe('object');
    expect(response.statusCode).toBe(200);
  });
});

/**
 * Testing get product by product id as query
 */
describe(`GET ${relatedByProductId}`, () => {
  test('It responds with an array of related product id by given product_id', async () => {
    const response = await request(app).get(relatedByProductId);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.statusCode).toBe(200);
  });
});

// router.get('/products/:product_id/styles', db.getStyles);
// router.get('/products/:product_id/related', db.getRelatedById);
