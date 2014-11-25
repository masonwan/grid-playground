/**
 * Represent the basic information of a tile.
 */
class Tile {
    pos:Pos = Pos.EMPTY
    size:Size = Size.EMPTY

    constructor(x?:any, y?:any, width?:number, height?:number) {
        if (x instanceof Pos) {
            if (y instanceof Size) {
                this.pos = new Pos(x.x, x.y)
                this.size = new Size(y.width, y.height)
                return
            }
            throw new Error('Cannot create Tile with given parameters.')
        } else if (typeof(width) === 'number' && typeof(height) === 'number') {
            this.pos = new Pos(x, y)
            this.size = new Size(width, height)
        }
    }

    clone():Tile {
        return new Tile(this.pos, this.size)
    }
}

/**
 * A derived class of Tile. It contains the product information.
 */
class ProductTile extends Tile {
    price:number
    imageId:string
    isShown:boolean = false

    constructor(tile:Tile) {
        super(tile.pos, tile.size)
    }
}

class Template {
    tiles:Tile[] = []
    nextTileIndex = null

    constructor(tiles?:Tile[]) {
        if (tiles == null) {
            return
        }
        this.tiles = tiles
        this.nextTileIndex = (tiles.length > 0) ? 0 : null
    }

    public area():number {
        var areaSum = 0
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i]
            areaSum += tile.size.area()
        }
        return areaSum
    }

    isFull():boolean {
        return (this.nextTileIndex != null && this.nextTileIndex)
    }

    getNextTile():Tile {
        return null
    }
}

/**
 * Responsible to generate tile layout.
 */

class Generator {

    numCols:number
    numRows:number = 10
    slotMap:boolean[][]

    previousSlot:Pos = new Pos(-1, 0)

    constructor(numCols:number) {
        this.numCols = numCols
        this.slotMap = new Array(numCols)
        for (var i = 0; i < numCols; i++) {
            this.slotMap[i] = new Array(this.numRows)
        }
    }

    nextTile(size?:Size):Tile {
        if (size == null) {
            size = new Size(1, 1)
        } else if (size.area() === 0) {
            throw new Error('The size must have positive length.')
        }

        var slotMap = this.slotMap
        var x = this.previousSlot.x
        var y = this.previousSlot.y

        // Point the next slot.
        do {
            ++x
            if (x >= this.numCols) {
                x = 0
                ++y
                if (y >= this.numRows) {
                    // Increase the number of rows for each colum.
                    for (var i = 0; i < slotMap.length; i++) {
                        [].push.apply(slotMap[i], new Array(10))
                    }
                }
            }
        } while (slotMap[x][y])

        var w = size.width
        var h = size.height
        // Check the maximun width.
        var col
        for (col = 1; col < w; col++) {
            if (x + col >= this.numCols) {
                break
            }

            var isOccupied = slotMap[x + col][y]
            if (isOccupied) {
                break
            }
        }
        w = col
        // Mark on the slot map.
        for (col = 0; col < w; col++) {
            for (var row = 0; row < h; row++) {
                slotMap[x + col][y + row] = true
            }
        }

        this.previousSlot = new Pos(x, y)
        return new Tile(x, y, w, h)
    }

    /**
     * Return the summation of the char codes.
     */
    getTextHash(text:string):number {
        if (!text) {
            throw new Error('The text must be at least two characters.')
        }

        var sum = 0
        for (var i = 0; i < text.length; i++) {
            sum += text.charCodeAt(i)
        }

        return sum
    }

    getStaticSize(text:string):Size {
        var hash = this.getTextHash(text) % 10
        if (hash < 3) {
            return new Size(1, 1)
        }
        if (hash < 4) {
            return new Size(1, 2)
        }
        if (hash < 5) {
            return new Size(2, 1)
        }
        if (hash < 6) {
            return new Size(2, 2)
        }
        if (hash < 7) {
            return new Size(3, 2)
        }
        if (hash < 8) {
            return new Size(2, 3)
        }

        return new Size(3, 3)
    }
}

