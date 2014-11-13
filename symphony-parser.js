'use strict'

var chai = require('chai')
chai.should()
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var winston = require('winston')
//winston.level = 'debug'
var os = require('os')

var parser = require('../../lib/symphony-parser')

describe('parser', function () {
	describe('#htmlToDynamicWidgetConfig()', function () {
		it('should generate empty config', function () {
			var xml = parser.htmlToDynamicWidgetConfig('')
			xml.should.equal('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<dynamic-widget name="apparel-storefront-widget">\n  <arg name="markup"></arg>\n</dynamic-widget>')
		})

		it('should generate correct config', function () {
			var xml = parser.htmlToDynamicWidgetConfig('<p>Hello world</p>')
			xml.should.equal('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<dynamic-widget name="apparel-storefront-widget">\n  <arg name="markup">&lt;p&gt;Hello world&lt;/p&gt;</arg>\n</dynamic-widget>')
		})
	})

	describe('#parseHtml()', function () {
		it('should consume a empty HTML', function (done) {
			parser.parseHtml('<!DOCTYPE html> <html> <head> <title></title> </head> <body> </body> </html>')
				.done(function () {
					done()
				})
		})

		it('should embed CSS and prefix it', function (done) {
			parser.parseHtml('<!DOCTYPE html> <html> <head lang="en"> <meta charset="UTF-8"> <title></title> </head> <body> <link rel="stylesheet" href="test.css"/> <style> body {color: black; display: flex; justify-content: center; box-shadow: black 1px; border-radius: 5px; } </style> </body> </html>', 'test/parser')
				.then(function (xml) {
					xml.should.include('display: -webkit-box;')
					xml.should.include('-webkit-box-shadow')
				})
				.done(done)
		})
	})

	describe('#parse()', function () {
		var filesToRemove = []

		function addFileToRemove(file) {
			var dirname = path.dirname(file)
			var extname = path.extname(file)
			var basename = path.basename(file, extname)
			var fileToRemove = path.resolve(dirname, basename + '.dynamic.xml')
			filesToRemove.push(fileToRemove)
		}

		var queue = []

		it('should consume absolute filename', function (done) {
			var filename = path.resolve(__dirname, 'test-normal.html')
			addFileToRemove(filename)
			var promise = parser.parseFile(filename)
				.done(done)
			queue.push(promise)
		})

		it('should embed CSS and prefix it', function (done) {
			var filename = path.resolve(__dirname, 'test-css.html')
			addFileToRemove(filename)
			var promise = parser.parseFile(filename)
				.done(done)
			queue.push(promise)
		})

		it('should consume absolute directory name', function (done) {
			var dirname = __dirname
			var promise = parser.parseDir(dirname)
				.then(function (files) {
				})
				.done(done)
			queue.push(promise)
		})

		after(function (done) {
			Promise.all(queue)
				.finally(function () {
					var queue2 = []
					for (var i = 0; i < filesToRemove.length; i++) {
						var fileToRemove = filesToRemove[i]
						winston.debug('Removing: ' + fileToRemove)
						queue2.push(fs.unlinkAsync(fileToRemove))
					}
					return Promise.all(queue2)
				})
				.catch(function () {
				})
				.done(function () {
					queue.clear()
					done()
				})
		})
	})
})
