/**
* Projective texturing using Canvas.
*
* (c) Steven Wittens 2008
* http://www.acko.net/
*/

var points = [
[600, 100],
[1100, 100],
[-600, 140],
[1700, 140]
];
var update, repositionUp, randomPoints, randomScroll, changing;
var origPoints = [
[0, 100],
[1100, 100],
[-600, 140],
[1700, 140]
];
(function ($) {
	var canvas = null, canvas2 = null, ctx = null, ctx2 = null;
	var doSplitV = true, doFlatH = false;
	var filling = 0, split = 100;
	var loopx = 0;
	var styles = ["#111111", "#222222", "#aaaaaa", "#cccccc", "#aaaaaa"];
	var pattern = [0.25, 0.25, 0.2, 0.1, 0.2];
	$(document).ready(function () {
		init();
	//setInterval(repositionUp, 2000);
	});
	changing = function(a, b, c) {
		doSplitV = a;
		doFlatH = b;
		split = c;
		update();
	}
	randomScroll = function() {
		/*
        loopx = 0;
        setInterval(function() {
            if (loopx < 50) {
                loopx++;
                update();
            }
        }, 20);
        */
		setInterval(function() {
			if (split < 100)
				changing(doSplitV, doFlatH, split += 5);
		}, 100);
	}
	randomPoints = function() {
		points = origPoints;
		reCalPoints();
		for(var i = 0; i < 2; i++)
		{
			points[i] = [points[i][0] + (Math.random() * 60) - 30, points[i][1] + (Math.random() * 10) - 5];
		}
		update();
	}
	repositionUp = function() {
		var split = 100;
		var cutt = (points[1][0] - points[0][0]) / split;
		var cutb = (points[3][0] - points[2][0]) / split;
		var slice = split;

		setInterval(function() {
			slice--;
			if (slice < 0) return;

			var add = 0.0;
			var part = loopx%5;

			for(var pat = 0; pat < styles.length; pat++) {
				var ind = (pat+part)%5;

				var x1 = points[0][0]+(slice*cutt)+(add*cutt);
				var y1 = points[0][1];

				var x2 = points[2][0]+(slice*cutb)+(add*cutb);
				var y2 = points[2][1];
				setTimeout(function b() {
					ctx.fillStyle = "#ffffff";
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.lineTo(x2+(pattern[ind]+cutb), y2);
					ctx.lineTo(x1+(pattern[ind]+cutt), y1);
					ctx.fill();
				}, 20);
				setTimeout(function a() {
					ctx.fillStyle = styles[ind];
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.lineTo(x2+(pattern[ind]+cutb), y2);
					ctx.lineTo(x1+(pattern[ind]+cutt), y1);
					ctx.fill();
				}, 50);
				add += pattern[pat];
			}
		}, 20);
	//update();
	//setTimeout(update, 100);
	}
	/**
    * Initialize the handles and canvas.
    */
	function init() {
		// Position handles.
		$(window).scroll(function(event) {
			loopx = $(window).scrollLeft();
			update();
		});
		$(window).resize(function(event) {
			reCalPoints();
			update();
		});
		// Create canvas and load image.
		canvas = createCanvas(0, 0, 1, 1);
		canvas2 = createCanvas2(0, 0, 1, 1);
		// Render image.
		reCalPoints();
		update();
	}
	function reCalPoints()
	{
		points = origPoints;
		points[1][0] = $(window).width();
		if (doFlatH) {
			points[3][0] = points[1][0];
			points[0][0] = points[2][0];
			points[2][1] += 20;
			points[3][1] += 20;
		} else {
			points[3][0] = points[1][0] + 600;
			points[0][0] = points[1][0] - 300;
		}
	}
	/**
    * Update the display to match a new point configuration.
    */
	update = function () {
		// Get extents.
		var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
		$.each(points, function () {
			minX = Math.min(minX, Math.floor(this[0]));
			maxX = Math.max(maxX, Math.ceil(this[0]));
			minY = Math.min(minY, Math.floor(this[1]));
			maxY = Math.max(maxY, Math.ceil(this[1]));
		});

		minX--;
		minY--;
		maxX++;
		maxY++;
		var width = maxX - minX;
		var height = maxY - minY;

		// Reshape canvas.
		canvas.style.left = minX + 'px';
		canvas.style.top = minY + 'px';
		canvas.width = width;
		canvas.height = height;

		// Set up basic drawing context.
		ctx = canvas.getContext("2d");
		ctx.translate(-minX, -minY);
		ctx.clearRect(minX, minY, width, height);
		//ctx.strokeStyle = "rgb(220,0,100)";
		ctx.strokeStyle = "#222222";
		//divide(0, 0, 1, 1, ptl, ptr+loopx, pbl, pbr+loopx, options.subdivisionLimit);
		var cutt = (points[1][0] - points[0][0]) / split;
		var cutb = (points[3][0] - points[2][0]) / split;

		for( var slice = 0; slice < split; slice++)
		{
			var add = 0.0;
			var part = loopx%5;
			for(var pat = 0; pat < styles.length; pat++) {
				var ind = (pat+part)%5;
				ctx.fillStyle = styles[ind];

				var x1 = points[0][0]+(slice*cutt)+(add*cutt);
				var y1 = points[0][1];

				var x2 = points[2][0]+(slice*cutb)+(add*cutb);
				var y2 = points[2][1];

				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.lineTo(x2+(pattern[ind]+cutb), y2);
				ctx.lineTo(x1+(pattern[ind]+cutt), y1);
				ctx.fill();

				add += pattern[pat];
			}

		}
		if (doSplitV) {
			var splitV = [0, 6, 12, 30, 56];
			ctx.strokeStyle = "rgba(2,2, 2, 0.4)";
			for ( var i = 0; i < splitV.length; i++) {
				ctx.beginPath();
				ctx.moveTo(points[2][0], splitV[i] + points[0][1]);
				ctx.lineTo(points[3][0], splitV[i] + points[0][1]);
				ctx.stroke();
			}
		}
	/*
        var img = ctx.getImageData(600, 1, width-600, 1);
        canvas2.width = width-600;
        canvas2.height = 1;
        ctx2 = canvas2.getContext("2d");
        ctx2.translate(-minX, -minY);
        ctx2.clearRect(minX, minY, width-600,1);
        ctx2.putImageData(img, 0, 0);

        console.log(img);
        $("body").css("background", "url("+canvas2.toDataURL()+")");
        */
	}

	/**
    * Create a canvas at the specified coordinates.
    */
	function createCanvas(x, y, width, height) {
		// Create <canvas>
		var canvas;
		if (typeof G_vmlCanvasManager != 'undefined') {
			canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			$('#canvas').append(canvas);
			canvas = G_vmlCanvasManager.initElement(canvas);
		}
		else {
			canvas = $('<canvas width="' + width + '" height="' + height + '"></canvas>');
			$('#canvas').append(canvas);
			canvas = canvas[0];
		}

		return canvas;
	}
	function createCanvas2(x, y, width, height) {
		// Create <canvas>
		var canvas;
		if (typeof G_vmlCanvasManager != 'undefined') {
			canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			$('#canvas2').append(canvas);
			canvas = G_vmlCanvasManager.initElement(canvas);
		}
		else {
			canvas = $('<canvas width="' + width + '" height="' + height + '"></canvas>');
			$('#canvas2').append(canvas);
			canvas = canvas[0];
		}

		return canvas;
	}

})(jQuery);