/**
 * Responsible to control the DOM.
 */
class TileViewController {
    private static GAP_LENGTH:number = 5
    $container
    config = {
        isAutoCrop: false
    }
    private containerHeight:number = 0

    constructor(selector) {
        this.$container = $(selector)
    }

    clear() {
        this.$container.empty()
    }

    /**
     * TODO: Update the position and size of all tiles according to the container size.
     */
    update() {
    }

    // TODO: smoothly adding the tiles.

    addTile(tile:ProductTile) {
        var numColumns = tile.size.width
        var numRows = tile.size.height
        var column = tile.pos.x
        var row = tile.pos.y

        // Create the image element.
        var width = 250 * numColumns + TileViewController.GAP_LENGTH * (numColumns - 1)
        var height = 250 * numRows + TileViewController.GAP_LENGTH * (numRows - 1)
        var longest = Math.max(width, height)

        var extraFunctionString = this.config.isAutoCrop ? '_AC' : ''
        var url = 'http://ecx.images-amazon.com/images/I/' + tile.imageId + '._SL' + longest + extraFunctionString + '_.jpg'

        var tileContentHtml = '<div class="card"><div class="image" style=""><img src="$imageUrl" alt=""></div><div class="overlay" style=""></div><div class="info"><div class="price">$$price</div></div></div>'
            .replace(/\$imageUrl/, url)
            .replace(/\$price/, tile.price.toString())

        // Create the tile element.
        var left = 250 * column + (column + 1) * TileViewController.GAP_LENGTH
        var top = 250 * row + (row + 1) * TileViewController.GAP_LENGTH
        var $tileElement = $(tileContentHtml)
            .css('left', left)
            .css('top', top)
            .css('width', width)
            .css('height', height)

        // Calculate the container size.
        var containerHeight = top + height + TileViewController.GAP_LENGTH + 50
        if (containerHeight > this.containerHeight) {
            this.containerHeight = containerHeight
        }
        var containerWidth = 250 * 4 + TileViewController.GAP_LENGTH * 5

        this.$container
            .height(this.containerHeight)
            .width(containerWidth)
            .append($tileElement)
    }

    addTiles(tiles) {
        var index = 0
        var that = this
        var intervalId = setInterval(function () {
            if (index >= tiles.length) {
                clearInterval(intervalId)
                return
            }

            that.addTile(tiles[index])
            index++
        }, 10)
    }
}

$(function () {
    var dataService = new DataService()
    var tilePanel = new TileViewController('.card-container')

    tilePanel.clear()
    dataService.search('dress', 10)
        .then(addSearchResultsToPanel)

    var $window = $(window)
    var $document = $(document)
    var clientWidth = $window.width()
    var clientHeight = $window.height()

    $window.on('scroll', handleScroll)

    function handleScroll() {
        var scrollTop = $(window).scrollTop()
        var diff = $document.height() - (scrollTop + clientHeight)

        if (diff < 1000) {
            $window.off('scroll', handleScroll)
            dataService
                .search('', 10)
                .then(addSearchResultsToPanel)
                .done(function () {
                    $window.on('scroll', handleScroll)
                })
        }
    }

    $window.resize(function (event) {
        clientWidth = $window.width()
        clientHeight = $window.height()
    })

    var generator = new Generator(4)

    function addSearchResultsToPanel(searchResults) {
        var productTiles = []
        for (var i = 0; i < searchResults.length; i++) {
            var searchResult = searchResults[i]
            var tile = generator.nextTile(generator.getStaticSize(searchResult.asin))
            if (tile == null) {
                return
            }
            var productTile = new ProductTile(tile)
            productTile.imageId = searchResult.imageId
            productTile.price = searchResult.price

            productTiles.push(productTile)
        }
        tilePanel.addTiles(productTiles)
    }
})
