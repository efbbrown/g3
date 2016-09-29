var data;
d3.csv("iris.csv", function(error, csv) {
	
	var parse = function(d) {
		var res = {
			"class": d["class"],
			"petal_length": +d["petal_length"],
			"petal_width": +d["petal_width"],
			"sepal_length": +d["sepal_length"],
			"sepal_width": +d["sepal_width"],
		};
		return res;
	};

	data = csv.map(parse);

	var parameters = {
		"scatterPlot": {
			"chartFunction": g3.scatterPlot,
			"parent": "#scatterPlot",
			"marginRatios": {
				"top": 0.05, "right": 0.05, "bottom": 0.05, "left": 0.05
			},
			"data": data,
			"xVar": "sepal_length",
			"yVar": "petal_length",
			"classVar": "class",
			"voronoi": true
		}
	};

	for (var key in parameters) {
	    // skip loop if the property is from prototype
	    if (!parameters.hasOwnProperty(key)) continue;
	    var obj = parameters[key];
	    obj.chartFunction(obj);
	}

});