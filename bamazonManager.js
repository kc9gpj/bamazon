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
    console.log(data);
    console.log("Manager View\n");
    userPrompt();
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
  
});



function userPrompt(){
// Create a "Prompt" with a series of questions.
inquirer
  .prompt([
    // Here we give the user a list to choose from.
    {
      type: "list",
      message: "What would you like to do?",
      choices: ["View Products", "View Low Inventory", "Add Inventory", "Add New Product", "Close Program"],
      name: "task"
    },
    // Here we ask the user to confirm.

  ])
  .then(function(inquirerResponse) {
      var inq = inquirerResponse.task;
  if (inq === "View Products"){
      readProducts();
  }

  else if (inq === "View Low Inventory"){
      lowInventory();

  }

  else if (inq === "Add Inventory"){
    addInventory();

  }

  else if (inq === "Add New Product"){
    addProduct();

  }

  else if (inq === "Close Program"){
    connection.end();

  }
  })
  .catch(function(err){
    console.log(err);
  });
}
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
          console.log("DEPARTMENT: " + res[i].department_name);
          console.log("PRICE: " + res[i].price);
          console.log("QUANTITY: " + res[i].quantity);
          console.log(" ");
        }

        userPrompt();
      }
    }); 
  }

  function lowInventory(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        else {              
          // loop through id, product name, price and display   
          for (var i = 0; i < res.length; i++) {

            if(res[i].quantity < 10 ){
            console.log(res[i].product_name + " is low on inventory. " + res[i].quantity + " are left in stock.")
            } 
          }
          userPrompt();
        }
      }); 
  }
  function addInventory(){
    inquirer.prompt([

        {
            type: "input",
            name: "id",
            message: "What id# would you like to add inventory to?"
        },
        {
            type: "input",
            name: "quantity",
            message: "How much would you like to add?"
        },
  
]).then(function(input) {
    console.log("Inserting a new product...\n");
    var query = connection.query(
      "INSERT INTO products SET ?",
      {
        id: input.id,
        quantity: input.quantity
      },
      function(err, res) {
        // Call updateProduct AFTER the INSERT completes
        userPrompt();
      }
    );
  
    // logs the actual query being run
    console.log(query.sql);
  
  });
}
  function addProduct(){
    
    inquirer.prompt([

        {
            type: "input",
            name: "id",
            message: "What is the id number?"
        },
        {
            type: "input",
            name: "productName",
            message: "What is the product name?"
        },
        {
            type: "input",
            name: "productDep",
            message: "What is the department name?"
        },
        {
            type: "input",
            name: "price",
            message: "What is the price of the product?"
        },
        {
            type: "input",
            name: "quantity",
            message: "What is the quantity of this product?"
        },
      
      ]).then(function(input) {
        console.log("Inserting a new product...\n");
        var query = connection.query(
          "INSERT INTO products SET ?",
          {
            id: input.id,
            product_name: input.productName, 
            department_name: input.productDep,
            price: input.price,
            quantity: input.quantity
          },
          function(err, res) {
            // Call updateProduct AFTER the INSERT completes
            userPrompt();
          }
        );
      
        // logs the actual query being run
        console.log(query.sql);
      
      });
 
  }


// * Create a new Node application called `bamazonManager.js`. Running this application will:

// * List a set of menu options:

//   * View Products for Sale
  
//   * View Low Inventory
  
//   * Add to Inventory
  
//   * Add New Product

// * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

// * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

// * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

// * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

// - - -

// * If you finished Challenge #2 and put in all the hours you were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.

// - - -