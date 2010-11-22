var mongoose = require('mongoose/mongoose').Mongoose
// db.copyDatabase('portfolio', 'portfolio', 'flame.mongohq.com:27024', 'etheria', 'nagisa')
// mongoimport.exe -d portfolio -c works --drop F:\VMBox\portfolio\models\works_data.js
	//, db = mongoose.connect('mongodb://etheria:nagisa@flame.mongohq.com:27024/portfolio');
, db = mongoose.connect('mongodb://192.168.1.3:27017/portfolio');

mongoose.model('work', {
		properties: ['name', 'title', 'img', 'url', 'type', {'project': ['tech', 'preview', 'desc']} ],
		indexes: ['name']
});

module.exports = db.model('work');