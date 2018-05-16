const fs = require("fs");

let utils =
{
	toImageFile: function(img, finished)
	{
		if(typeof img === "string")
		{
			if(img.indexOf("data:image") > -1)
			{
				let rand = Math.floor(Math.random() * 500);
				let fileData = img.replace(/^data:image\/png;base64,/, ""),
					filePath = "./images/out" + rand + ".png";

				fs.writeFile(filePath, fileData, "base64", function(error)
				{
					finished(filePath, error);
				});
			}
			else
			{
				finished(img);
			}
		}
		else
		{
			let err = "Invalid image (typeof " + (typeof img) + ")";
			console.log(err);
			console.log(img);
			finished(img, err);
		}
	},
	autoCorrect: function(text, dictionary)
	{
		/* do this */
	}
};

module.exports = utils;