module.exports = function(result)
{
    result.textAnnotations.splice(0, 1);
    return result.textAnnotations.map(function(ann)
    {
        return {text: ann.description, bounds: ann.boundingPoly.vertices};
    });
};