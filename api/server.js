const SERVER_PORT = 4444;

const router = require("./router");
const Client = require("./structures/Client");
const ws = require("ws");
const server = new ws.Server({port: SERVER_PORT});

let clients = [];

console.log("Understand API web socket listening");

server.on("connection", function(client)
{
	let c = new Client(client, router);
	clients.push(c);
});