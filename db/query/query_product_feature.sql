--- ##End Point 2##
-- Product Information
-- Returns all product level information for a specified product id.
-- GET /products/:product_id

-- Parameter	Type	Description
-- product_id	integer	Required ID of the Product requested

---- USE JOIN
SELECT *
FROM(
(
  SELECT *
  FROM product 
  WHERE product.id=99
)AS p
LEFT JOIN 
features AS f
ON p.id=f.product_id
);


  -- SELECT * 
  -- FROM features 
  -- WHERE product_id = 99;
