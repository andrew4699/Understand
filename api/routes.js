module.exports = function(app)
{
	app.post("/recognize", function(req, res)
	{
		console.log(req.body);
		//res.json(req.body);
		res.send(JSON.stringify(req.body));
	});
};