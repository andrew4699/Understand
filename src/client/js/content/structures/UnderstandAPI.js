"use strict";

const WEBSOCKET_URL = "ws://localhost:4444";

class UnderstandAPI
{
	constructor(key)
	{
		this.__apiKey = key;
		this.__socket = new WebSocket(WEBSOCKET_URL);
		this.__bindSocketEvents();
		this.__nextRequestID = 0;
		this.__responseHandlers = {};
	}

	/*
		image is expected to be a base64 string, ex:
		
			"data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKud="

		finished is expected to be a function(response, error), ex:

			function(response, error)
			{
				if(error) throw error;

				....
			}
	*/
	recognize(image, finished)
	{
		this.__sendRequest("recognize", {image}, finished);
	}

	__onConnected()
	{
		if(typeof this.onconnect !== "undefined")
		{
			this.onconnect();
		}

		console.log("API socket established");
	}

	__onDisconnected()
	{
		console.warn("Disconnected from API server");
	}

	__onDataProcessed(data)
	{
		if(typeof data.requestID === "undefined")
		{
			throw "API message did not include requestID";
		}

		if(typeof this.__responseHandlers[data.requestID] !== "function")
		{
			throw "No valid response handler exists for requestID = " + data.requestID;
		}

		let fn = this.__responseHandlers[data.requestID];
		fn.call(null, data);
	}

	__onRawDataReceived(message)
	{
		try
		{
			let messageData = JSON.parse(message.data);
			this.__onDataProcessed(messageData);
		}
		catch(ex)
		{
			console.log(ex);
			console.log("Received non-JSON message");
			console.log(message);
		}
	}

	__onBeforeUnload()
	{
		this.__socket.close();
	}

	__bindSocketEvents()
	{
		this.__socket.onopen = this.__onConnected.bind(this);
		this.__socket.onclose = this.__onDisconnected.bind(this);
		window.addEventListener("beforeunload", this.__onBeforeUnload.bind(this));
		this.__socket.onmessage = this.__onRawDataReceived.bind(this);
	}

	__sendRequest(type, data, finished)
	{
		let requestID = this.__getNextRequestID();
		this.__responseHandlers[requestID] = finished;

		let payload =
		{
			type,
			requestID,
			apiKey: this.__apiKey,
			date: Date.now(),
			...data
		};

		this.__socket.send(JSON.stringify(payload));
	}

	__getNextRequestID()
	{
		this.__nextRequestID++;
		return this.__nextRequestID;
	}

	/*__sendRequest(type, data, finished)
	{
		// Prepare request
		let req = new XMLHttpRequest();
		req.open("POST", DEFAULT_API_URL + "/" + type);
		req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

		// Bind events
		if(typeof finished !== "undefined")
		{
			req.addEventListener("load", function(event)
			{
				let data;
				
				try
				{
					data = JSON.parse(req.response);
				}
				catch(ex)
				{
					try
					{
						data = JSON.parse(req.responseText);
					}
					catch(ex2)
					{
						data = req.response;
					}
				}

				if(req.status === 404)
				{
					finished(null, req.status + " - " + req.statusText);
				}
				else
				{
					finished(data);
				}
			});

			req.addEventListener("abort", () => console.log("ab"));
			req.addEventListener("err", () => console.log("er"));
		}

		// Send data
		let postData =
		{
			apiKey: this.__apiKey,
			date: Date.now(),
			...data,
		};

		req.send(JSON.stringify(postData));
	}*/
}