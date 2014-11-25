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
        return new Tile(this.pos.clone(), this.size.clone())
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

    nextTile(desiredSize?:Size):Tile {
        if (desiredSize == null) {
            desiredSize = new Size(1, 1)
        } else if (desiredSize.area() === 0) {
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
        } while(slotMap[x][y])

        var w = desiredSize.width
        var h = desiredSize.height
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
    static getTextHash(text:string):number {
        if (!text) {
            throw new Error('The text must be at least two characters.')
        }

        var sum = 0
        for (var i = 0; i < text.length; i++) {
            sum += text.charCodeAt(i)
        }

        return sum
    }

    static getStaticSize(text:string):Size {
        var hash = Generator.getTextHash(text) % 10
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

exports.Generator = Generator
exports.ProductTile = ProductTile
