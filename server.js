//setup Dependencies
require(__dirname + "/lib/setup").ext( __dirname + "/lib").ext( __dirname + "/lib/express/support");
var connect = require('connect')
, express = require('express')
, sys = require('sys')
, io = require('Socket.IO-node')
, controllers = require(__dirname + "/controllers/index.js")
, port = 3000;

//Setup Express
var server = express.createServer();
server.configure(function(){
	server.set('views', __dirname + '/views');
	server.set("view engine", "jade");
	server.use(connect.gzip());
	server.use(connect.bodyDecoder());
	server.use(connect.staticProvider(__dirname + '/static'));
	server.use(server.router);
});

// Setup DB
global.DBWorks = require('./models/works');
var header = "#Header";
var footer = "#Footer";
//setup the errors
server.error(function(err, req, res, next){
	if (err instanceof NotFound) {
		res.render('404.ejs', {
			layout: false,
			locals: {
				header: header,
				footer: footer,
				title : '404 - Not Found',
				description: '',
				author: '',
				analyticssiteid: 'XXXXXXX'
			},
			status: 404
		});
	} else {
		res.render('500.ejs', {
			layout: false,
			locals: {
				header: header,
				footer: footer,
				title : 'The Server Encountered an Error',
				description: '',
				author: '',
				analyticssiteid: 'XXXXXXX',
				error: err
			},
			status: 500
		});
	}
});
server.listen(port);

//Setup Socket.IO
var io = io.listen(server);
io.on('connection', function(client){
	console.log('Client Connected');
	client.on('message', function(message){
		client.broadcast(message);
		client.send(message);
	});
	client.on('disconnect', function(){
		console.log('Client Disconnected.');
	});
});


///////////////////////////////////////////
// Routes //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE /////////

server.get('/', function(req,res){
	res.render('index', {
		layout: 'layout',
		locals : {
			header: header,
			footer: footer,
			title : 'Page Title',
			description: 'Page Description',
			author: 'Your Name',
			analyticssiteid: 'XXXXXXX'
			}
	});
});

server.get('/skills/:id?', controllers.s_index);

server.get('/work', controllers.w_index);

server.get('/work/:name', controllers.w_show);

server.get('/contact', controllers.c_index);
server.post('/contact', controllers.c_send);

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
	throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
	throw new NotFound;
});

function NotFound(msg){
	this.name = 'NotFound';
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
