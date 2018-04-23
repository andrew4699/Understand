const recognize = require("./routes/recognize");

module.exports = function(app)
{
	app.post("/recognize", recognize);
};