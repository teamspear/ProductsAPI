-- create an empty products table
CREATE TABLE IF NOT EXISTS products
(
  id serial NOT NULL,
  "name" character varying(255),
  slogan text,
  "description" text,
  category character varying(255),
  default_price integer,
  CONSTRAINT products_pkey PRIMARY KEY (id)
)

--inject csv to product table
COPY products
FROM '/Users/xiao/Desktop/Hack\ Reactor/SDc/Assets/product.csv' DELIMITER ',' CSV HEADER;