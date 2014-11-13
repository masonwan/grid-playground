class Pos {
    x:Number = 0
    y:Number = 0

    constructor(x?:Number, y?:Number) {
        this.x = x
        this.y = y
    }
}

class Size {
    width:Number = 0
    height:Number = 0

    constructor(width?:Number, height?:Number) {
        this.width = width
        this.height = height
    }
}

class Tile {
    pos:Pos = new Pos(0, 0)
    size:Size = new Size(0, 0)

    constructor(position?:Pos, size?:Size) {
        this.pos = position
        this.size = size
    }
}

class Generator {
    static generate(numCols:Number, numRows:Number) {
        if (typeof(numCols) !== 'number') {
            throw new Error('Number of columns must be specified.')
        }
        numRows = numRows || 5

        var tiles = []
        for (var i = 0; i < 5; i++) {
            var tile = new Tile()
            tiles.push(tile)
        }

        return []
    }
}
