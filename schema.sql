DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
 product_name VARCHAR(45) NULL,
 department_name VARCHAR(45) NULL,
 price DECIMAL(10,2) NULL,
 quantity INTEGER(10),
  PRIMARY KEY (id)
);



