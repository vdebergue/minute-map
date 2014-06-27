var width = 1200,
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

  // connecting the dots
  container.selectAll(".line")
     .data(data.edges)
     .enter()
     .append("line")
     .attr("class", function(d) { return "line line-" + d.line; })
     .style("stroke-width", function(d) { return (1 / d.time) * 400; })
     .attr("x1", function(d) { return projection([data.nodes[d.from].lon, data.nodes[d.from].lat])[0]; })
     .attr("y1", function(d) { return projection([data.nodes[d.from].lon, data.nodes[d.from].lat])[1]; })
     .attr("x2", function(d) { return projection([data.nodes[d.to].lon, data.nodes[d.to].lat])[0]; })
     .attr("y2", function(d) { return projection([data.nodes[d.to].lon, data.nodes[d.to].lat])[1]; });

  var node = container.selectAll(".node")
    .data(data.nodesArr)
    .enter()
    .append("g")
    .attr("transform", function(d) {
      return "translate(" + projection([d.lon, d.lat]) + ")";
    })
    .attr("class", function(d) { return "node line-" + d.id; });

  node.append("circle")
      .attr("r", 4)
      .attr("class", "station")
      .on("click", changeMap);

  node.append("text")
      .attr("class", "label")
      .attr("transform", "translate(-10, -10)")
      .text(function(d) {return d.name})
      .on("click", changeMap);
});


function zoomed() {
	container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function changeMap(origin) {
  console.log(origin)
  // var force = d3.layout.force()
  //   .nodes(data.nodes)
  //   .links(data.edges)
  //   .size([width, height])
  //   .linkDistance(function(d) {
  //     console.log(d);
  //     return d.time;
  //   })
  //   .start();
}

 // svg.selectAll("circle.nodes")
 //    .data(nodes)
 //    .enter()
 //    .append("svg:circle")
 //    .attr("cx", function(d) { return d.x; })
 //    .attr("cy", function(d) { return d.y; });
