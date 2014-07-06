var width = 1200,
    height = 800;

var zoom = d3.behavior.zoom()
					  .translate([0, 0])
					  .scale(1)
					  .scaleExtent([-5, 15])
					  .on("zoom", zoomed)

var svg = d3.select("#graph").append("svg")
               .attr("width", width)
               .attr("height", height)
               .call(zoom);

var container = svg.append("g");

var projection = d3.geo.mercator()
                       .center([2.3465449,48.8584637])
                       .scale(500000)
                       .translate([width / 2, height / 2]);

var path = d3.geo.path().projection(projection);

// 120s -> 80 px
var timeScale = d3.scale.linear()
                        .domain([0,120])
                        .range([0,80])

d3.json("/stop_times.json", function(error, json) {
  window.data = clean(json);

  // connecting the dots
  var line = container.selectAll(".line")
     .data(data.edges)
     .enter()
     .append("line")
     .attr("class", function(d) { return "line line-" + d.line; })
     .style("stroke-width", function(d) { return (1 / d.time) * 400; })
     .attr("x1", function(d) { return projection([d.from.lon, d.from.lat])[0]; })
     .attr("y1", function(d) { return projection([d.from.lon, d.from.lat])[1]; })
     .attr("x2", function(d) { return projection([d.to.lon, d.to.lat])[0]; })
     .attr("y2", function(d) { return projection([d.to.lon, d.to.lat])[1]; });

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
      .on("click", clickOnStation);

  node.append("text")
      .attr("class", "label")
      .attr("transform", "translate(-10, -10)")
      .text(function(d) {return d.name})
      .on("click", clickOnStation);

  var alreadyChanged = [];
  var it = 0;

  function clickOnStation(origin) {
    console.log("init algo from", origin)
    it = 0;
    changeMap(origin)
  }

  function changeMap(origin) {
    console.log(it)
    for (var i = 0; i < data.edges.length; i++) {
      var edge = data.edges[i];
      // find the edges to move
      if (edge.to.id == origin.id || edge.from.id == origin.id) {
        // if already changed ... do nothing
        // for (var i = 0; i < alreadyChanged.length; i++) {
        //   if (alreadyChanged[i] == edge) {
        //     console.log("returning at", edge);
        //     return;
        //   }
        // };
        // alreadyChanged.push(edge);
        var f = line.filter(function(d) {return d == edge})
        var x1 = +f.attr("x1"), x2 = +f.attr("x2"), y1 = +f.attr("y1"), y2 = +f.attr("y2");
        var dx = x1 - x2;
        var dy = y1 - y2;
        var dist = Math.sqrt(dx * dx + dy * dy)
        var newDist = timeScale(edge.time);
        var changed = null;
        if (edge.to.id == origin.id) {
          // change x1 y1
          // console.log("change x1-y1", edge.from)
          var x3 = (newDist / dist) * (x1 - x2) + x2;
          var y3 = (newDist / dist) * (y1 - y2) + y2;
          f.attr("x1", x3)
            .attr("y1", y3);
          changed = node.filter(function(d) { return d.id == edge.from.id});
          changed.attr("transform", "translate("+ x3 + "," + y3 + ")");
          changed.x3 = x3;
          changed.y3 = y3;
        } else {
          // change x2 y2
          // console.log("change x2-y2", edge.to)
          var x3 = (newDist / dist) * (x2 - x1) + x1;
          var y3 = (newDist / dist) * (y2 - y1) + y1;
          f.attr("x2", x3)
            .attr("y2", y3);
          changed = node.filter(function(d) { return d.id == edge.to.id});
          changed.attr("transform", "translate("+ x3 + "," + y3 + ")");
          changed.x3 = x3;
          changed.y3 = y3;
        }
        // update the edges terminating / originating from 'changed'
        line.filter(function(d) { return d.from.id == changed.datum().id})
          .attr("x1", changed.x3)
          .attr("y1", changed.y3);
        line.filter(function(d) { return d.to.id == changed.datum().id})
          .attr("x2", changed.x3)
          .attr("y2", changed.y3);

        // start again from changed ...
        setTimeout(function() {
          it += 1;
          if (it > 500) {
            console.log("done")
          } else {
            // continue
            changeMap(changed.datum())
          }
        }, 10);
      }
    };
}

});

function zoomed() {
	container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}


