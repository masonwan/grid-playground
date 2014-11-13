'use strict'

var chai = require('chai')
chai.should()
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var winston = require('winston')
winston.level = 'debug'
var generator = new (require('../lib/template-generator')).Generator()

describe('template-generator', function () {
	it('should generate', function () {
		var template = generator.generate(4)
	})
})
