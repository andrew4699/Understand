/*


	FUTURE:

	API KEY
	______________________

	CHECK request.apiKEY




*/

const recognize = require("./requests/recognize/recognize");

const routes =
{
	"recognize": recognize
};

module.exports = function(request, client)
{
	if(typeof routes[request.type] === "undefined")
	{
		throw "Unknown request type: " + request.type;
	}

	let respond = function(data)
	{
		let payload = Object.assign({
										requestID: request.requestID, 
									 	date: Date.now()
									},
									data);
		client.send(payload);
	};

	routes[request.type](request, respond);
};