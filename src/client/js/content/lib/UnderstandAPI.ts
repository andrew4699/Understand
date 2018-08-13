declare interface ResponseHandlers
{
	[reqID: number]: ResponseCallback;
}

declare type ResponseData = any;
declare type ResponseCallback = (data: ResponseData) => void;
declare type MessageData = any;

const WEBSOCKET_URL = "ws://localhost:4444";

export default class UnderstandAPI
{
	private __apiKey: string;
	private __socket: WebSocket;
	private __nextRequestID: number;
	private __responseHandlers: ResponseHandlers;

	public onconnect: () => void;

	public constructor(key: string)
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
	public recognize(image: string, finished: ResponseCallback): void
	{
		this.__sendRequest("recognize", {image}, finished);
	}

	private __onConnected(): void
	{
		if(typeof this.onconnect !== "undefined")
		{
			this.onconnect();
		}

		console.log("API socket established");
	}

	private __onDisconnected(): void
	{
		console.warn("Disconnected from API server");
	}

	private __onDataProcessed(data: MessageData): void
	{
		if(typeof data.requestID === "undefined")
		{
			throw new Error("API message did not include requestID");
		}

		if(typeof this.__responseHandlers[data.requestID] !== "function")
		{
			throw new Error("No valid response handler exists for requestID = " + data.requestID);
		}

		let fn = this.__responseHandlers[data.requestID];
		fn.call(null, data);
	}

	private __onRawDataReceived(message: MessageData): void
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

	private __onBeforeUnload(): void
	{
		this.__socket.close();
	}

	private __bindSocketEvents(): void
	{
		this.__socket.onopen = this.__onConnected.bind(this);
		this.__socket.onclose = this.__onDisconnected.bind(this);
		window.addEventListener("beforeunload", this.__onBeforeUnload.bind(this));
		this.__socket.onmessage = this.__onRawDataReceived.bind(this);
	}

	private __sendRequest(type: string, data: MessageData, finished: ResponseCallback): void
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

	private __getNextRequestID(): number
	{
		this.__nextRequestID++;
		return this.__nextRequestID;
	}

	/*private __sendRequest(type, data, finished): void
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