--- ##End Point 3##
-- Product Styles with photos and skus
-- Returns the all styles available for the given product.
-- GET /products/:product_id/styles

-- Parameter	Type	Description
-- product_id	integer	Required ID of the Product requested

-- SELECT * 
-- FROM
-- (select id from styles where product_id=99) as style,
-- (select * from photos where styleId in (select id from styles where product_id=99)) as photo,
-- (select * from skus where styleId in (select id from styles where product_id=99)) as sku;

EXPLAIN ANALYZE SELECT s.id, json_agg(DISTINCT p.*) AS photos, json_agg(DISTINCT sk.*) AS sku
FROM (select * from styles where product_id=990009) s
JOIN (select * from photos where photos.styleid in (select id from styles where product_id=990009)) as p ON p.styleid = s.id
JOIN (select * from skus where skus.styleid in (select id from styles where product_id=990009)) as sk ON s.id = sk.styleid
GROUP BY s.id;

-- select ss.styleid,json_build_object(json_agg(json_build_object(ss.size, ss.quantity))) as sku 
-- from skus as ss
-- where ss.styleid 
-- in (select id from styles where product_id=990009)
-- group by ss.styleid

