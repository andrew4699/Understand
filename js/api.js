const DEFAULT_API_URL = "http://localhost:4444";

const REQUEST_EVENTS = ["progress", "load", "error", "abort"];

class UnderstandAPI
{
	constructor(key)
	{
		this.__apiKey = key;
		this.__apiURL = DEFAULT_API_URL;
	}

	recognize(image, listeners)
	{
		this.__sendRequest("recognize", {image}, listeners);
	}

	__sendRequest(type, data, listeners)
	{
		// Prepare request
		let req = new XMLHttpRequest();
		req.open("POST", this.__apiURL + "/" + type);
		req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

		// Bind events
		for(let i = 0; i < REQUEST_EVENTS.length; i++)
		{
			let event = REQUEST_EVENTS[i];
			
			if(event in listeners)
			{
				req.addEventListener(event, listeners[event]);
			}
		}

		/*if("error" in listeners)
		{
			req.addEventListener("error", listeners.error);
		}

		if("success" in listeners)
		{
			req.addEventListener("load", function(event)
			{
				listeners.success(req.response);
			});
		}*/

		// Send data
		let postData =
		{
			apiKey: this.__apiKey,
			date: Date.now(),
			...data,
		}

		req.send(JSON.stringify(postData));
	}
}