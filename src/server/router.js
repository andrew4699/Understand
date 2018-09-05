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

module.exports = function(request, body, client)
{
	if(typeof routes[request.type] === "undefined")
	{
		throw "Unknown request type: " + request.type;
	}

	let respond = function(data)
	{
		const payload = Object.assign({
			requestID: request.requestID, 
		},
		data);

		client.send(payload);
	};

	routes[request.type](body, respond);
};