const fs = require("fs");

let utils =
{
	toImageFile: function(obj, finished)
	{
		if(typeof obj === "string")
		{
			if(obj.indexOf("data:image") > -1)
			{
				let fileData = obj.replace(/^data:image\/jpeg;base64,/, ""),
					filePath = "./out.jpeg";

				fs.writeFile(filePath, fileData, "base64", finished);

				return filePath;
			}
			else return obj;
		}
		else
		{
			console.log("Invalid image object");
			console.log(obj);
			return null;
		}
	}
};

module.exports = utils;