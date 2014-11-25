var Pos = require('./basic-objects').Pos
var Size = require('./basic-objects').Size
var DataService = require('./basic-objects').DataService

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

class ProductTile extends Tile {
    price:number
    imageId:string
    isShown:boolean = false
/**/
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

    static generate(numCols:number, numRows:number):Template {
        if (typeof(numCols) !== 'number') {
            throw new Error('Number of columns must be specified.')
        }
        numRows = numRows || 5

        var tiles = [
            new Tile(0, 0, 1, 2),
            new Tile(1, 0, 1, 1),
            new Tile(2, 0, 1, 1),
            new Tile(3, 0, 1, 1),
            new Tile(1, 1, 1, 2),
            new Tile(3, 1, 1, 1)
        ]

        var template = new Template()
        template.tiles = tiles
        return template
    }

    numCols:number

    constructor(numCols:number) {
        this.numCols = numCols
    }

    temp = [
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
    index = -1
    blockNum = 1

    nextTile():Tile {
        this.index++
        if (this.index >= this.temp.length) {
            this.blockNum++
            this.index = 0
        }
        var tile = this.temp[this.index]
        tile.pos.y += (this.blockNum - 1) * 5
        return tile
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

    getStaticSize(text):object {
        return null
    }
}

class TilePanel {
    private static GAP_LENGTH:number = 10
    $container

    constructor(selector) {
        this.$container = $(selector)
    }

    clear() {
        this.$container.empty()
    }

    addTile(tile:ProductTile) {
        var numColumns = tile.size.width
        var numRows = tile.size.height
        var column = tile.pos.x
        var row = tile.pos.y

        // Create the image element.
        var width = 250 * numColumns + TilePanel.GAP_LENGTH * (numColumns - 1)
        var height = 250 * numRows + TilePanel.GAP_LENGTH * (numRows - 1)
        var url = 'http://ecx.images-amazon.com/images/I/' + tile.imageId + '.jpg'
        var image = document.createElement('img')
        $(image)
            .attr('src', url)
            .attr('alt', url)

        // Create the div card.
        var left = 250 * column + column * TilePanel.GAP_LENGTH
        var top = 250 * row + row * TilePanel.GAP_LENGTH
        var div = document.createElement('div')
        $(div)
            .addClass('card')
            .addClass('size' + numColumns + 'x' + numRows)
            .css('left', left)
            .css('top', top)
            .css('width', width)
            .css('height', height)
            .append(image)
        this.$container.append(div)
    }
}

exports.Generator = Generator
exports.ProductTile = ProductTile
