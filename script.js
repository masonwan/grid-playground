'use strict'

$(function () {
	var template = {
		tiles: [
			{
				pos: [0, 0],
				size: [1, 2]
			},
			{
				pos: [1, 0],
				size: [1, 1]
			},
			{
				pos: [2, 0],
				size: [1, 1]
			},
			{
				pos: [3, 0],
				size: [1, 1]
			},
			{
				pos: [1, 1],
				size: [2, 1]
			},
			{
				pos: [3, 1],
				size: [1, 1]
			},
			{
				pos: [0, 2],
				size: [2, 3]
			},
			{
				pos: [2, 2],
				size: [2, 2]
			},
			{
				pos: [2, 4],
				size: [1, 1]
			},
			{
				pos: [3, 4],
				size: [1, 1]
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

	function getRandomColor() {
		var index = Math.floor(Math.random() * colors.length)
		return colors[index]
	}

	var isDoingFilling = 0
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
			var width = 250 * numColumns
			var height = 250 * numRows
			var image = document.createElement('img')
			var url = 'http://placehold.it/' + width + 'x' + height + '/' + getRandomColor() + '/fff'
			$(image)
				.attr('src', url)
				.attr('alt', url)

			// Create the card.
			var left = 250 * column
			var top = 250 * row
			var div = document.createElement('div')
			$(div)
				.addClass('card')
				.addClass('size' + numColumns + 'x' + numRows)
				.css('left', left)
				.css('top', top)
				.append(image)
			$container.append(div)
		})
	}
})
