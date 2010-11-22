var email = require("mailer");

var actions = {};

// skills controller
actions.s_index = function(req, res) {
	res.render('skills/index', {
		locals : {
			header: req.params.id,
			footer: "footer"
		}
	});
};
// work controller
actions.w_index = function(req, res) {
	DBWorks.find({}, {project: 0}).all(function(w) {
		res.render('work/index', {
			locals : {
				works: w,
				project: null,
				header: "",
				footer: ""
			}
		});
	});
};

actions.w_show = function(req, res) {
	DBWorks.find({}, {project: 0}).all(function(w) {
		DBWorks.find({ name: req.params.name }).first(function(p) {
			res.render('work/index', {
				locals : {
					works: w,
					project: p,
					header: req.params.name,
					footer: "footer"
				}
			});
		});
	});
};

// contact controller
actions.c_index = function(req, res) {
	res.render('contact', {
		locals: {
			header: "",
			footer: ""
		}
	});
};

actions.c_send = function(req, res) {
	res.redirect("back");
};

module.exports = actions;