drop database if exists bamazonDB;
create database bamazonDB;
use bamazonDB;

create table products
(
    item_id integer
    auto_increment not null,
product_name varchar
    (100),
department varchar
    (100),
price decimal,
stock_quantity integer,
primary key
    (item_id)
);

    select *
    from products;

    insert into products
        (item_id, product_name, department, price, stock_quantity)
    values
        (1, "nintendo_switch", "video_games", 200.99, 2000),
        (2, "bike_helmet", 'sporting_goods', 21.75, 950),
        (3, 'Shrek', 'DVDs', 9.99, 10000),
        (4, 'Airplane', 'DVDs', 9.99, 500),
        (5, 'snowboard', 'sporting_goods', 399.99, 25),
        (6, 'Doom', 'video_games', 59.99, 666),
        (7, 'hand_towels', 'home_goods', 11.99, 300),
        (8, 'shower_curtain', 'home_goods', 28.99, 55),
        (9, 'coffee_table', 'home_goods', 159.00, 277),
        (10, 'A_Scanner_Darkly', 'Books', 17.99, 2500);