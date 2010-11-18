YUI().use("node", "event-resize", function(Y) {
	//Y.on("domready", init, Y);
	var panel = 300;
	var minMargin = 5;
	var panelAndMargin = 300 + (minMargin*2);
	var winWidth = 0;
	Y.one(window).on("resize", function(Y) {
		if (this.get("winWidth") != winWidth) {
			organizeShowcase_Adjust();
			winWidth = this.get("winWidth");
		}
	});
	
	organizeShowcase_Line();

	function organizeShowcase_Line() {
		var width = Y.one("#panel").getComputedStyle("width");
		width = width.substring(0, width.length - 2); // removes px
		var columns = Math.max(1, Math.floor(width / panelAndMargin));
		var margin = Math.floor((width-(panel*columns))/columns);
		var marginX = margin / 2;
		var marginY = Math.max(marginX, 30);
		Y.all("#panel li").setStyle("margin", marginX).each(function(elem, i) {
			if (i % columns == 0) {
				this.addClass("clear");
			}
		});
	}
	function organizeShowcase_Adjust() {
		var width = Y.one("#panel").getComputedStyle("width");
		width = width.substring(0, width.length - 2); // removes px
		var columns = Math.max(1, Math.floor(width / panelAndMargin));
		var margin = Math.floor((width-(panel*columns))/columns);

		var x = 0;
		var y = 0;
		var marginX = margin / 2;
		var marginY = Math.max(marginX, 30);
		var grid = [];
		Y.all("#panel li").setStyle("margin", marginX).each(function(elem, i) {
			if (Math.floor(i / columns) > 0) {
				// can look a row behind you
				var xy = grid[i - columns][0];
				var wh = grid[i - columns][1];
				this.setXY([xy[0], xy[1] + wh[1]]);
			} else if (i > 0) {
				var xy = grid[i-1][0];
				this.setXY([xy[0] + panel + (marginX*2), xy[1]]);
			}

			var myXY = elem.getXY();
			var height = elem.getComputedStyle("height");
			height = parseInt(height.substring(0, height.length - 2));
			var myWH = [panel+marginX, height + marginY];
			grid.push([myXY, myWH]);
		});

		// next resize #showcase height
		var start = Math.floor(columns / grid.length);
		var maxHeight = 0;
		for(var i = start; i < grid.length; i++) {
			var yh = grid[i][0][1] + grid[i][1][1]; // y + h
			if (yh > maxHeight) {
				maxHeight = yh;
			}
		}
		Y.all("#showcase, #container").setStyle("height", maxHeight);
	}
});