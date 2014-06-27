var width = 950,
    height = 800;

var zoom = d3.behavior.zoom()
					  .translate([0, 0])
					  .scale(1)
					  .scaleExtent([-5, 15])
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

var projection = d3.geo.mercator()
                       .center([2.3465449,48.8584637])
                       .scale(500000)
                       .translate([width / 2, height / 2]);

var path = d3.geo.path().projection(projection);

d3.json("/stop_times.json", function(error, json) {
  window.data = clean(json);

  var node = container.selectAll(".node")
    .data(data.nodesArr)
    .enter()
    .append("g")
    .attr("transform", function(d) {
        return "translate(" + projection([d.lon, d.lat]) + ")";
      })
    .attr("class", "node")

  node.append("circle")
      .attr("r", 5)
      .attr("class", "station")

  node.append("text")
      .attr("class", "label")
      .attr("transform", "translate(-10, -10)")
      .text(function(d) {return d.name});

  // connecting the dots
  container.selectAll(".line")
     .data(data.edges)
     .enter()
     .append("line")
     .attr("class", "line")
     .attr("x1", function(d) { return projection([data.nodes[d.from].lon, data.nodes[d.from].lat])[0]; })
     .attr("y1", function(d) { return projection([data.nodes[d.from].lon, data.nodes[d.from].lat])[1]; })
     .attr("x2", function(d) { return projection([data.nodes[d.to].lon, data.nodes[d.to].lat])[0]; })
     .attr("y2", function(d) { return projection([data.nodes[d.to].lon, data.nodes[d.to].lat])[1]; })
     .style("stroke", "rgb(6,120,155)");
});

function zoomed() {
	container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

 // svg.selectAll("circle.nodes")
 //    .data(nodes)
 //    .enter()
 //    .append("svg:circle")
 //    .attr("cx", function(d) { return d.x; })
 //    .attr("cy", function(d) { return d.y; });
