'use strict'

var chai = require('chai')
chai.should()
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var winston = require('winston')
winston.level = 'debug'

var data = require('../lib/data').data
var Generator = require('../lib/generator').Generator
var basicObjects = require('../lib/basic-objects')
var Tile = basicObjects.Tile
var Pos = basicObjects.Pos
var Size = basicObjects.Size

describe('template-generator', function () {
	var generator = new Generator(4)

	it('should put the small tile', function () {
		var tile = generator.nextTile()
		new Pos(0, 0).should.eql(tile.pos)
		new Size(1, 1).should.eql(tile.size)
	})

	it('should put the bigger tile', function () {
		var tile = generator.nextTile(new Size(2, 2))
		new Pos(1, 0).should.eql(tile.pos)
		new Size(2, 2).should.eql(tile.size)
	})

	it('should add the gaps', function () {
		var tile

		tile = generator.nextTile(new Size(1, 1))
		new Pos(3, 0).should.eql(tile.pos)
		new Size(1, 1).should.eql(tile.size)

		tile = generator.nextTile(new Size(1, 1))
		new Pos(0, 1).should.eql(tile.pos)
		new Size(1, 1).should.eql(tile.size)

		tile = generator.nextTile(new Size(1, 1))
		new Pos(3, 1).should.eql(tile.pos)
		new Size(1, 1).should.eql(tile.size)
	})

	it('should be squeezed', function () {
		var tile

		tile = generator.nextTile(new Size(3, 3))
		new Pos(0, 2).should.eql(tile.pos)
		new Size(3, 3).should.eql(tile.size)

		tile = generator.nextTile(new Size(2, 2))
		new Pos(3, 2).should.eql(tile.pos)
		new Size(1, 2).should.eql(tile.size)
	})

	it('should foo', function () {
		var x = {msg: 'hi'}
		x.should.eql({msg: 'hi'})
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
