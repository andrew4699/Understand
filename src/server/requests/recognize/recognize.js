const utils = require("../../lib/utils");
const fs = require("fs");
const getAnnotationBlocks = require("../../lib/getAnnotationBlocks");
const getTextParts = require("../../lib/getTextParts");

const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();

module.exports = function(body, respond)
{
	if(!process.env.MOCK_RESPONSE)
	{
		const path = __dirname + "/mock2.json";
		let mockData = fs.readFileSync(path);
		mockData = JSON.parse(mockData);

		const parts = getTextParts(mockData[0]);
		respond({parts});
		return;
	}

	utils.toImageFile(body, function(path, error)
	{
		if(error)
		{
			console.log("error");
			console.log(error);
			return;
		}

		console.log("Processing image (" + path + ")...");

		client.textDetection(path)
		.then(function(results)
		{
			//console.log(results);
			//fs.writeFileSync(__dirname + "/mock2.json", JSON.stringify(results), "utf8");
			const parts = getTextParts(results[0]);
			respond({parts});
		});
	});
};