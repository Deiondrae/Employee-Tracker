//import mysql2
const mysql = require("mysql2");

//connect to SQL database
const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "&7970n&P!5So9@)",
        database: "management"
    },
);

module.exports = db;