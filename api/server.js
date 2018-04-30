const API_PORT = 4444;

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({extended: true}));

require("./routes")(app); // Initialize API routes

app.listen(API_PORT, function()
{
	console.log("Understand API server listening");
});