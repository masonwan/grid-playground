'use strict'

$(function () {
	var template = {
		tiles: [
			{
				pos: [0, 0],
				size: [1, 2],
				image: 'http://ecx.images-amazon.com/images/I/61T2XvUszWL._AC_.jpg'
			},
			{
				pos: [1, 0],
				size: [1, 1],
				image: 'http://ecx.images-amazon.com/images/I/61y508Tb0HL._AC_.jpg'
			},
			{
				pos: [2, 0],
				size: [1, 1],
				image: 'http://ecx.images-amazon.com/images/I/617-RnWhWwL._AC_.jpg'
			},
			{
				pos: [3, 0],
				size: [1, 1],
				image: 'http://ecx.images-amazon.com/images/I/61zXIj5YcPL._AC_.jpg'
			},
			{
				pos: [1, 1],
				size: [2, 1],
				image: 'http://ecx.images-amazon.com/images/I/51zFS6Z7STL._AC_.jpg'
			},
			{
				pos: [3, 1],
				size: [1, 1],
				image: 'http://ecx.images-amazon.com/images/I/51FXiErvTTL._AC_.jpg'
			},
			{
				pos: [0, 2],
				size: [2, 3],
				image: 'http://ecx.images-amazon.com/images/I/71X38uVsBcL._AC_.jpg'
			},
			{
				pos: [2, 2],
				size: [2, 2],
				image: 'http://ecx.images-amazon.com/images/I/71ZDaVpMc4L._AC_.jpg'
			},
			{
				pos: [2, 4],
				size: [1, 1],
				image: 'http://ecx.images-amazon.com/images/I/71wDGds9WtL._AC_.jpg'
			},
			{
				pos: [3, 4],
				size: [1, 1],
				image: 'http://ecx.images-amazon.com/images/I/61JppJpVK0L._AC_.jpg'
			}
		]
	}

	var colors = [
		'001f3f',
		'0074d9',
		'7fdbff',
		'39cccc',
		'3d9970',
		'2ecc40',
		'01ff70',
		'ffdc00',
		'ff851b',
		'ff4136',
		'85144b',
		'f012be',
		'b10dc9'
	]
	var gap = 10

	function getRandomColor() {
		var index = Math.floor(Math.random() * colors.length)
		return colors[index]
	}

	var isDoingFilling = 1
	if (isDoingFilling) {
		// Clean the elements.
		var $container = $('.card-container')
		$container.empty()

		// Fill the container.
		var tiles = template.tiles
		tiles.forEach(function (tile) {
			var numColumns = tile.size[0]
			var numRows = tile.size[1]
			var column = tile.pos[0]
			var row = tile.pos[1]

			// Create the image element.
			var width = 250 * numColumns + gap * (numColumns - 1)
			var height = 250 * numRows + gap * (numRows - 1)
			var image = document.createElement('img')
//			var url = 'http://placehold.it/' + width + 'x' + height + '/' + getRandomColor() + '/fff'
			var url = tile.image
			$(image)
				.attr('src', url)
				.attr('alt', url)

			// Create the div card.
			var left = 250 * column + column * gap
			var top = 250 * row + row * gap
			var div = document.createElement('div')
			$(div)
				.addClass('card')
				.addClass('size' + numColumns + 'x' + numRows)
				.css('left', left)
				.css('top', top)
				.css('width', width)
				.css('height', height)
				.append(image)
			$container.append(div)
		})
	}
})
