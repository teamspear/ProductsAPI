--- no issue
\copy product FROM 'dataset/product.csv' DELIMITER ',' CSV HEADER;
--- no issue after removing constriant on related product id
\copy related FROM 'dataset/related.csv' DELIMITER ',' CSV HEADER;
\copy features FROM 'dataset/features.csv' DELIMITER ',' CSV;
--- saving sale_price as char to handel 'null' values
\copy styles FROM 'dataset/styles.csv' DELIMITER ',' CSV HEADER;
\copy skus FROM 'dataset/skus.csv' DELIMITER ',' CSV HEADER;
\copy photos FROM 'dataset/new.csv' DELIMITER ',' CSV HEADER;
--- had to split photos into two seprate files
\copy photos_temp (id,styleId,thumbnail_url,"url") FROM 'dataset/part1.csv' DELIMITER ',' CSV HEADER;
\copy photos_temp (id,styleId,thumbnail_url,"url") FROM 'dataset/part2.csv' DELIMITER ',' CSV HEADER;

insert into photos (styleId, thumbnail_url, url)
select distinct styleId, thumbnail_url, url 
from photos_temp;





