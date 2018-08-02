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
        // loop through id, product name, price and display   
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
      // ask for product id
      type: "input",
      message: "What ID # would you like to purchase?",
      name: "select",
    },

    {
      // ask for quanitity
      type: "input",
      message: "How many would you like to purchase?",
      name: "amount"
  },

  ])
  // confirm their purchase
  .then(function(input) {
    var userInput = input.select;
    var userQuantity = input.amount;
    // check for id number to be between 1 and 10
    if (input.select >= 1 && input.select <= 10) {
      console.log("You have selected " + userQuantity + " of item id " + userInput + ".");
    
      connection.query("SELECT * FROM products", function(err, res) {
        // var to subtract user quanitity from database
        var subtract = ((res[userInput - 1].quantity)-userQuantity)
          if (err) throw err;
        // Log all results of the SELECT statement
        if (userQuantity <= res[userInput - 1].quantity){
       console.log("Thank you for your purchase! Your total is $" + userQuantity * (res[userInput - 1].price) + ".");
       var query = connection.query(
        //  update quantity by id
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
          // end of update function message
          console.log(" Have A Great Day!\n");
        connection.end();
        }
      );
        }
       else {
        //  messeage if quantity is not available, reset to select function
         console.log("Sorry, we only have " + res[userInput - 1].quantity + " of this item.")
         select();
       }
      });
    }
    else {
      // message if id is not an DataTransferItem, reset to select function
      console.log("Please pick an item number in the inventory.");
      select();
    }
  })
  .catch(function(err){
    console.log(err);
  });
  
}

