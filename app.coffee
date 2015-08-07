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
mongourl = process.env.MONGOHQ_URL or process.env.MONGODB_URL or 'mongodb://' + host + ':' + port + '/clickityclack'
db = undefined

MongoClient.connect mongourl, (error, database) ->
  if error
    throw error
  db = database

# Homepage
app.get '/', (request, response) ->
  response.redirect '/events'

app.get '/create', (request, response) ->
  response.render 'create'

# Create a new event
app.post '/create', (request, response) ->
  if isNaN(request.body.cap) or request.body.name == ''
    return response.json('error': -1)
  newEvent = 
    '_id': randomString()
    'name': request.body.name
    'count': 0
    'cap': request.body.cap
    'date': new Date()
  db.collection 'events', (error, collection) ->
    collection.insert newEvent, { w: 1 }
  response.json newEvent

# Get an event
app.get '/:event/get', (request, response) ->
  db.collection 'events', (error, collection) ->
    collection.findOne { _id: request.params.event }, (error, item) ->
      if item == null
        response.json 'error': -1
      else
        response.json item

# Increment an event
app.post '/:event/increment', (request, response) ->
  db.collection 'events', (error, collection) ->
    collection.findOne { _id: request.params.event }, (error, item) ->
      if item == null
        response.json 'error': -1
      else if item.count < item.cap
        collection.update { _id: request.params.event }, { $inc: count: 1 }, (error, numberOfUpdatedObjects) ->
          collection.findOne { _id: request.params.event }, (error, item) ->
            response.json item
      else
        response.json item

# Decrement an event
app.post '/:event/decrement', (request, response) ->
  db.collection 'events', (err, collection) ->
    collection.findOne { _id: request.params.event }, (err, item) ->
      if item == null
        response.json 'error': -1
      else if item.count > 0
        collection.update { _id: request.params.event }, { $inc: count: -1 }, (err, numberOfUpdatedObjects) ->
          collection.findOne { _id: request.params.event }, (err, item) ->
            response.json item
      else
        response.json item

# view all events
app.get '/events', (req, response) ->
  db.collection 'events', (err, collection) ->
    collection.find({}).toArray (err, items) ->
      if items == null
        response.json 'error': -1
      else
        items.reverse()
        response.render 'events', items: items

# View an event
app.get '/:event', (req, response) ->
  db.collection 'events', (err, collection) ->
    collection.findOne { _id: req.params.event }, (err, item) ->
      if item == null
        response.json 'error': -1
      else
        response.render 'event', item: item

# Express web server
webport = process.env.PORT or 3000
server = app.listen(webport, ->
  `var port`
  `var host`
  host = server.address().address
  port = server.address().port
  console.log 'ClickityClack listening at http://%s:%s', host, port
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
