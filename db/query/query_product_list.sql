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
