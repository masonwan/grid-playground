/// <reference path="../lib/data.ts" />
/// <reference path="../lib/waterfall.ts" />
declare var Promise:any
declare var $:any

'use strict'

// For debug.
interface Window {
    controller
    dataService
}
declare var window:Window

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
    }

    clear() {
        this.cards.length = 0
        this.$container.empty()
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

    setPipeConfig(config:PipeConfig) {
        if (config.numPipes < 1) {
            throw new Error('The number cannot be less than 1')
        }

        var numPipes = config.numPipes
        var pipes = new Array(numPipes)
        for (var i = 0; i < numPipes; i++) {
            var left = this.gapLength + i * (config.pipeWidth + this.gapLength)
            var pipe = pipes[i] = new Pipe(i)
            pipe.pos = new Pos(left, this.gapLength)
            pipe.size.width = config.pipeWidth
        }
        this.pipes = pipes

        var cards = this.cards
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i]

            var pipe = this.getNextPipe()
            var y = card.pos.y = pipe.pos.y + pipe.size.height
            var x = card.pos.x = pipe.pos.x
            card.$element.css({
                left: x,
                top: y,
                width: config.pipeWidth
            })

            pipe.addCard(card)
            pipe.size.height += card.size.height + this.gapLength

            this.$container.height(pipe.pos.y + pipe.size.height)
        }
    }

    /**
     * Asynchronously create a card element.
     * @param card The card object
     * @returns {Promise} resolve with the element wrapped in jQuery object
     */
    createCardElement(card) {

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
            .data('index', card.index)
            .addClass('card')
            .css('width', card.size.width)
            .append($imageDivElement, $overlayElement, $infoElement)
        card.$element = $cardElement

        return new Promise(function (resolve, reject) {
            // Create the img element.
            var $imgElement = $(document.createElement('img'))
                .attr('alt', card.asin)
                .one('load', {card: card, $cardElement: $cardElement}, function (event) {
                    var $cardElement = event.data.$cardElement
                    var card:Card = event.data.card

                    var height = $cardElement.find('img').prop('height')
                    console.log('card.index: ', card.index)
                    console.log('width', $cardElement.find('img').prop('width'))
                    console.log('height: ', height)
                    card.size.height = height
                    $cardElement.height(height)

                    resolve(card)
                })
                .one('error', function () {
                    reject('Fail to load "' + url + '". The card will be ignored')
                })
            $imageDivElement.append($imgElement)

            // Start to load the image.
            var url = 'http://ecx.images-amazon.com/images/I/' + card.imageId + '._UX' + card.size.width + '_.jpg'
            $imgElement
                .attr('src', url)
        })
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
            card.size.width = this.pipeConfig.pipeWidth
            promises[i] = this.createCardElement(card)
            //.then(function registerMouseHover(card) {
            //    card.$element.on('mouseenter', function (event) {
            //        var originalTarget = this
            //        console.log('originalTarget: ', originalTarget)
            //    })
            //    return card
            //})
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
    controller.clear()

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
            console.log('off')
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
                    console.log('on')
                })
        }
    }


    var resizingDelay:number = 500
    var resizingTimeoutId:number
    handleResizing()

    function handleResizing() {
        var that = this
        $window.resize(function (event) {
            if (resizingTimeoutId == null) {
                resizingTimeoutId = setTimeout(function () {
                    resizingTimeoutId = null
                    resize()
                }, resizingDelay)
                console.log('resizingTimeoutId: ', resizingTimeoutId)
            } else {
                console.info('Found resizing ID: ', that.resizingTimeoutId)
            }
        })
    }

    function resize() {
        var config = controller.calculatePipeSettings()
        console.log('config: ', config)

        if (config.numPipes !== controller.pipeConfig.numPipes) {
            controller.setPipeConfig(config)
        }
        if (config.pipeWidth !== controller.pipeConfig.pipeWidth) {
            // Update card width.
            var newWidth = config.pipeWidth
            // Update the pipe width.
            for (var j = 0; j < controller.pipes.length; j++) {
                var pipe = controller.pipes[j]
                pipe.pos.x = controller.gapLength + pipe.index * (newWidth + controller.gapLength)
            }
            var heights = new Array(controller.cards.length)
            for (var k = 0; k < heights.length; k++) {
                var card = controller.cards[k]
                var $img = card.$element.find('img')
                heights[k] = $img.height()
            }
            for (var i = 0; i < controller.cards.length; i++) {
                var card = controller.cards[i]
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

        controller.pipeConfig = controller.calculatePipeSettings()
    }
})
