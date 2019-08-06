--- ##End Point 4##
--- Related Products
--- Returns the id's of products related to the product specified.
--- GET /products/:product_id/related

--- Parameter	Type	Description
--- product_id	integer	Required ID of the Product requested
EXPLAIN ANALYZE SELECT * 
FROM related
WHERE product_id = 999;


EXPLAIN ANALYZE SELECT * 
FROM related
WHERE product_id = 999999;