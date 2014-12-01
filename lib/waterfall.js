/// <reference path="../lib/basic-objects.ts" />
var Card = (function () {
    function Card(config) {
        this.size = new Size();
        this.pos = new Pos();
        this.index = config['index'];
        this.asin = config['asin'];
        this.price = config['price'];
        this.imageId = config['imageId'];
    }
    /**
     * Asynchronously create a card element.
     * @param width The width of the card
     * @returns {Promise} resolve with the element wrapped in jQuery object
     */
    Card.prototype.createElement = function (width) {
        this.size.width = width;
        // Create second layout elements.
        var $imageDivElement = $(document.createElement('div')).addClass('image');
        var $overlayElement = $(document.createElement('div')).addClass('overlay-transparent');
        var $priceElement = $(document.createElement('div')).addClass('price');
        var $infoElement = $(document.createElement('div')).addClass('info').append($priceElement);
        // Create top element.
        var $cardElement = $(document.createElement('div')).data('index', this.index).addClass('card').css('width', width).append($imageDivElement, $overlayElement, $infoElement);
        this.$element = $cardElement;
        var that = this;
        return new Promise(function (resolve, reject) {
            // Create the img element.
            var $imgElement = $(document.createElement('img')).attr('alt', that.asin).one('load', { card: that, $cardElement: $cardElement }, function (event) {
                var $cardElement = event.data.$cardElement;
                var height = $cardElement.find('img').prop('height');
                that.size.height = height;
                $cardElement.height(height);
                resolve(that);
            }).one('error', function () {
                reject('Fail to load "' + url + '". The card will be ignored');
            });
            $imageDivElement.append($imgElement);
            // Start to load the image.
            var url = 'http://ecx.images-amazon.com/images/I/' + that.imageId + '._UX' + width + '_.jpg';
            $imgElement.attr('src', url);
        });
    };
    return Card;
})();
var Pipe = (function () {
    function Pipe(index, pos, size) {
        this.cards = [];
        this.index = index;
        this.pos = pos || new Pos(0, 0);
        this.size = size || new Size(0, 0);
    }
    Pipe.prototype.addCard = function (card) {
        this.cards.push(card);
        card.pipe = this;
    };
    return Pipe;
})();
var PipeConfig = (function () {
    function PipeConfig(numPipes, pipeWidth) {
        this.numPipes = numPipes;
        this.pipeWidth = pipeWidth;
    }
    return PipeConfig;
})();
//# sourceMappingURL=waterfall.js.map