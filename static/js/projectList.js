YUI().use("node", "event-mouseenter", "selector-css3", "anim", function(Y) {
	var nodes = Y.all("#projectList li:not(.selected)");
	var anim = [];
	var animVarsColors = {
		to: {
			backgroundColor: "#cccccc",
			marginRight: 0
		},
		from: {
			backgroundColor: "#aaaaaa",
			marginRight: 0
		},
		duration: 0.2
	};
	var animVarsWidth = {
		to: {
			backgroundColor: "#2b7bff",
			paddingRight: 15,
			paddingLeft: 35,
			marginRight: -5,
			marginLeft: -5
		},
		from: {
			backgroundColor: "#222222",
			paddingRight: 10,
			paddingLeft: 30,
			marginRight: 0,
			marginLeft: 0
		},
		duration: 0.2
	};
	nodes.each(function(node, i) {
		anim[i] = [new Y.Anim(animVarsColors), new Y.Anim(animVarsWidth)];
	});
	
	var hover = function(e) {
		var curNode = e.currentTarget;
		var i = nodes.indexOf(curNode);
		var curAnim = anim[i];

		var reverse = false;
		if (e.type === "mouseleave")
			reverse = true;
		if (curAnim[0].get("running")) {
			curAnim[0].pause();
			curAnim[1].pause();
		}

		curAnim[0].setAttrs({
			"node": curNode,
			"reverse": reverse
		});
		curAnim[1].setAttrs({
			"node": curNode.one("a"),
			"reverse":reverse
		});
		curAnim[0].run();
		curAnim[1].run();
	};
	
	nodes.on("mouseenter", hover);
	nodes.on("mouseleave", hover);

	
	var showcase = Y.one("#showcase");
	if (showcase) {
		var message = showcase.one("h2 span");
		var animMessage = new Y.Anim({
			to: {
				color: "#2B7BFF"
			},
			from: {
				color: "#eeeeee"
			},
			duration: 0.4,
			node: message
		});
		var hoverShowcase = function(e) {

			if (e.type === "mouseleave") {
				animMessage.setAttrs({
					"reverse": false
				});
			} else {
				animMessage.setAttrs({
					"reverse": true
				});
			}
			animMessage.run();
		}
		showcase.on("mouseenter", hoverShowcase);
		showcase.on("mouseleave", hoverShowcase);
	};
	var navNodes = Y.all("#nav li");
	// 	padding: 4px 15px;
	// margin: 16px -5px;
	var animNavVars = {
		to: {
			backgroundColor: "#2b7bff",
			marginLeft: -5,
			marginRight: -5,
			paddingLeft: 15,
			paddingRight: 15
		},
		from: {
			backgroundColor: "#222222",
			marginLeft: 0,
			marginRight: 0,
			paddingLeft: 10,
			paddingRight: 10
		},
		duration: 0.2
	};
	var animNav = [];
	navNodes.each(function(node, i) {
		animNav[i] = new Y.Anim(animNavVars);
	});

	var navHover = function(e) {
		var i = navNodes.indexOf(e.currentTarget);
		var curAnim = animNav[i];
		var reverse = false;
		var node = e.currentTarget.one("a");
		if (e.type === "mouseleave") {
			reverse = true;
		}
		curAnim.setAttrs({
			"node": node,
			"reverse": reverse
		});
		curAnim.run();
	};

	navNodes.on("mouseenter", navHover);
	navNodes.on("mouseleave", navHover);
});