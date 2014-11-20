/**
 * Position
 */
class Pos {
    static EMPTY:Pos = new Pos(0, 0)
    x:number = 0
    y:number = 0

    constructor(x?:number, y?:number) {
        this.x = x || 0
        this.y = y || 0
    }

    clone():Pos {
        return new Pos(this.x, this.y)
    }
}

class Size {
    static EMPTY:Size = new Size(0, 0)
    width:number = 0
    height:number = 0

    constructor(width?:number, height?:number) {
        this.width = width || 0
        this.height = height || 0
    }

    area() {
        return this.width * this.height
    }

    clone():Size {
        return new Size(this.width, this.height)
    }
}

class Card {

    index:number
    asin:string
    price:number
    imageId:string

    size:Size = new Size()
    pos:Pos = new Pos()
    $element

    _pipe:Pipe

    pipe(pipe?:Pipe) {
        if (pipe) {
            this._pipe = pipe
            return
        }

        return this._pipe
    }

    constructor(config) {
        this.index = config['index']
        this.asin = config['asin']
        this.price = config['price']
        this.imageId = config['imageId']
    }

    createElement(width) {

        this.size.width = width

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
            .data('index', this.index)
            .addClass('card')
            .css('width', width)
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
                    that.size.height = height
                    $cardElement.height(height)

                    if (that._pipe) {

                    }

                    console.log('Image loaded: ', that)
                    resolve()
                })
                .one('error', function () {
                    reject('Fail to load "' + url + '". The card will be ignored')
                })
            $imageDivElement.append($imgElement)

            // Start to load the image.
            var url = 'http://ecx.images-amazon.com/images/I/' + that.imageId + '._UX' + width + '_.jpg'
            $imgElement
                .attr('src', url)
        })
    }
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
    gapLength = 5
    index:number
    pos:Pos
    size:Size
    cards:Card[] = []

    constructor(index:number, pos?:Pos, size?:Size) {
        this.index = index
        this.pos = pos || new Pos(0, 0)
        this.size = size || new Size(0, 0)
    }

    addCard(card:Card) {
        this.cards.push(card)
        card.pipe(this)
    }
}

class WaterfallViewController {
    gapLength:number = 5
    $container
    pipes:Pipe[] = []
    cards:Card[] = []
    numCards:number = 0
    latestCardIndex:number = -1

    constructor(selector) {
        this.$container = $(selector)
        console.log(this.$container)
        if (this.$container.length === 0) {
            throw new Error('Cannot find the container with ' + selector)
        }
        this.initailizePipes(this.$container.width())
    }

    pipeWidth:number
    minPipeWidth:number = 250

    initailizePipes(width:number) {
        var numPipes = Math.floor((width - this.gapLength) / (this.minPipeWidth + this.gapLength))
        var pipeWidth = this.pipeWidth = Math.floor((width - this.gapLength) / numPipes) - this.gapLength
        var pipes = new Array(numPipes)
        for (var i = 0; i < numPipes; i++) {
            var left = this.gapLength + i * (pipeWidth + this.gapLength)
            var pipe = pipes[i] = new Pipe(i)
            pipe.pos = new Pos(left, this.gapLength)
            pipe.size.width = pipeWidth
        }
        this.pipes = pipes

        console.log('Total width', width)
        console.log('Number of pipes', numPipes)
        console.log('Pipe width', pipeWidth)
    }

    addCard(card:Card) {

        // todo: remove this
        this.$container.height(2400)

        this.cards.push(card)
        card.index = ++this.latestCardIndex

        return card.createElement(this.pipeWidth)
            .then(function () {
                return card
            })
    }

    addCards(cards:Card[]) {
        var that = this
        var promises = cards.map(function (card) {
            return that.addCard(card)
        })
        Promise.settle(promises)
            .then(function (results) {
                var cards = []
                results.forEach(function (r) {
                    if (r.isRejected()) {
                        console.warn(r.reason())
                    } else {
                        cards.push(r.value())
                    }
                })
                return cards
            })
            .done(function (cards) {
                console.log('Add', cards.length, 'cards')

                cards.forEach(function (card) {
                    var pipe = that.getNextPipe()
                    var y = card.pos.y = pipe.pos.y + pipe.size.height + that.gapLength
                    var x = card.pos.x = pipe.pos.x
                    card.$element.offset({left: x, top: y})

                    console.log('Adding card ', card, ' at Pipe ' + pipe.index)
                    pipe.addCard(card)
                    pipe.size.height += card.size.height + that.gapLength
                    console.log('The height grows to ', pipe.size.height)

                    that.$container.height(pipe.pos.y + pipe.size.height)
                })

                var elements = cards.map(function (card) {
                    return card.$element
                })
                console.log(elements)
                that.$container.append(elements)
            })
    }

    getNextPipe():Pipe {
        var
            pipeWithMinHeight,
            minHeight = Number.MAX_VALUE

        if (this.pipes.length <= 0) {
            throw new Error('No pipe exists')
        }

        for (var i = 0; i < this.pipes.length; i++) {
            var pipe = this.pipes[i]
            if (pipe.size.height < minHeight) {
                minHeight = pipe.size.height
                pipeWithMinHeight = pipe
            }
        }

        return pipeWithMinHeight
    }

    static getImageSize(url) {
        return new Promise(function (resolve, reject) {
            var imgElement = document.createElement('img')
            imgElement.onload = function () {
                console.log(window.x = imgElement)
                resolve(new Size(imgElement.width, imgElement.height))
            }
            imgElement.onerror = function () {
                reject({
                    url: url
                })
            }
            imgElement.src = url
        })
    }
}

$(function () {
    // todo: remove debug
    var controller = window.controller = new WaterfallViewController('.card-container')
    var dataService = window.dataService = new DataService()

    controller.$container.empty()
    dataService
        .search('allala', 10)
        .then(function (results) {
            var cards = results.map(function (result, i) {
                return new Card(result)
            })
            controller.addCards(cards)
        })

    var $window = $(window)
    var $document = $(document)
    var clientWidth = $window.width()
    var clientHeight = $window.height()

    $window.on('scroll', handleScroll)
    handleScroll()

    function handleScroll() {
        var scrollTop = $(window).scrollTop()
        var diff = $document.height() - (scrollTop + clientHeight)
        console.log('diff', diff)

        if (diff < 1000) {
            $window.off('scroll', handleScroll)
            dataService
                .search('', 10)
                .then(function (results) {
                    var cards = results.map(function (result, i) {
                        return new Card(result)
                    })
                    controller.addCards(cards)
                })
                .done(function () {
                    $window.on('scroll', handleScroll)
                })
        }
    }
})
