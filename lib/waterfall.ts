/// <reference path="../lib/basic-objects.ts" />
declare var $:any;

class Card {

    index:number;
    asin:string;
    price:number;
    imageId:string;

    size:Size = new Size();
    pos:Pos = new Pos();
    $element;

    pipe:Pipe;

    constructor(config) {
        this.index = config['index'];
        this.asin = config['asin'];
        this.price = config['price'];
        this.imageId = config['imageId'];
    }
}

class Pipe {
    index:number;
    pos:Pos;
    size:Size;
    cards:Card[] = [];

    constructor(index:number, pos?:Pos, size?:Size) {
        this.index = index;
        this.pos = pos || new Pos(0, 0);
        this.size = size || new Size(0, 0);
    }

    addCard(card:Card) {
        this.cards.push(card);
        card.pipe = this;
    }
}

class PipeConfig {
    numPipes:number;
    pipeWidth:number;

    constructor(numPipes:number, pipeWidth:number) {
        this.numPipes = numPipes;
        this.pipeWidth = pipeWidth;
    }
}
