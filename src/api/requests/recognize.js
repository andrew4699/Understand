const utils = require("../lib/utils");
const tesseract = require("node-tesseract");
const rmgarbage = require("rmgarbage");
const fs = require("fs");

const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();

module.exports = function(data, respond)
{
	utils.toImageFile(data.image, function(path, error)
	{
		if(error)
		{
			console.log("error");
			console.log(error);
			return;
		}

		//console.log("path || " + path);

		console.log("Processing image (" + path + ")...");

		client.textDetection(path)
		.then(function(results)
		{
			console.log(results[0]);
			fs.writeFileSync("api-example.txt", utils.inspect(results[0]));
			console.log("frwitten");
			respond({abc: results[0], text: results[0].fullTextAnnotation.text});
		});

		/*tesseract.process(path, function(err, text)
		{
			if(err)
			{
				console.log("error: " + err);
				respond({error: err});
			}
			else
			{
				let clean = text;
				clean = rmgarbage(text);
				clean = utils.autoCorrect(clean, function(correctedText)
				{
					respond({text: correctedText});
					console.log("> Response sent (" + path + ")");
				});
			}
		});*/
	});
};