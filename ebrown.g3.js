/*
    ebrown.g3.js
    v1, 20140729
    http://rwco.hn
 
    shortcut binds to g3
*/

g3 = {};

var ebrown = ebrown || {};
ebrown.g3 = g3;

/*
  This means nothing right now. It's unchanged from rwcohn.calc.js
    %function%
        for generic operations
 
    %type_function%
        for type-specific operations
 
    %typein__typeout%
        for type conversions
*/

// Return clientWidth of element
g3.elementWidth = function(element) {
  return element[0][0].clientWidth;
}

// Return clientHeight of element
g3.elementHeight = function(element) {
  return element[0][0].clientHeight;
}

// Create and return margins
g3.marginObject = function(parentHeight, parentWidth, marginRatio) {
  return {top: parentHeight * marginRatio,
          right: parentWidth * marginRatio,
          bottom: parentHeight * marginRatio,
          left: parentWidth * marginRatio};
}

// Calculate and return chart length. Used for both chart width and chart height.
g3.chartLength = function(parentLength, marginOne, marginTwo) {
  return parentLength - marginOne - marginTwo;
}

// Append and return a svg with g element
g3.appendChart = function(parentDiv, parentWidth, parentHeight, margin) {
  
  return parentDiv.append("svg")
    .attr("width", parentWidth)
    .attr("height", parentHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
}

// Create a d3 linear scale
g3.linearScale = function(min, max) {
  return d3.scale.linear().range([min, max]);
}

// Create an ordinal scale with space in between ords (bars?)
g3.ordinalScale = function(min, max, space) {
  space = space || 0.3;
  return d3.scale.ordinal()
           .rangeRoundBands([min, max], space);
}

/*------------------------------*/

// A scatter plot
g3.scatter = function(parent, data, xvar, yvar, title, xlab, ylab, colour, marginsize) {
  
  var marginRatio = marginsize || 0.1;
  
  var parentDiv = d3.select(parent);

// Chart width and height, dependent on parentDiv and marginRatio 
  var parentWidth = g3.elementWidth(parentDiv),
      parentHeight = g3.elementHeight(parentDiv);
      
  // Make sure this is height then width !!!
  var margin = g3.marginObject(parentHeight, parentWidth, marginRatio);

  var width = g3.chartLength(parentWidth, margin.left, margin.right),
      height = g3.chartLength(parentHeight, margin.top, margin.bottom);

  // Add chart svg to parentDiv
  var chart = g3.appendChart(parentDiv, parentWidth, parentHeight, margin);
  
  var x = g3.linearScale(0, width);
  var y = g3.linearScale(height, 0);
  
  var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(4);
  var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5);
        
  x.domain(d3.extent(data, function(d) { return d[xvar]; }));
  y.domain(d3.extent(data, function(d) { return d[yvar]; }));

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);
      
  var points = chart.selectAll(".point")
      .data(data)
      .enter().append("circle")
      .attr("class", "point")
      .attr("cx", function(d) { return x(d[xvar]); })
      .attr("cy", function(d) { return y(d[yvar]); })
      .attr("r", 3);
  
  // Fill points if colour is given. Don't know why this isn't working.
  if (colour === null || colour === "undefined") {
    var pointsfill = d3.selectAll(parent + " .point")
                          .style("fill", "#444");
  } else {
    var pointsfill = d3.selectAll(parent + " .point")
                          .style("fill", colour);
  }
  
  /*   
  var bars = chart.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d[xvar]); })
      .attr("y", function(d) { return y(d[yvar]); })
      .attr("width", x.rangeBand())
      .attr("height", function(d) { return height - y(d.value); })
  */ 
  // Add title if given
  if (title === null || title === "undefined") {
    
  } else {
    chart.append("text")
      .attr("x", (width/2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "1em")
      .text(title);
  }
  
  // Add x label if given
  if (xlab === null || xlab === "undefined") {
    
  } else {
    chart.append("text")
      .attr("x", (width/2))
      .attr("y", height + (margin.bottom))
      .attr("dx", "1em")
      .attr("text-anchor", "middle")
      //.style("font-size", "1em")
      .text(xlab);
  }
  
  // Add y label if given
  if (ylab === null || ylab === "undefined") {
    
  } else {
    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", (0 - (height/2)))
      .attr("y", 0 - (margin.left))
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      //.style("font-size", "1em")
      .text(ylab);
  }
  
}

// A bar plot
g3.bar = function(parent, data, xvar, yvar, title, xlab, ylab, colour, marginsize) {
  
  var marginRatio = marginsize || .1;
  
  var parentDiv = d3.select(parent);

// Chart width and height, dependent on parentDiv and marginRatio 
  var parentWidth = elementWidth(parentDiv),
      parentHeight = elementHeight(parentDiv);
      
  // Make sure this is height then width !!!
  var margin = marginObject(parentHeight, parentWidth, marginRatio);

  var width = chartLength(parentWidth, margin.left, margin.right),
      height = chartLength(parentHeight, margin.top, margin.bottom);

  // Add chart svg to parentDiv
  var chart = appendChart(parentDiv, parentWidth, parentHeight, margin);
  
  var x = ordinalScale(0, width);
  var y = linearScale(height, 0);
  
}

/*------------------------------*/

g3.plot = function(geom, parent, data, xvar, yvar, title, xlab, ylab, colour) {
  
  if (geom === "scatter") {
    return(g3.scatter(parent, data, xvar, yvar, title, xlab, ylab, colour));
  }
  
  if (geom === "bar") {
    return(g3.bar(parent, data, xvar, yvar, title, xlab, ylab, colour));
  }
  
}