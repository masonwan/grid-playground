'use strict'

var chai = require('chai')
chai.should()
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var winston = require('winston')
winston.level = 'debug'
var Generator = require('../lib/template-generator').Generator
var data = require('../lib/data').data

describe('template-generator', function () {
	it('should generate for one column', function () {
		var generator = new Generator(1)

		for (var i = 0; i < 20; i++) {
			console.log(data[i])
			var product = data[i % data.length]
			var hash = generator.getTextHash(product.asin)
			console.log('hash: ', hash)
		}
	})
//	it('should generate a simple template', function () {
//		var template = Generator.generate(2, 2)
//		template.should.be.an('Object')
//
//		var areaSum = 0
//		template.tiles.forEach(function (tile) {
//			areaSum += tile.size.area()
//		})
//		areaSum.should.equal(4)
//		template.area().should.equal(4)
//	})
//
//	it('should generate a template in reasonable size', function () {
//		var template = Generator.generate(8, 10)
//		template.should.be.an('Object')
//
//		var areaSum = 0
//		template.tiles.forEach(function (tile) {
//			areaSum += tile.size.area()
//		})
//		areaSum.should.equal(80)
//		template.area().should.equal(80)
//	})
//
//	it('should generate a template in huge size', function () {
//		var template = Generator.generate(11, 40)
//		template.should.be.an('Object')
//
//		var areaSum = 0
//		template.tiles.forEach(function (tile) {
//			areaSum += tile.size.area()
//		})
//		areaSum.should.equal(440)
//		template.area().should.equal(440)
//	})
})
