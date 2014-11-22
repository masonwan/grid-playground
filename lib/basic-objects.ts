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

    area():number {
        return this.width * this.height
    }

    clone():Size {
        return new Size(this.width, this.height)
    }
}

/**
 * Responsible to send and get data.
 */
class DataService {
    private nextDataIndex:number = 0
    simulatedDelay:number = 500

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
            }, this.simulatedDelay)
        })
    }
}
