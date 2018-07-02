const fs = require("fs");
const nodehun = require("nodehun");
const spellcheck = require("nodehun-sentences");

const hunspell = new nodehun(fs.readFileSync("en_US.aff"),
							 fs.readFileSync("en_US.dic"));

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
	autoCorrect: function(text, finish)
	{
		spellcheck(hunspell, text, function(error, typos)
		{
			if(error)
			{
				throw error;
			}

			let correctedText = text,
				change = 0; // shift from positions in original "Text"

			typos.forEach(function(typo)
			{
				//console.log("PREV: " + correctedText);
				//console.log("FIXING: " + typo.word + " ---- TO: " + typo.suggestions[0]);
				correctedText = correctedText.substring(0, typo.positions[0].from + change) +
								typo.suggestions[0] +
								correctedText.substring(typo.positions[0].to + change, correctedText.length);
				//console.log("AFTER: " + correctedText);

				change += typo.suggestions[0].length - typo.word.length;

				//console.log(typo.positions);
				//console.log("attempt correct " + typo.word + " to " + autocorrect(typo.word));
			});

			finish(correctedText);

			//console.log("ORIG: " + text);
			//console.log("CORRECTED: " + correctedText);

			/*console.log("\n\nTYPOS:\n\n");
			console.log(typos);*/
		});

		return text;
	}
};

module.exports = utils;