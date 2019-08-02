--- ##End Point 1##
--- List Products
--- GET /products/list Retrieves the list of products.

--- Parameter	Type	Description
--- page	integer	Selects the page of results to return. Default 1.
--- count	integer	Specifies how many results per page to return. Default 5.

SELECT *
FROM product
LIMIT 5
OFFSET 15

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

---- USE UNION
-- SELECT *
--   FROM product 
--   WHERE product.id=99
-- UNION
--   SELECT * 
--   FROM features 
--   WHERE product_id = 99;

--- ##End Point 3##
-- Product Styles
-- Returns the all styles available for the given product.
-- GET /products/:product_id/styles

-- Parameter	Type	Description
-- product_id	integer	Required ID of the Product requested

SELECT * FROM
(
  (
    SELECT styles.id
    FROM styles
    WHERE product_id = 99
  ) AS s
  LEFT JOIN 
    photos
  ON 
    photos.styleId = s.id
) as new
LEFT JOIN
 skus
ON skus.styleId = new.id;

SELECT * 
FROM
(select id from styles where product_id=99),
  (select * from photos where styleId in (select id from styles where product_id=99)) as photo
  (select * from skus where styleId in (select id from styles where product_id=99)) as sku

--- ##End Point 4##
--- Related Products
--- Returns the id's of products related to the product specified.
--- GET /products/:product_id/related

--- Parameter	Type	Description
--- product_id	integer	Required ID of the Product requested
