class Card {

    index:number
    asin:string
    price:number
    imageId:string

    size:Size = new Size()
    pos:Pos = new Pos()
    $element

    pipe:Pipe

    constructor(config) {
        this.index = config['index']
        this.asin = config['asin']
        this.price = config['price']
        this.imageId = config['imageId']
    }

    /**
     * Asynchronously create a card element.
     * @param width The width of the card
     * @returns {Promise} resolve with the element wrapped in jQuery object
     */
    createElement(width) {

        this.size.width = width

        // Create second layout elements.
        var $imageDivElement = $(document.createElement('div'))
            .addClass('image')
        var $overlayElement = $(document.createElement('div'))
            .addClass('overlay-transparent')
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

                    resolve(that)
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

class Pipe {
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
        card.pipe = this
    }
}

class PipeConfig {
    numPipes:number
    pipeWidth:number

    constructor(numPipes:number, pipeWidth:number) {
        this.numPipes = numPipes
        this.pipeWidth = pipeWidth
    }
}

class WaterfallViewController {
    gapLength:number = 2
    $container
    cards:Card[] = []
    latestCardIndex:number = -1

    pipes:Pipe[] = []
    pipeConfig:PipeConfig
    minPipeWidth:number = 250

    constructor(selector) {
        this.$container = $(selector)
        if (this.$container.length === 0) {
            throw new Error('Cannot find the container with selector: ' + selector)
        }
        this.initailizePipes()
        this.handleResizing()
    }

    resizingDelay:number = 500
    resizingTimeoutId:number

    handleResizing() {
        var that = this
        $(window).resize(function (event) {
            if (that.resizingTimeoutId == null) {
                that.resizingTimeoutId = setTimeout(function () {
                    that.resizingTimeoutId = null
                    that.resize()
                }, that.resizingDelay)
            }
        })
    }

    resize() {
        var that = this
        var config = that.calculatePipeSettings()
        console.log('config: ', config)

        if (config.numPipes !== that.pipeConfig.numPipes) {
            // Update columns.
        }
        if (config.pipeWidth !== that.pipeConfig.pipeWidth) {
            // Update card width.
            var newWidth = config.pipeWidth
            // Update the pipe width.
            for (var j = 0; j < that.pipes.length; j++) {
                var pipe = that.pipes[j]
                pipe.pos.x = that.gapLength + pipe.index * (newWidth + that.gapLength)
            }
            var heights = new Array(that.cards.length)
            for (var k = 0; k < heights.length; k++) {
                var card = that.cards[k]
                var $img = card.$element.find('img')
                heights[k] = $img.height()
            }
            for (var i = 0; i < that.cards.length; i++) {
                var card = that.cards[i]
                card.size.width = newWidth
                card.$element.css('width', newWidth)
                card.pos.x = card.pipe.pos.x
                if (card.pos.y < 0) {
                    console.log('card.pos: ', card.pos || 'null')
                    console.log('card.$element.offset(): ', card.$element.position())
                }
                card.$element.css({
                    left: card.pos.x,
                    top: card.pos.y,
                    height: heights[i]
                })
            }
        }

        that.pipeConfig = that.calculatePipeSettings()
    }

    initailizePipes() {
        var config = this.pipeConfig = this.calculatePipeSettings()

        console.log('pipeSettings: ', config)

        var pipes = new Array(config.numPipes)
        for (var i = 0; i < config.numPipes; i++) {
            var left = this.gapLength + i * (config.pipeWidth + this.gapLength)
            var pipe = pipes[i] = new Pipe(i)
            pipe.pos = new Pos(left, this.gapLength)
            pipe.size.width = config.pipeWidth
        }
        this.pipes = pipes
    }

    calculatePipeSettings():PipeConfig {
        var containerWidth = this.$container.width()

        if (containerWidth <= this.minPipeWidth) {
            return new PipeConfig(1, containerWidth)
        }

        var numPipes = Math.floor((containerWidth - this.gapLength) / (this.minPipeWidth + this.gapLength))
        var pipeWidth = Math.floor((containerWidth - this.gapLength) / numPipes) - this.gapLength
        return new PipeConfig(numPipes, pipeWidth)
    }

    addCards(cards:Card[]) {
        var that = this
        var promises = new Array(cards.length)
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i]
            this.cards.push(card)
            card.index = ++this.latestCardIndex
            promises[i] = card.createElement(this.pipeConfig.pipeWidth)
                .then(function (card) {
                    card.$element.on('mouseenter', function (event) {
                        var originalTarget = this
                        console.log('originalTarget: ', originalTarget)
                    })
                    return card
                })
        }
        return Promise.settle(promises)
            .then(function (results) {
                var cards = []
                for (var i = 0; i < results.length; i++) {
                    var r = results[i]
                    if (r.isRejected()) {
                        console.warn(r.reason())
                    } else {
                        cards.push(r.value())
                    }
                }
                return cards
            })
            .done(function (cards) {
                console.log('Add', cards.length, 'cards')

                for (var i = 0; i < cards.length; i++) {
                    var card = cards[i]

                    var pipe = that.getNextPipe()
                    var y = card.pos.y = pipe.pos.y + pipe.size.height
                    var x = card.pos.x = pipe.pos.x
                    card.$element.css({left: x, top: y})

                    console.log('Adding card ', card, ' at Pipe ' + pipe.index)
                    pipe.addCard(card)
                    pipe.size.height += card.size.height + that.gapLength

                    that.$container.height(pipe.pos.y + pipe.size.height)
                }

                var elements = cards.map(function (card) {
                    return card.$element
                })
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
}

$(function () {
    var controller = new WaterfallViewController('.card-container')
    var dataService = new DataService()

    // todo: remove debug
    window.controller = controller
    window.dataService = dataService
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

    // Handle scroll.
    $window.on('scroll', handleScroll)
    handleScroll()

    function handleScroll() {
        var scrollTop = $(window).scrollTop()
        var diff = $document.height() - (scrollTop + clientHeight)

        if (diff < 1500) {
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
