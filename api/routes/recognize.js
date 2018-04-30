const {toImageFile} = require("../lib/utils");
const tesseract = require("node-tesseract");

module.exports = function(req, res)
{
	//console.log(req.body);
	
	let imgPath = toImageFile(req.body.image, function(error)
	{
		if(error)
		{
			console.log("error");
			console.log(error);
			return;
		}

		//console.log("path || " + imgPath);

		console.log("Processing image...");

		tesseract.process(imgPath, function(err, text)
		{
			if(err)
			{
				console.log("error: " + err);
				res.status(400)
				res.send(err);
			}
			else
			{
				console.log(text);

				let data = {text};
				res.json(data);
			}
		});
	});

	//res.json(req.body);
	//res.send(JSON.stringify(req.body));
};