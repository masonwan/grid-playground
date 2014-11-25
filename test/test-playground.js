'use strict'

var chai = require('chai')
chai.should()
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var winston = require('winston')
winston.level = 'debug'
var Generator = require('../lib/generator').Generator

describe('foo', function () {
	it('should not pass', function () {
		var a = [1, 2, 3]
		;[].push.apply(a, new Array(10))
	})
})
