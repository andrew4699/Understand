const utils = require("../../lib/utils");
const tesseract = require("node-tesseract");
const rmgarbage = require("rmgarbage");
const fs = require("fs");
const getAnnotationBlocks = require("../../lib/getAnnotationBlocks");

const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();

module.exports = function(data, respond)
{
	if(process.env.MOCK_RESPONSE)
	{
		const path = __dirname + "/mock.json";
		let mockData = fs.readFileSync(path);
		mockData = JSON.parse(mockData);

		const blocks = getAnnotationBlocks(mockData[0].fullTextAnnotation);
		respond({blocks});
		return;
	}

	utils.toImageFile(data.image, function(path, error)
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
			const blocks = getAnnotationBlocks(results[0].fullTextAnnotation);
			respond({blocks});
		});
	});
};