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
	for (var key in data) {
		var line = data[key];
		line.nodes.forEach(function(node) {
			nodes[node.id] = node;
		});
		line.edges.forEach(function(edge) {
			edge.line = key;
			if (edge.from !== "")
				edges.push(edge);
		});
	}
	// HACK
	var nodesArr = [];
	for (var key in nodes)
		nodesArr.push(nodes[key]);
	// HACK
	return {
		"nodesArr": nodesArr,
		"nodes": nodes,
		"edges": edges
	};
}

data = clean(data);
