--- ##End Point 3##
-- Product Styles with photos and skus
-- Returns the all styles available for the given product.
-- GET /products/:product_id/styles

-- Parameter	Type	Description
-- product_id	integer	Required ID of the Product requested

-- SELECT * FROM
-- (
--   (
--     SELECT styles.id
--     FROM styles
--     WHERE product_id = 99
--   ) AS s
--   LEFT JOIN 
--     photos
--   ON 
--     photos.styleId = s.id
-- ) as new
-- LEFT JOIN
--  skus
-- ON skus.styleId = new.id;

-- SELECT * 
-- FROM
-- (select id from styles where product_id=99) as style,
-- (select * from photos where styleId in (select id from styles where product_id=99)) as photo,
-- (select * from skus where styleId in (select id from styles where product_id=99)) as sku;


---Select from each table individually
select id from styles where product_id=99;
select * from photos where styleId in (select id from styles where product_id=99);
select * from skus where styleId in (select id from styles where product_id=99);



