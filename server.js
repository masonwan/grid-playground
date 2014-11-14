'use strict'

var express = require('express')
var app = express()

app.use('/', express.static('.'));

app.get('/', function (req, res) {
	res.redirect('/index.html')
})

var port = 80
app.listen(port)
console.info('Listening port ' + port)
