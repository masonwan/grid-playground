/**
 * Position
 */
class Pos {
    static EMPTY:Pos = new Pos(0, 0)
    x:number = 0
    y:number = 0

    constructor(x?:number, y?:number) {
        this.x = x
        this.y = y
    }
}

class Size {
    static EMPTY:Size = new Size(0, 0)
    width:number = 0
    height:number = 0

    constructor(width?:number, height?:number) {
        this.width = width
        this.height = height
    }

    public area() {
        return this.width * this.height
    }
}

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
        this.tiles.forEach(function (tile) {
            areaSum += tile.size.area()
        })
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
    private static AVAILABLE_SIZES = [
        new Size(1, 1),
        new Size(1, 2),
        new Size(2, 1),
        new Size(2, 2),
        new Size(2, 3),
        new Size(3, 2)
    ]
    private static AVAILABLE_Templates = [
        new Template([
            new Tile(0, 0, 1, 2),
            new Tile(1, 0, 1, 1),
            new Tile(2, 0, 1, 1),
            new Tile(3, 0, 1, 1),
            new Tile(1, 1, 1, 2),
            new Tile(3, 1, 1, 1)
        ]),
        new Template([
            new Tile(0, 0, 2, 3),
            new Tile(2, 0, 2, 2),
            new Tile(2, 2, 1, 1),
            new Tile(3, 2, 1, 1)
        ])
    ]

    private static getRandomSize():Size {
        var index = Math.floor(Math.random() * Generator.AVAILABLE_SIZES.length)
        return Generator.AVAILABLE_SIZES[index]
    }

    private static getRandomTemplate():Template {
        var index = Math.floor(Math.random() * Generator.AVAILABLE_Templates.length)
        return Generator.AVAILABLE_Templates[index]
    }

    private static getRnadomItem(list:any[]) {
        var index = Math.floor(Math.random() * list.length)
        return list[index]
    }

    numCols:number

    constructor(numCols:number) {
        this.numCols = numCols
    }

    private template = [
        new Tile(0, 0, 1, 2),
        new Tile(1, 0, 1, 1),
        new Tile(2, 0, 1, 1),
        new Tile(3, 0, 1, 1),
        new Tile(1, 1, 2, 1),
        new Tile(3, 1, 1, 1),
        new Tile(0, 2, 2, 3),
        new Tile(2, 2, 2, 2),
        new Tile(2, 4, 1, 1),
        new Tile(3, 4, 1, 1)
    ]
    private index = -1
    private blockNum = 1

    nextTile():Tile {
        this.index++
        if (this.index >= this.template.length) {
            this.blockNum++
            this.index = 0
        }
        var tile = this.template[this.index]
        var newTile = new Tile(tile.pos, tile.size)
        newTile.pos.y += (this.blockNum - 1) * 5
        return newTile
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
        var image = document.createElement('img')
        $(image)
            .attr('src', url)
            .attr('alt', url)

        // Create the div card.
        var left = 250 * column + (column + 1) * TileViewController.GAP_LENGTH
        var top = 250 * row + (row + 1) * TileViewController.GAP_LENGTH
        var div = document.createElement('div')
        $(div)
            .addClass('card')
            .addClass('size' + numColumns + 'x' + numRows)
            .css('left', left)
            .css('top', top)
            .css('width', width)
            .css('height', height)
            .append(image)

        // Calculate the container size.
        var containerHeight = top + height + TileViewController.GAP_LENGTH + 50
        if (containerHeight > this.containerHeight) {
            this.containerHeight = containerHeight
        }
        var containerWidth = 250 * 4 + TileViewController.GAP_LENGTH * 5

        this.$container
            .height(this.containerHeight)
            .width(containerWidth)
            .append(div)
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

/**
 * Responsible to send and get data.
 */
class DataService {
    private nextDataIndex:number = 0

    search(query, count) {
        console.log('Search ' + query + ' with ' + count + ' items')
        var that = this
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                if (that.nextDataIndex >= data.length) {
                    resolve([])
                }
                var results = data.slice(that.nextDataIndex, that.nextDataIndex + count)
                that.nextDataIndex += results.length
                resolve(results)
            }, 500)
        })
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
        searchResults.forEach(function (searchResult, i) {
            var tile = generator.nextTile()
            if (tile == null) {
                return
            }
            var productTile = new ProductTile(tile)
            productTile.imageId = searchResult.imageId
            productTile.price = searchResult.price

            productTiles.push(productTile)
        })
        tilePanel.addTiles(productTiles)
    }
})
