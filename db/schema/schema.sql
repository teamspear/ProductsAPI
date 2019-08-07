--drop all tables to have a clean start
--drop table features, photos, related, skus, styles, product;
-- create an empty products table
CREATE TABLE IF NOT EXISTS Product
(
  id PRIMARY KEY,
  row_number serial NOT NULL,
  "name" character varying(255),
  slogan text,
  "description" text,
  category character varying(255),
  default_price integer
);
--- as there are bad data, we want to remove some foreignkey constrains, 
--- we can filter data when querying them;
CREATE TABLE IF NOT EXISTS Related
(
  id serial NOT NULL PRIMARY KEY,
  product_id integer REFERENCES Product(id),
  related_product_id integer
);
CREATE TABLE IF NOT EXISTS Features
(
  id serial NOT NULL PRIMARY KEY,
  product_id integer REFERENCES Product(id),
  feature character varying(255),
  "value" character varying(255)
);

-- create an empty styles table
CREATE TABLE IF NOT EXISTS Styles
(
  id serial NOT NULL PRIMARY KEY,
  product_id integer REFERENCES Product(id),
  name character varying(255),
  sale_price character varying(50),
  original_price integer,
  default_style boolean
);

-- create an empty photos table
CREATE TABLE IF NOT EXISTS Photos_temp
(
  auto_id serial NOT NULL PRIMARY KEY,
  id integer,
  styleId integer REFERENCES Styles(id),
  thumbnail_url character varying(255),
  "url" character varying(255)
);

-- create an empty photos table
CREATE TABLE IF NOT EXISTS Photos
(
  id serial NOT NULL PRIMARY KEY,
  styleId integer REFERENCES Styles(id),
  thumbnail_url character varying(255),
  "url" character varying(255)
);

-- create an empty sku table
CREATE TABLE IF NOT EXISTS SKUs
(
  id serial NOT NULL PRIMARY KEY,
  styleId integer REFERENCES Styles(id),
  size character varying(50),
  quantity integer
);
