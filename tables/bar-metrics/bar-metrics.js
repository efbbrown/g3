var g3 = (g3 === undefined) ? {} : g3,
	g3.tables = (g3.tables === undefined) ? {} : g3.tables;

// tree: 
// required = parent, data, labelVar, classVar, valueVar, maxBarWidth
// optional = title
g3.tables.barMetrics = function(tree) {

	/*------------------------------------------*/
	/*            Constants                     */
	/*------------------------------------------*/

	var t = tree;

	var parentDiv, cont;

	/*------------------------------------------*/
	/*            Initiate the div              */
	/*------------------------------------------*/

	parentDiv = d3.selectAll(t.parent);

	cont = parentDiv.append("div.barchart-metrics");

	/*------------------------------------------*/
	/*            Draw elements                 */
	/*------------------------------------------*/

	var maxValue = d3.max(t.data, d3.f(t.valueVar));

	/*			Title							*/
	var title = cont.append("div.table-title")
		.append("h5.table-title")
		.html(t.title);

	/*			Table rows						*/

	var rowsContainer = cont.append("div.table-rows");
	var rows = rowsContainer.selectAll("div.table-row")
		.data(t.data).enter()
		.append("div.table-row");

	var rowLabs = rows
		//.append("td")
		.append("div.table-name")
		.html(function(d) { return d[t.labelVar]; });

	var rowBars = rows
		.append("div.table-bar")
		.append("span")
		.attr("class", function(d) { return "bar " + d[t.classVar]; })
		.style("width", function(d) { return (t.maxBarWidth * (d[t.valueVar] / maxValue)) + "%"; });

	if (t.valueNormalise === true) {
		var valueDenominator = d3.sum(t.data, d3.f(t.valueVar));
	} else {
		var valueDenominator = 1;
	}

	var rowVals = rows
		.append("div.table-val")
		.append("p.table-val")
		.html(function(d) { return t.valueFormat(d[t.valueVar] / valueDenominator); });

}