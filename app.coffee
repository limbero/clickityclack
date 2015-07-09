# Setup
express = require('express')
MongoClient = require('mongodb').MongoClient
assert = require('assert')
Db = require('mongodb').Db
Server = require('mongodb').Server
Connection = require('mongodb').Connection
http = require('http')
debug = require('util').debug
inspect = require('util').inspect
bodyParser = require('body-parser')

app = express()

app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: true)
app.use express.static(__dirname + '/public')
app.set 'view engine', 'ejs'

# MongoDB
host = 'localhost'
port = 27017
mongourl = process.env.MONGOHQ_URL or 'mongodb://' + host + ':' + port + '/clickityclack'
db = undefined
MongoClient.connect mongourl, (err, database) ->
  if err
    throw err
  db = database

# Homepage
app.get '/', (req, res) ->
  res.render 'index'

# Create a new event
app.post '/create', (req, res) ->
  if isNaN(req.body.cap) or req.body.name == ''
    return res.json('error': -1)
  newEvent = 
    '_id': randomString()
    'name': req.body.name
    'count': 0
    'cap': req.body.cap
  db.collection 'events', (err, collection) ->
    collection.insert newEvent, { w: 1 }, (err, result) ->
  res.json newEvent

# Get an event
app.get '/:event/get', (req, res) ->
  db.collection 'events', (err, collection) ->
    collection.findOne { _id: req.params.event }, (err, item) ->
      if item == null
        res.json 'error': -1
      else
        res.json item

# Increment an event
app.post '/:event/increment', (req, res) ->
  db.collection 'events', (err, collection) ->
    collection.findOne { _id: req.params.event }, (err, item) ->
      if item == null
        res.json 'error': -1
      else if item.count < item.cap
        collection.update { _id: req.params.event }, { $inc: count: 1 }, (err, numberOfUpdatedObjects) ->
          collection.findOne { _id: req.params.event }, (err, item) ->
            res.json item
      else
        res.json item

# Decrement an event
app.post '/:event/decrement', (req, res) ->
  db.collection 'events', (err, collection) ->
    collection.findOne { _id: req.params.event }, (err, item) ->
      if item == null
        res.json 'error': -1
      else if item.count > 0
        collection.update { _id: req.params.event }, { $inc: count: -1 }, (err, numberOfUpdatedObjects) ->
          collection.findOne { _id: req.params.event }, (err, item) ->
            res.json item
      else
        res.json item

# View an event
app.get '/:event', (req, res) ->
  db.collection 'events', (err, collection) ->
    collection.findOne { _id: req.params.event }, (err, item) ->
      if item == null
        res.json 'error': -1
      else
        res.render 'event', item: item

# Express web server
webport = process.env.PORT or 3000
server = app.listen(webport, ->
  `var port`
  `var host`
  host = server.address().address
  port = server.address().port
  console.log 'ClickityClack listening at http://%s:%s', host, port
  return
)

# Additional functions
randomString = ->
  length = 7
  chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  result = ''
  i = length
  while i > 0
    result += chars[Math.round(Math.random() * (chars.length - 1))]
    --i
  result
