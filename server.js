//import express
const express = require("express");
//import connection.js
const db = require("./db/connection");
//port designation for server.js
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded)