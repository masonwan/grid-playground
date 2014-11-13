'use strict'

var assert = require("assert")
var downloader = require('../../lib/resource-downloader')
var path = require('path')
var Promise = require('bluebird')

describe('downloader', function () {
	it('should download', function (done) {
		downloader.replaceWithLocalResources('pages/ipad-mini.html')
			.done(done)
	})
})
