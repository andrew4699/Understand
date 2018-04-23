let utils =
{
	toImageLike: function(obj)
	{
		if(typeof obj === "string")
		{
			return Buffer.from(obj, "base64");
		}
	}
};

module.exports = utils;