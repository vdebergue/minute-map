var width = 950,
    height = 800;

var zoom = d3.behavior.zoom()
					  .translate([0, 0])
					  .scale(1)
					  .scaleExtent([1, 8])
					  .on("zoom", zoomed);

var svg = d3.select("#graph").append("svg")
							 .attr("width", width)
							 .attr("height", height);
var container = svg.append("g");
svg.append("rect")
   .attr("class", "overlay")
   .attr("width", width)
   .attr("height", height)
   .call(zoom);

// var topLeft = [48.8698693, 2.3345286];
// var bottomRight = [48.8111773, 2.3849753];
var projection = d3.geo.mercator()
                       .center([48.8584637, 2.3465449])
                       .scale(500000)
                       .translate([width / 2, height / 2]);

var node = container.selectAll("circle.node")
    .data(data.nodesArr)
    .enter()
    .append("g")
    .attr("class", "node")

node.append("svg:circle")
    .attr("cx", function(d) { return projection([d.lat, d.lon])[0]; })
    .attr("cy", function(d) { return projection([d.lat, d.lon])[1]; })
    .attr("r", "10px")
    .attr("fill", "black");

node.append("text")
    .attr("class", "label")
    .attr("transform", function(d) {
      var x = projection([d.lat, d.lon])[0] - 15;
      var y = (projection([d.lat, d.lon])[1]) - 15;
      return "translate(" + x + "," + y + ")";
    })
    .text(function(d) {return d.name});

// connecting the dots
container.selectAll(".line")
   .data(data.edges)
   .enter()
   .append("line")
   .attr("class", "line")
   .attr("x1", function(d) { return projection([data.nodes[d.from].lat, data.nodes[d.from].lon])[0]; })
   .attr("y1", function(d) { return projection([data.nodes[d.from].lat, data.nodes[d.from].lon])[1]; })
   .attr("x2", function(d) { return projection([data.nodes[d.to].lat, data.nodes[d.to].lon])[0]; })
   .attr("y2", function(d) { return projection([data.nodes[d.to].lat, data.nodes[d.to].lon])[1]; })
   .style("stroke", "rgb(6,120,155)");

function zoomed() {
	container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
















 // svg.selectAll("circle.nodes")
 //    .data(nodes)
 //    .enter()
 //    .append("svg:circle")
 //    .attr("cx", function(d) { return d.x; })
 //    .attr("cy", function(d) { return d.y; });
