const inquirer = require("inquirer");
const consoleT = require("console.table");
//import connection.js
const db = require("./db/connection");

//port designation for server.js
const PORT = process.env.PORT || 3001;

db.connect(err => {
    if(err) throw err;
    console.log("Database Connected.");
});