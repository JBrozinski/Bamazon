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
          var new_quantity = item.stock_quantity - parseFloat(answers.quantity);
          // console.log(answers.quantity);
          updateStock(new_quantity, item.item_id);
          console.log(
            "NEW TOTAL = $",
            (answers.quantity * parseFloat(item.price)).toFixed(2)
          );
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
