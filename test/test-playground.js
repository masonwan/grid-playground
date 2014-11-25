'use strict'

var chai = require('chai')
chai.should()
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var winston = require('winston')
winston.level = 'debug'
var Generator = require('../lib/template-generator').Generator

describe('foo', function () {
	it('getRandomSize', function () {
		for (var i = 0; i < 10; i++) {
			var size = Generator.getRandomSize()
			console.log('size: ', size)
		}
	})
})
