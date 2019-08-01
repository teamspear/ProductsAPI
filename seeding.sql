--- no issue
\copy product FROM 'dataset/product.csv' DELIMITER ',' CSV HEADER;
--- no issue after removing constriant on related product id
\copy related FROM 'dataset/related.csv' DELIMITER ',' CSV HEADER;
\copy features FROM 'dataset/features.csv' DELIMITER ',' CSV;
\copy styles FROM 'dataset/styles.csv' DELIMITER ',' CSV HEADER;
\copy skus FROM 'dataset/skus.csv' DELIMITER ',' CSV HEADER;
\copy photos FROM 'dataset/photos.csv' DELIMITER ',' CSV HEADER FORCE QUOTE "thumbnail_url", "url";
