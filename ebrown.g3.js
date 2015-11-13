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