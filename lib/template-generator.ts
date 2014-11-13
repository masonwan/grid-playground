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

class Tile {
    pos:Pos
    size:Size

    constructor(pos?:Pos, size?:Size) {
        this.pos = pos || Pos.EMPTY
        this.size = size || Size.EMPTY
    }
}

class Tempalte {
    tiles:Tile[] = []

    constructor() {
    }

    public area() {
        var areaSum = 0
        this.tiles.forEach(function (tile) {
            areaSum += tile.size.area()
        })
        return areaSum
    }
}

class Generator {
    static generate(numCols:Number, numRows:Number):Tempalte {
        if (typeof(numCols) !== 'number') {
            throw new Error('Number of columns must be specified.')
        }
        numRows = numRows || 5

        var tiles = []
        for (var i = 0; i < 4; i++) {
            var tile = new Tile(new Pos(0, 0), new Size(1, 1))
            tiles.push(tile)
        }
        var template = new Tempalte()
        template.tiles = tiles

        return template
    }
}

exports.Generator = Generator

