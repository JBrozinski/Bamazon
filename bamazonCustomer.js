// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

// The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

//    However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "GoNuggets#1",
  database: "bamazonDB",
});

connection.connect(function (err) {
  if (err) throw err;
  queryAllItems();
});
//item_id, product_name, department, price, stock_quantity
function queryAllItems() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // for (var i = 0; i < res.length; i++) {
    //   console.log(
    //     res[i].item_id +
    //       " | " +
    //       res[i].product_name +
    //       " | " +
    //       res[i].department +
    //       " | " +
    //       res[i].price +
    //       " | " +
    //       res[i].stock_quantity
    //   );
    // }
    // console.log("successfully quried products");
    console.table(res);
    start(res);
  });
}

function start(db) {
  var choices = [];
  for (var i = 0; i < db.length; i++) {
    var item = {
      name: db[i].product_name,
      value: db[i].item_id,
    };
    choices.push(item);
  }
  //   const choices = db.map((x) => ({ name: x.product_name, value: x.item_id }));

  inquirer
    .prompt({
      name: "id",
      type: "list",
      message: "What item would you like?",
      // choices: choices,
      choices,
    })
    .then(function (answers) {
      var item;
      for (var i = 0; i < db.length; i++) {
        if (db[i].item_id === answers.id) {
          item = db[i];
        }
      }

      inquirer
        .prompt({
          name: "quantity",
          type: "input",
          message: "How Many would you like?",
          validate: function (val) {
            return parseInt(val) < item.stock_quantity;
          },
        })
        .then(function (answers) {
          var new_quantity = item.stock_quantity - parseInt(answers.quantity);
          updateStock(new_quantity, item.item_id);
        });
    });
}

function updateStock(number, id) {
  var SQL = "UPDATE products ";
  SQL += "SET stock_quantity = ? ";
  SQL += "WHERE item_id = ?";

  var data = [number, id];
  connection.query(SQL, data, function (err, res) {
    if (err) throw err;
    queryAllItems();
  });
}
