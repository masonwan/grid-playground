/// <reference path="../lib/data.ts" />
/// <reference path="../lib/tile.ts" />
/// <reference path="../lib/menuController.ts" />

/**
 * Responsible to control the DOM related to the tile view.
 */
class TileViewController {
    gapLength:number = 2
    config = {
        isAutoCrop: false
    }

    tiles:Tile[] = []
    private numCols:number = 4
    generator:Generator

    $container
    containerHeight:number = 0

    constructor(containerSelector:string) {
        this.generator = new Generator(this.numCols)
        this.$container = $(containerSelector)
    }

    clear() {
        this.tiles.length = 0
        this.$container.empty()
    }

    setNumColumns(numCols:number) {
        if (numCols <= 0) {
            throw new Error('Number of columns must be larger or equal than 1')
        }

        this.numCols = numCols

        var newGenerator = new Generator(numCols)
        var tiles = this.tiles
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i]
            var calculatedTile = newGenerator.nextTile(Generator.getStaticSize(tile.asin))
            tile.pos = calculatedTile.pos
            tile.size = calculatedTile.size

            var containerWidth = this.$container.width()
            var availableWidth = containerWidth - this.gapLength
            var tileLengthWithGap = Math.floor(availableWidth / this.numCols)
            var unitLength = tileLengthWithGap - this.gapLength

            var x = this.gapLength + tile.pos.x * tileLengthWithGap
            var y = this.gapLength + tile.pos.y * tileLengthWithGap
            var width = tile.size.width * unitLength + (tile.size.width - 1) * this.gapLength
            var height = tile.size.height * unitLength + (tile.size.height - 1) * this.gapLength
            tile.$element
                .css({
                    left: x,
                    top: y,
                    width: width,
                    height: height
                })
        }
        this.generator = newGenerator
    }

    addTiles(tiles) {
        var that = this

        var containerWidth = that.$container.width()
        var availableWidth = containerWidth - that.gapLength
        var tileLengthWithGap = Math.floor(availableWidth / that.numCols)
        var unitLength = tileLengthWithGap - that.gapLength

        var promises = new Array(tiles.length)
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i]
            var calculatedTile = this.generator.nextTile(Generator.getStaticSize(tile.asin))
            tile.pos = calculatedTile.pos.clone()
            tile.size = calculatedTile.size.clone()

            promises[i] = tile.createElementAsync(unitLength)
        }

        return Promise.settle(promises)
            .then(function (results) {
                var tiles = []
                for (var i = 0; i < results.length; i++) {
                    var r = results[i]
                    if (r.isRejected()) {
                        // todo: track the error.
                        console.warn(r.reason())
                    } else {
                        tiles.push(r.value())
                    }
                }
                return tiles
            })
            .then(function (tiles) {
                console.log('Add', tiles.length, 'tiles')

                // Translate position and size for each tiles.
                for (var i = 0; i < tiles.length; i++) {
                    var tile = tiles[i]
                    var x = that.gapLength + tile.pos.x * tileLengthWithGap
                    var y = that.gapLength + tile.pos.y * tileLengthWithGap
                    var width = tile.size.width * unitLength + (tile.size.width - 1) * that.gapLength
                    var height = tile.size.height * unitLength + (tile.size.height - 1) * that.gapLength
                    tile.$element
                        .css({left: x, top: y})
                        .width(width)
                        .height(height)

                    var bottom = y + height + that.gapLength
                    if (bottom > that.containerHeight) {
                        that.containerHeight = bottom
                    }
                }

                // Adjust container height.
                that.$container
                    .height(that.containerHeight)

                // Insert the tile elements.
                var elements = new Array(tiles.length)
                for (i = 0; i < tiles.length; i++) {
                    var tile = tiles[i]
                    elements[i] = tile.$element
                }
                that.$container.append(elements);
                [].push.apply(that.tiles, tiles)
            })
    }
}

$(function () {
    var $window = $(window)
    var $document = $(document)

    var viewController = new TileViewController('.card-container')

    viewController.clear()

    var clientWidth, clientHeight
    var minTileWidth = 250
    $window.resize(onResize)
    onResize()

    function onResize() {
        clientWidth = $window.width()
        clientHeight = $window.height()

        var $container = viewController.$container
        var containerWidth = $container.width()
        var gapLength = viewController.gapLength
        var minTileWidthWithGap = minTileWidth + gapLength
        var numCols = Math.floor((containerWidth - gapLength) / minTileWidthWithGap)

        console.log('setting numCols: ', numCols)
        viewController.setNumColumns(numCols)
    }

    var dataService = new DataService()
    dataService.search('dress', 10)
        .then(addSearchResultsToPanel)

    $window.on('scroll', onScroll)
    onScroll()

    function onScroll() {
        var scrollTop = $window.scrollTop()
        var diff = $document.height() - (scrollTop + clientHeight)

        if (diff < 1000) {
            $window.off('scroll', onScroll)
            dataService
                .search('', 10)
                .then(addSearchResultsToPanel)
                .done(function () {
                    $window.on('scroll', onScroll)
                })
        }
    }

    function addSearchResultsToPanel(searchResults) {
        var tiles = new Array(searchResults.length)
        for (var i = 0; i < searchResults.length; i++) {
            var searchResult = searchResults[i]
            var tile = new Tile()
            tile.asin = searchResult.asin
            tile.imageId = searchResult.imageId
            tile.price = searchResult.price
            tiles[i] = tile
        }
        viewController.addTiles(tiles)
    }

    var menuController = new MenuController()
    menuController.initlize()
})
