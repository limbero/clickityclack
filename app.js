// Setup
var express = require('express'),
	MongoClient = require('mongodb').MongoClient,
	assert = require('assert'),
	Db = require('mongodb').Db,
	Server = require('mongodb').Server,
	Connection = require('mongodb').Connection,  
	http = require('http'),
	debug = require('util').debug,
	inspect = require('util').inspect

var app = express()

var bodyParser = require('body-parser')
app.use( bodyParser.json() )
app.use( bodyParser.urlencoded({ extended: true }) )

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

// MongoDB
var host = 'localhost';
var port = 27017;
var mongourl = process.env.MONGOHQ_URL || 'mongodb://'+host+':'+port+'/clickityclack';
var db;

MongoClient.connect(mongourl, function(err, database) {
  if(err) throw err;

  db = database;
});

// Homepage
app.get('/', function (req, res) {
	res.render('index')
})

// Create a new event
app.post('/create', function(req,res){
	if(isNaN(req.body.cap) || req.body.name == '')
		return res.json( { 'error': -1} )

	var newEvent = {'_id': randomString(), 'name': req.body.name, 'count': 0, 'cap': req.body.cap}

	db.collection('events', function(err, collection) {
		collection.insert(newEvent, {w:1}, function(err, result) {});
	})

	res.json(newEvent)
})

// Get an event
app.get('/get', function(req,res){
	db.collection('events', function(err, collection) {
		collection.findOne({_id:req.body.id}, function(err, item) {
			res.json(item)
		})
	})
})

// Increment an event
app.post('/:event/increment', function(req,res){
	db.collection('events', function(err, collection) {
		collection.findOne({_id:req.params.event}, function(err, item) {
			if(item.count < item.cap) {
				collection.update({_id:req.params.event}, {$inc:{count:1}}, function(err, numberOfUpdatedObjects) {
					collection.findOne({_id:req.params.event}, function(err, item) {
						res.json(item)
					})
				})
			} else {
				res.json(item)
			}
		})
	})
})

// Decrement an event
app.post('/:event/decrement', function(req,res){
	db.collection('events', function(err, collection) {
		collection.findOne({_id:req.params.event}, function(err, item) {
			if(item.count > 0) {
				collection.update({_id:req.params.event}, {$inc:{count:-1}}, function(err, numberOfUpdatedObjects) {
					collection.findOne({_id:req.params.event}, function(err, item) {
						res.json(item)
					})
				})
			} else {
				res.json(item)
			}
		})
	})
})

// View an event
app.get('/:event', function(req,res){
	db.collection('events', function(err, collection) {
		collection.findOne({_id:req.params.event}, function(err, item) {
			res.render('event', {item: item})
		})
	})
})


// Express web server

var webport = process.env.PORT || 3000;
var server = app.listen(webport, function () {

	var host = server.address().address
	var port = server.address().port

	console.log('ClickityClack listening at http://%s:%s', host, port)

})

// Additional functions

function randomString() {
	var length = 7
	var chars = '0123456789abcdefghijklmnopqrstuvwxyz'
	var result = ''
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))]
		return result
}
