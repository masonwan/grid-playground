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

/**
 * Responsible to control the DOM related to the tile view.
 */
class TileViewController {
    gapLength:number = 5
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
                that.$container.append(tiles.map(function (tile) {
                    return tile.$element
                }));
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
})
