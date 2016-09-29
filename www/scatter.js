g3.scatterPlot = function(tree) {

	/*------------------------------------------*/
	/*            Constants                     */
	/*------------------------------------------*/

	var t = tree;

	var parentDiv, parentWidth, parentHeight, margin, width, height, chart, x, y;

	/*------------------------------------------*/
	/*            Initiate the SVG              */
	/*------------------------------------------*/

	parentDiv = d3.selectAll(t.parent);

	parentWidth = g3.elementWidth(parentDiv),
	parentHeight = g3.elementHeight(parentDiv);

	margin = {
		top: parentHeight * t.marginRatios.top, right: parentWidth * t.marginRatios.right,
		bottom: parentHeight * t.marginRatios.bottom, left: parentWidth * t.marginRatios.left
	};

	width = g3.chartLength({"parentLength": parentWidth, "marginOne": margin.left, "marginTwo": margin.right});
	height = g3.chartLength({"parentLength": parentHeight, "marginOne": margin.top, "marginTwo": margin.bottom});

	chart = g3.appendChart({
		"parentDiv": parentDiv, "parentWidth": parentWidth, "parentHeight": parentHeight, "margin": margin
	});

	/*------------------------------------------*/
	/*            Scales              			*/
	/*------------------------------------------*/

	x = g3.scale({type: "linear", min: 0, max: width}),
	y = g3.scale({type: "linear", min: height, max: 0});

	x.domain(d3.extent(t.data, function(d) { return d[t.xVar]; }));
	y.domain(d3.extent(t.data, function(d) { return d[t.yVar]; }));

	/*------------------------------------------*/
	/*            Element options               */
	/*------------------------------------------*/

	var elementOptions = {
		"circles": {
			"chart": chart,
			"data": t.data,
			"groupClass": "circle-group",
			"elClass": t.classVar,
			"xScale": x,
			"yScale": y,
			"xVar": t.xVar,
			"yVar": t.yVar,
			"r": "1px"
		}
	};

	g3.drawCircles(elementOptions.circles);

	if (t.voronoi === true) {
		elementOptions.voronoi = {
			"chart": chart,
			"data": t.data,
			"groupClass": "voronoi-group",
			"elClass": t.classVar,
			"xScale": x,
			"yScale": y,
			"xVar": t.xVar,
			"yVar": t.yVar,
			"width": width,
			"height": height
		};
		g3.drawVoronoi(elementOptions.voronoi);
	}

}