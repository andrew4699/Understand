const utils = require("../lib/utils");
const tesseract = require("node-tesseract");
const rmgarbage = require("rmgarbage");

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

		tesseract.process(path, function(err, text)
		{
			if(err)
			{
				console.log("error: " + err);
				respond({error: err});
			}
			else
			{
				//console.log(text);
				console.log("> Response sent (" + path + ")");

				let text = rmgarbage(text);
				text = utils.autoCorrect(text);
				respond({text});
			}
		});
	});
};