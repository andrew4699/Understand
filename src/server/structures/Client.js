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

	__onDataProcessed(data)
	{
		if(typeof data.requestID === "undefined")
		{
			throw "API message did not include requestID";
		}

		if(typeof data.type === "undefined")
		{
			throw "API message did not include request type";
		}

		this.__routeRequest(data, this);
	}

	__onRawDataReceived(message)
	{
		try
		{
			let messageData = JSON.parse(message);
			this.__onDataProcessed(messageData);
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