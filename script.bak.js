'use strict'

$(function () {
	var GAP_LENGTH = 10
	var NUM_COLUMNS = 4

	// Clean the elements.
	var $container = $('.card-container')
	$container.empty()

	// Fill the container.
	if (data == null) {
		console.error('Cannot find data to proceed')
	}
	var searchResults = data

	searchResults.forEach(function (searchResult) {
		var numColumns = tile.size[0]
		var numRows = tile.size[1]
		var column = tile.pos[0]
		var row = tile.pos[1]

		// Create the image element.
		var width = 250 * numColumns + GAP_LENGTH * (numColumns - 1)
		var height = 250 * numRows + GAP_LENGTH * (numRows - 1)
		var image = document.createElement('img')
		var url = tile.image
		$(image)
			.attr('src', url)
			.attr('alt', url)

		// Create the div card.
		var left = 250 * column + column * GAP_LENGTH
		var top = 250 * row + row * GAP_LENGTH
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

	function getNextTemplate(numColumns, ) {

	}

	function addCard() {
		
	}
})
