/*
    ebrown.g3.js
    v1, 20151115
    v2, 20161001
 
    shortcut binds to g3
    
    New in v2:
    - Compatability with d3 v4

*/

g3 = {};

var ebrown = ebrown || {};
ebrown.g3 = g3;

/*----------------------------------------------*/
/*			Helper Functions					*/
/*----------------------------------------------*/

// check whether options[arg] is defined. If it isn't, assign to it the value def.
g3.checkUndefined = function(arg, def, options) {
  if (options[arg] === null || options[arg] === undefined) {
    return def;
  } else {
    return options[arg];
  }
}

g3.compose = function(g, h){
  return function(d){
      return g(h(d))
  }
}

/*----------------------------------------------*/
/*			Chart Initiation					*/
/*----------------------------------------------*/

// Return clientWidth of element
g3.elementWidth = function(element) {
	return element._groups[0][0].clientWidth;
}

// Return clientHeight of element
g3.elementHeight = function(element) {
	return element._groups[0][0].clientHeight;
}

// Create and return margins
// options = height, width, marginsize
g3.marginObject = function(options) {
  
	var parentHeight = g3.checkUndefined("height", 300, options),
		parentWidth = g3.checkUndefined("width", 300, options),
		marginsize = g3.checkUndefined("marginsize", 300, options);

	var marginObj = {
		top: parentHeight * marginsize,
		right: parentWidth * marginsize,
		bottom: parentHeight * marginsize,
		left: parentWidth * marginsize
	};

	return marginObj;
}

// Calculate and return chart length. Used for both chart width and chart height.
// options = parentLength, marginOne, marginTwo
g3.chartLength = function(options) {
  return options.parentLength - options.marginOne - options.marginTwo;
}

// Append and return a svg with g element
// options = parentDiv, parentWidth, parentHeight, margin
g3.appendChart = function(options) {
  
	var chart = options.parentDiv.append("svg")
		.attr("class", "g3-svg")
	    .attr("width", options.parentWidth)
	    .attr("height", options.parentHeight)
	    .append("g")
	    .attr("transform", "translate(" + options.margin.left + "," + options.margin.top + ")");

	return chart;

}

/*----------------------------------------------*/
/*			Scales								*/
/*----------------------------------------------*/

// Create a d3 linear scale
// options = {min, max}
g3.linearScale = function(options) {
  
	var min = g3.checkUndefined("min", 0, options),
		max = g3.checkUndefined("max", undefined, options);

	if (options.min === null || options.min === undefined) {
		min = 0;
	}
	if (options.max === null || options.max === undefined) {
		max = 0;
	}

	var res = d3.scaleLinear();
	res.range([min, max]);

	return res;

}

// Create an ordinal scale with space in between ords (bars?)
// options = min, max, space
g3.ordinalScale = function(options) {
  
  var min = g3.checkUndefined("min", 0, options),
      max = g3.checkUndefined("max", undefined, options),
      space = g3.checkUndefined("space", 0.3, options);
  
  var result = d3.scale.ordinal().rangeRoundBands([min, max], space);
  
  return result;
  
}

// Create a scale, specifying the type
// options = type, min, max, space
g3.scale = function(options) {
  
	var type = g3.checkUndefined("type", "linear", options),
		min = g3.checkUndefined("min", 0, options),
		max = g3.checkUndefined("max", 100, options),
		space = g3.checkUndefined("space", 0.3, options);

	if (options.geom === "bar") {
		type = "ordinal";
	}

	if (type === "linear") {
		return(g3.linearScale(options));
	} else if (type === "ordinal") {
		return(g3.ordinalScale(options));
	}
  
}

/*----------------------------------------------*/
/*			Elements							*/
/*----------------------------------------------*/

// options = xScale, yScale, xVar, yVar, interpolation
g3.lineDataFunc = function(ops) {
	return d3.svg.line()
      .x(function(d) { return ops.xScale(d[ops.xVar]); })
      .y(function(d) { return ops.yScale(d[ops.yVar]); })
      .interpolate(ops.interpolation);
}

// options = xScale, yScale, xVar, yVar, interpolation
g3.genLineData = function(ops) {
	var func = g3.lineDataFunc(ops);
	var lineData = func(ops.data);
	return lineData;
}

// options = chart, data, groupClass, elClass, xScale, yScale, xVar, yVar, r
g3.drawCircles = function(ops) {

	var circleGroup = ops.chart.append("g").attr("class", ops.groupClass);

	var circles = circleGroup.selectAll("circle")
		.data(ops.data).enter()
		.append("circle")
		.attr("class", function(d) { return d[ops.elClass]; })
		.attr("cx", function(d) { return ops.xScale(d[ops.xVar]); })
		.attr("cy", function(d) { return ops.yScale(d[ops.yVar]); })
		.attr("r", ops.r);

	return circles;

}

// options = chart, data, groupClass, elClass, x1, x2, y1, y2
g3.drawLines = function(ops) {

	var lineGroup = ops.chart.append("g").attr("class", ops.groupClass);

	var lines = lineGroup.selectAll("line")
		.data(ops.data).enter()
		.append("line")
		.attr("class", ops.elClass)
		.attr("x1", ops.x1)
		.attr("x2", ops.x2)
		.attr("y1", ops.y1)
		.attr("y2", ops.y2)

	return lines;

}

// options = chart, data, groupClass, elClass, xScale, yScale, xVar, yVar, width, height
g3.drawVoronoi = function(ops) {

	var voronoiFunc = d3.voronoi()
		.x(function(d) { return ops.xScale(d[ops.xVar]); })
		.y(function(d) { return ops.yScale(d[ops.yVar]); })
		.extent([[0, 0], [ops.width, ops.height]]);

	var voronoiData = voronoiFunc.polygons(ops.data);

	var voronoiGroup = ops.chart.append("g").attr("class", ops.groupClass);

	var voronoi = voronoiGroup.selectAll("path")
		.data(voronoiData)
		.enter().append("path")
		.attr("class", "vor")
		.attr("d", function(d) {
			return d ? "M" + d.join("L") + "Z" : null;
		});

	return voronoi;

}