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

class Card {
}

class ProductCard extends Card {
    price:number
    imageId:string
}

/**
 * Responsible to send and get data.
 */
class DataService {
    private nextDataIndex:number = 0

    search(query, count) {
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

class Pipe {
    height:number
    left:number
    cards:Card[]

    constructor(left:number) {

    }
}

class WaterfallViewController {
    gapLength:number = 5
    $container
    pipes:Pipe[] = []
    cards:Card[] = []
    numCards:number = 0

    constructor(selector) {
        this.$container = $(selector)
        console.log(this.$container)
        if (this.$container.length === 0) {
            throw new Error('Cannot find the container with ' + selector)
        }
        this.initailizePipes(this.$container.width())
    }

    pipeWidth
    minPipeWidth:number = 250

    initailizePipes(width:number) {
        var numPipes = Math.floor((width - this.gapLength) / (this.minPipeWidth + this.gapLength))
        var pipes = new Array(numPipes)
        for (var i = 0; i < numPipes; i++) {
            var left = this.gapLength + i * (this.pipeWidth + this.gapLength)
            pipes[i] = new Pipe(left)
        }
        this.pipeWidth = Math.floor((width - this.gapLength) / numPipes) - this.gapLength

        console.log('Total width', width)
        console.log('Number of pipes', numPipes)
        console.log('Pipe width', this.pipeWidth)
    }

    addCard(card:ProductCard) {
        // Render the card.

        var url = 'http://ecx.images-amazon.com/images/I/' + card.imageId + '._SL' + this.pipeWidth + '_.jpg'
        var cardContentHtml = '<div class="card"><div class="image"><img src="$imageUrl" alt=""></div><div class="overlay"></div><div class="info"><div class="price">$price</div></div></div>'
            .replace(/\$imageUrl/, url)
            .replace(/\$price/, card.price.toString())
        var $cardElement = $(cardContentHtml)
            .css('width', this.pipeWidth)

        console.log('cardContentHtml', cardContentHtml)

        this.$container.height(600)
        this.$container.find('.card').height(309)
        this.$container.find('.image').height(309)

        this.$container
            .append($cardElement)
    }

    addCards(cards:Card[]) {
        var index = 0
        var that = this
        var intervalId = setInterval(function () {
            if (index >= cards.length) {
                clearInterval(intervalId)
                return
            }

            that.addCard(cards[index])
            index++
        }, 10)
    }

    private getNextPipe():Pipe {
        var pipeWithMaxBottom,
            maxBottom = -1

        for (var i = 0; i < this.pipes.length; i++) {
            var p = this.pipes[i]
            p.cards[]
        }

        return null
    }

    static getImageSize(url) {
        var that = this
        return new Promise(function (resolve, reject) {
            var imgElement = document.createElement('img')
            imgElement.onload = function () {
                resolve(new Size($(imgElement).width(), $(imgElement).height()))
            }
            imgElement.src = url
        })
    }
}

$(function () {
    var controller = new WaterfallViewController('.card-container')
    var dataService = new DataService()

    dataService
        .search('allala', 10)
        .then(function (results) {
            var cards = results.map(function (result, i) {
                var productCard = new ProductCard()
                productCard.imageId = result.imageId
                productCard.price = result.price
                return productCard
            })
            controller.addCards(cards)
        })
})
