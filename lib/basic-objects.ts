declare var Promise:any;

/**
 * Position
 */
class Pos {
    static EMPTY:Pos = new Pos(0, 0);
    x:number = 0;
    y:number = 0;

    constructor(x?:number, y?:number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    clone():Pos {
        return new Pos(this.x, this.y);
    }
}

class Size {
    static EMPTY:Size = new Size(0, 0);
    width:number = 0;
    height:number = 0;

    constructor(width?:number, height?:number) {
        this.width = width || 0;
        this.height = height || 0;
    }

    area():number {
        return this.width * this.height;
    }

    ratio():number {
        return this.width / this.height;
    }

    clone():Size {
        return new Size(this.width, this.height);
    }
}
