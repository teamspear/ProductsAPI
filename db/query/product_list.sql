--- ##End Point 1##
--- List Products
--- GET /products/list Retrieves the list of products.

--- Parameter	Type	Description
--- page	integer	Selects the page of results to return. Default 1.
--- count	integer	Specifies how many results per page to return. Default 5.

EXPLAIN ANALYZE
SELECT *
FROM product
LIMIT 100
OFFSET 99900;


EXPLAIN ANALYZE
SELECT *
FROM product
Where row_number > 99900 
ORDER By row_number
LIMIT 100


-- EXPLAIN ANALYZE
-- SELECT *
-- FROM 
-- (SELECT *, ROW_NUMBER() OVER (order by id)
--  FROM product
-- ) x WHERE ROW_NUMBER BETWEEN 10000 AND 10005

