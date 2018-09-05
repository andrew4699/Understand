const {parseMessage} = require("../lib/utils");

class Client
{
	constructor(socket, routeRequest)
	{
		this.__socket = socket;
		this.__bindSocketEvents();

		this.__routeRequest = routeRequest;
		
		// Assign a unique client ID
		this.__clientID = Client.nextClientID;
		Client.nextClientID++;

		console.log("Client #" + this.__clientID + " has connected")
	}

	send(message)
	{
		this.__socket.send(JSON.stringify(message));
	}

	__bindSocketEvents()
	{
		this.__socket.on("message", this.__onRawDataReceived.bind(this));
	}

	//__onDataProcessed(data)
	__onDataProcessed(header, body)
	{
		if(typeof header.requestID === "undefined")
		{
			throw "API message did not include requestID";
		}

		if(typeof header.type === "undefined")
		{
			throw "API message did not include request type";
		}

		this.__routeRequest(header, body, this);
	}

	__onRawDataReceived(message)
	{
		const {header, body} = parseMessage(message);
		
		try
		{
			//let messageData = JSON.parse(message);
			this.__onDataProcessed(header, body);
		}
		catch(ex)
		{
			console.log(ex);
			console.log("Received non-JSON message");
			console.log(message);
		}
	}
}

Client.nextClientID = 0;

module.exports = Client;