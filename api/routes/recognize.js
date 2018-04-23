/*const Tesseract = require("tesseract.js");
const {toImageLike} = require("../lib/utils");*/
const {exec} = require("child_process");
const tesseract = require("node-tesseract");

module.exports = function(req, res)
{
	console.log(req.body);
	
	//let img = toImageLike(req.body.image);

	/*Tesseract.recognize("./long.jpg")
	.progress(message => console.log(message))
	.then(function(result)
	{
		console.log("## done");
		//console.log(result);
	});*/

	/*exec("tesseract ...", (error, stdout, stderr)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log("stdout", stdout);
		}
	});*/

	tesseract.process("./long.jpg", function(err, text)
	{
		if(err)
			console.log(err);
		else
			console.log(text);
	});

	//res.json(req.body);
	//res.send(JSON.stringify(req.body));
};