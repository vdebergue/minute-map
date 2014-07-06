var data = {
	"2": {
		"nodes": [
			{
				"id": "1",
				"name": "Étoile",
				"lat": 48.8669398,
				"lon": 2.334288
			},
			{
				"id": "2",
				"name": "Nation",
				"lat": 48.8366115,
				"lon": 2.3803791
			}
		],
		"edges": [
			{
				"from": "1",
				"to": "2",
				"time": 10
			}
		],
		"color": "blue"
	}
};

function clean(data) {
	var nodes = {};
	var edges = [];
	var nodesArr = [];
	var nodeIndex = 0;
	for (var key in data) {
		var line = data[key];
		line.nodes.forEach(function(node) {
			node.index = nodeIndex;
			nodes[node.id] = node;
			nodesArr.push(node);
			nodeIndex ++;
		});
		line.edges.forEach(function(edge) {
			edge.line = key;
			if (edge.from !== "") {
				edge.from = nodes[edge.from];
				edge.to = nodes[edge.to];
				// for d3js
				edge.source = edge.from;
				edge.target = edge.to;
				edges.push(edge);
			}
		});
	}
	return {
		"nodesArr": nodesArr,
		"nodes": nodes,
		"edges": edges
	};
}

data = clean(data);
