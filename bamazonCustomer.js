var mysql = require("mysql");
var inquirer = require('inquirer')
var figlet = require('figlet');
  
//  display asci bamazon
figlet('BAMAZON', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root", 
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  readProducts();
});
// list out all available items for sale
function readProducts() {
    console.log("Products Available...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      else {                 
        for (var i = 0; i < res.length; i++) {
          console.log("ID: " + res[i].id);
          console.log("NAME: " + res[i].product_name);
          console.log("PRICE: " + res[i].price);
          console.log(" ");
        }
        select();
      }
    }); 
  }
  // prompt user with what they want to purchase
function select() {
  inquirer
  .prompt([
    // Here we create a basic text prompt.
    {
      type: "input",
      message: "What ID # would you like to purchase?",
      name: "select",
    },

    {
      type: "input",
      message: "How many would you like to purchase?",
      name: "amount"
  },

  ])
  // confirm their purchase
  .then(function(input) {
    var userInput = input.select;
    var userQuantity = input.amount;
    if (input.select >= 1 && input.select <= 10) {
      console.log("You have selected " + userQuantity + " of item id " + userInput + ".");
    
      connection.query("SELECT * FROM products", function(err, res) {
        var subtract = ((res[userInput - 1].quantity)-userQuantity)
          if (err) throw err;
        // Log all results of the SELECT statement
        if (userQuantity <= res[userInput - 1].quantity){
       console.log("Thank you for your purchase! Your total is $" + userQuantity * (res[userInput - 1].price) + ".");
       var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            quantity: subtract
          },
          {
            id: userInput
          }
        ],
        function(err, res) {
          console.log(" Have A Great Day!\n");
        connection.end();
        }
      );
        }
       else {
         console.log("Sorry, we only have " + res[userInput - 1].quantity + " of this item.")
         select();
       }
      });
    }
    else {
      console.log("Please pick an item number in the inventory.");
      select();
    }
  })
  .catch(function(err){
    console.log(err);
  });
  
}


  // * The first should ask them the ID of the product they would like to buy.
  // * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
// * This means updating the SQL database to reflect the remaining quantity.
// * Once the update goes through, show the customer the total cost of their purchase.

// - - -

// * If this activity took you between 8-10 hours, then you've put enough time into this assignment. Feel free to stop here -- unless you want to take on the next challenge.