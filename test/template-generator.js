'use strict'

var chai = require('chai')
chai.should()
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var winston = require('winston')
winston.level = 'debug'
var Generator = require('../lib/template-generator').Generator

describe('template-generator', function () {
	it('should generate simple template', function () {
		var template = Generator.generate(2, 2)
		template.should.be.an('Object')

		var areaSum = 0
		template.tiles.forEach(function (tile) {
			areaSum += tile.size.area()
		})
		areaSum.should.equal(4)
		template.area().should.equal(4)
	})
})
