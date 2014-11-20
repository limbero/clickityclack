// Setup
var express = require('express'),
MongoClient = require('mongodb').MongoClient, assert = require('assert'),
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
var db = new Db('clickityclack', new Server(host, port, {}), {native_parser:false});

db.open(function(err, db) {
	if(err) throw err  
});

// Homepage
app.get('/', function (req, res) {
	res.render('index')
})

// Create a new event
app.post('/create', function(req,res){
	var newEvent = {'_id': req.body.id, 'name': req.body.name, 'count': 0, 'cap': req.body.cap}

	db.collection('events', function(err, collection) {
		collection.insert(newEvent, {w:1}, function(err, result) {});
	})

	res.json(newEvent)
})

// Increment an event
app.post('/increment', function(req,res){
	db.collection('events', function(err, collection) {
		collection.findOne({_id:req.body.id}, function(err, item) {
			if(item.count < item.cap) {
				collection.update({_id:req.body.id}, {$inc:{count:1}}, function(err, numberOfUpdatedObjects) {
					collection.findOne({_id:req.body.id}, function(err, item) {
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
app.post('/decrement', function(req,res){
	db.collection('events', function(err, collection) {
		collection.findOne({_id:req.body.id}, function(err, item) {
			if(item.count > 0) {
				collection.update({_id:req.body.id}, {$inc:{count:-1}}, function(err, numberOfUpdatedObjects) {
					collection.findOne({_id:req.body.id}, function(err, item) {
						res.json(item)
					})
				})
			} else {
				res.json(item)
			}
		})
	})
})

// Get an event
app.get('/get', function(req,res){
	db.collection('events', function(err, collection) {
		collection.findOne({_id:req.body.id}, function(err, item) {
			res.json(item)
		})
	})
})

// Access an event
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

