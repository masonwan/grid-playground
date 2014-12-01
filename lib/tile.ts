/// <reference path="basic-objects.ts" />
declare var $:any

/**
 * Represent the basic information of a tile.
 */
class Tile {
    pos:Pos = Pos.EMPTY
    size:Size = Size.EMPTY

    asin:string
    price:number
    imageId:string

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

    $element

    createElementAsync(unitLength:number) {
        // Create second layout elements.
        var $imageDivElement = $(document.createElement('div'))
            .addClass('image')
        var $overlayElement = $(document.createElement('div'))
            .addClass('overlay')
        var $priceElement = $(document.createElement('div'))
            .addClass('price')
        var $infoElement = $(document.createElement('div'))
            .addClass('info')
            .append($priceElement)

        // Create top element.
        var $cardElement = $(document.createElement('div'))
            .addClass('card')
            .css('width', unitLength * this.size.width)
            .css('height', unitLength * this.size.height)
            .append($imageDivElement, $overlayElement, $infoElement)
        this.$element = $cardElement

        var that = this
        return new Promise(function (resolve, reject) {
            // Create the img element.
            var $imgElement = $(document.createElement('img'))
                .attr('alt', that.asin)
                .one('load', {card: that, $cardElement: $cardElement}, function (event) {
                    var $cardElement = event.data.$cardElement


                    var height = $cardElement.find('img').prop('height')
                    $cardElement.height(height)

                    resolve(that)
                })
                .one('error', function () {
                    reject('Fail to load "' + url + '". The card will be ignored')
                })
            $imageDivElement.append($imgElement)

            // Start to load the image.
            var maxSlot = Math.max(that.size.width, that.size.height)
            var pixels = maxSlot * unitLength
            var url = 'http://ecx.images-amazon.com/images/I/' + that.imageId + '._UX' + pixels + '_.jpg'
            $imgElement
                .attr('src', url)
        })
    }
}

/**
 * Responsible to manage the tile position and size.
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
