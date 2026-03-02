CREATE DATABASE products_db;
USE products_db;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price FLOAT NOT NULL,
    quantity INT NOT NULL
);

INSERT INTO products (name, price, quantity) VALUES 
('Laptop', 1000.0, 50),
('Mouse', 25.0, 200),
('Keyboard', 45.0, 150);
