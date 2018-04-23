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

	__sendRequest(type, data, finished)
	{
		// Prepare request
		let req = new XMLHttpRequest();
		req.open("POST", this.__apiURL + "/" + type);
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
		}

		req.send(JSON.stringify(postData));
	}
}