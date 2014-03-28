/**
 * Main application code for Mondragon's simulator 3
 * @author Alejandro U. Alvarez <alejandro@urbanoalvarez.es>
 */

 var width = 960,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("#animation").append("svg")
    .attr("width", width)
    .attr("height", height);

var palancas = [
	{ "x_axis": 30, "y_axis": 30, "radius": 20, "color" : "green" },
	{ "x_axis": 70, "y_axis": 70, "radius": 20, "color" : "purple"},
	{ "x_axis": 110, "y_axis": 100, "radius": 20, "color" : "red"}];

var circles = svg.selectAll("circle")
                          .data(palancas)
                          .enter()
                          .append("circle");

var circleAttributes = circles
                       .attr("cx", function (d) { return d.x_axis; })
                       .attr("cy", function (d) { return d.y_axis; })
                       .attr("r", function (d) { return d.radius; })
                       .style("fill", function(d) { return d.color; });

var circlesTransition = d3.selectAll("circle")
   .transition()
   .duration(5000)
   .attr("cy", "0")
   .attrTween('cx', function (d, i, a) {
        return function (t) {
          // Add salt, pepper and constants as per your taste
          return a + (Math.random() - 0.5) * 10;
        };
});

/*d3.json("test.json", function(error, graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 15)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});*/