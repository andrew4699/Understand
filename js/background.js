let api;

function onLoad()
{
	if(window.location.href.slice(-4) !== ".pdf")
		return;

	console.log("onLoad");

	api = new UnderstandAPI("THIS IS A TEST KEY MAKE SURE TO CHANGE IT");

	let plugin = $("#plugin")[0];

	let img = "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7";
	api.recognize
	(
		img,
		function(response, error)
		{
			if(error)
			{
				console.log("error", error);
			}
			else
			{
				console.log("response", response);
			}

		}
	);
}

onLoad();