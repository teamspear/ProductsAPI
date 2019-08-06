--- ##End Point 2##
-- Product Information
-- Returns all product level information for a specified product id.
-- GET /products/:product_id

-- Parameter	Type	Description
-- product_id	integer	Required ID of the Product requested

---- USE JOIN
EXPLAIN ANALYZE SELECT p.*, json_agg(f.*) as features
FROM(
(
  SELECT *
  FROM product 
  WHERE product.id=999
)AS p
LEFT JOIN 
features AS f
ON p.id=f.product_id
)
Group by p.id, p.name, p.slogan, p.description, p.category, p.default_price;



EXPLAIN ANALYZE SELECT p.*, json_agg(f.*) as features
FROM(
(
  SELECT *
  FROM product 
  WHERE product.id=999999
)AS p
LEFT JOIN 
features AS f
ON p.id=f.product_id
)
Group by p.id, p.name, p.slogan, p.description, p.category, p.default_price;

--  EXPLAIN ANALYZE  SELECT * 
--   FROM features 
--   WHERE product_id = 999;

--   EXPLAIN ANALYZE  SELECT * 
--   FROM features 
--   WHERE product_id = 999999;
