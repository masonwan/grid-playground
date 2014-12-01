/// <reference path="../lib/basic-objects.ts" />

var data = [
    {"asin": "B00CN47HS4", "imageId": "41f4hX7sLFL", "price": 13.1},
    {"asin": "B00IR57FB2", "imageId": "41bO53HVaJL", "price": 22.93},
    {"asin": "B004UJL0O2", "imageId": "41qtn4TicbL", "price": 12},
    {"asin": "B00LGKWFDS", "imageId": "41h%2BGGdu5cL", "price": 18.32},
    {"asin": "B004UJL0O2", "imageId": "51exNSeLtpL", "price": 19.54},
    {"asin": "B00LGKU3TG", "imageId": "41jSEcAXyfL", "price": 21.68},
    {"asin": "B00D1H02U2", "imageId": "31HuwiPlc-L", "price": 18.03},
    {"asin": "B004UJL0O2", "imageId": "51nf9TAzTjL", "price": 15.24},
    {"asin": "B004UJL0O2", "imageId": "41gf1gIyZSL", "price": 19.42},
    {"asin": "B004UJL0O2", "imageId": "41It5yz52oL", "price": 3.73},
    {"asin": "B00DGVYM3G", "imageId": "318adm87OPL", "price": 12.69},
    {"asin": "B00GV87G9S", "imageId": "41IQ3S0shqL", "price": 7.91},
    {"asin": "B00GV3DIA4", "imageId": "41gU1WULXpL", "price": 12.99},
    {"asin": "B00IZ7XLJ2", "imageId": "41L3bPaPuTL", "price": 15.21},
    {"asin": "B004UJL0O2", "imageId": "41qLA8x6h3L", "price": 13.93},
    {"asin": "B004UJL0O2", "imageId": "41KP%2BGphBYL", "price": 18.69},
    {"asin": "B004UJL0O2", "imageId": "51L-a0ha7IL", "price": 2.9},
    {"asin": "B00CWA3JTK", "imageId": "41zzL2xEDuL", "price": 14.91},
    {"asin": "B005NFVDOE", "imageId": "31gt014zUEL", "price": 9.49},
    {"asin": "B00JIRQS5C", "imageId": "415MBvPpXAL", "price": 13.95},
    {"asin": "B004UJL0O2", "imageId": "411CxezXhuL", "price": 19.43},
    {"asin": "B009IN2NAA", "imageId": "41RzLDlVvkL", "price": 8.73},
    {"asin": "B00DW30JMG", "imageId": "41oJAPjEnGL", "price": 16.47},
    {"asin": "B00GOTXCUG", "imageId": "41YwY2Xh5tL", "price": 18.82},
    {"asin": "B0057KV20U", "imageId": "41JmTy3IOiL", "price": 2.1},
    {"asin": "B00GV3U140", "imageId": "41VuRRej3VL", "price": 29.46},
    {"asin": "B007WA3PD0", "imageId": "41GMEfHdjvL", "price": 14.64},
    {"asin": "B00GV4BGXO", "imageId": "41HPVH%2BD8KL", "price": 20},
    {"asin": "B00AOC9KP0", "imageId": "41e0zVAbUuL", "price": 32.71},
    {"asin": "B00E1JL8HU", "imageId": "41U-JDCixOL", "price": 28.16},
    {"asin": "B00GV66H5E", "imageId": "41OU6-kvitL", "price": 31.79},
    {"asin": "B007PNAAFA", "imageId": "41YFUI7e89L", "price": 24.66},
    {"asin": "B00CJOWK30", "imageId": "415NS%2BUUfoL", "price": 15.98},
    {"asin": "B004UJL0O2", "imageId": "41GKFRTQW1L", "price": 15.08},
    {"asin": "B00GV4C4AS", "imageId": "51RRqrn1mWL", "price": 25.62},
    {"asin": "B007XD6PVU", "imageId": "51ak44SxcrL", "price": 6.9},
    {"asin": "B00E6RD01Y", "imageId": "519JQofBPnL", "price": 16.6},
    {"asin": "B009XPCG3M", "imageId": "41%2BBjqmccfL", "price": 15.66},
    {"asin": "B00GV56ONK", "imageId": "41SWr1mVthL", "price": 9.39},
    {"asin": "B00E1JLT9M", "imageId": "41a7BbkyqwL", "price": 28.8},
    {"asin": "B00E1JOC5U", "imageId": "31ZpxFaB7GL", "price": 11.99},
    {"asin": "B004UJL0O2", "imageId": "41qub3h2RJL", "price": 27.47},
    {"asin": "B004UJL0O2", "imageId": "51nnNN3bQCL", "price": 13.65},
    {"asin": "B00GOVV0PI", "imageId": "4197WJE23EL", "price": 18.12},
    {"asin": "B004UJL0O2", "imageId": "41sbWWPESSL", "price": 21.39},
    {"asin": "B004UJL0O2", "imageId": "41f41lRyIcL", "price": 16.64},
    {"asin": "B004UJL0O2", "imageId": "41k3Hd6BfQL", "price": 17.19},
    {"asin": "B0055XFRY6", "imageId": "41GQVjQZ7rL", "price": 7.02},
    {"asin": "B004UJL0O2", "imageId": "51sMRIUIwZL", "price": 17.04},
    {"asin": "B004UJL0O2", "imageId": "51OHtFqXE3L", "price": 18.63},
    {"asin": "B004UJL0O2", "imageId": "41ZBYtEZq5L", "price": 13.97},
    {"asin": "B00EZE88GK", "imageId": "41tLT2wbfNL", "price": 35.85},
    {"asin": "B00HFKLQJW", "imageId": "41%2B-s0QFD9L", "price": 16.78},
    {"asin": "B004UJL0O2", "imageId": "51RMjfftgoL", "price": 12.4},
    {"asin": "B00OINTB6E", "imageId": "51IzN0waWUL", "price": 37.63},
    {"asin": "B00GV718BQ", "imageId": "51Nhzx3ikPL", "price": 9.63},
    {"asin": "B00GV3TCTA", "imageId": "51aiYr2Xt3L", "price": 17.34},
    {"asin": "B004UJL0O2", "imageId": "51sZWCE%2B00L", "price": 10.54},
    {"asin": "B004UJL0O2", "imageId": "41x0s0LHUPL", "price": 10.29},
    {"asin": "B007XD6KII", "imageId": "41yIyOQxzgL", "price": 9.3},
    {"asin": "B004UJL0O2", "imageId": "51gkaL4qpDL", "price": 9.44},
    {"asin": "B00G9PW1D4", "imageId": "51oeuD6ZYaL", "price": 11.99},
    {"asin": "B00A15ZMG6", "imageId": "41Zut3SLNHL", "price": 11.68},
    {"asin": "B00KRBC49W", "imageId": "41E%2B6xlnFRL", "price": 12.89},
    {"asin": "B004UJL0O2", "imageId": "41vNRDfYeJL", "price": 12.69},
    {"asin": "B004UJL0O2", "imageId": "41ZdtIu8FOL", "price": 9.36},
    {"asin": "B00E0JQ01A", "imageId": "51OlbfIkUrL", "price": 9},
    {"asin": "B009PML2SS", "imageId": "41O5%2B8EnPBL", "price": 12.54},
    {"asin": "B004UJL0O2", "imageId": "511KEPw7FZL", "price": 13.42},
    {"asin": "B004UJL0O2", "imageId": "51ZX6iGsdEL", "price": 33.32},
    {"asin": "B00DGYJUCG", "imageId": "41-ojupCIdL", "price": 12.04},
    {"asin": "B004UJL0O2", "imageId": "41dJI9%2Bf8SL", "price": 12.22},
    {"asin": "B0057DNPDO", "imageId": "31H5umO0eRL", "price": 8.66},
    {"asin": "B007WA2MC0", "imageId": "41ftCIXhSvL", "price": 21.51},
    {"asin": "B004UJL0O2", "imageId": "31%2BfAJ61fWL", "price": 7.01},
    {"asin": "B00K86FBGO", "imageId": "41k8kIrDlbL", "price": 15.05},
    {"asin": "B00D83NKJE", "imageId": "4188I6W4jJL", "price": 11.32},
    {"asin": "B008P5OMEW", "imageId": "41TYm3OVokL", "price": 14.17},
    {"asin": "B00E1LC1Q0", "imageId": "41Y0VXYMK-L", "price": 20.78},
    {"asin": "B004UJL0O2", "imageId": "417woAI1qiL", "price": 12.9},
    {"asin": "B004UJL0O2", "imageId": "51yW4dhXyrL", "price": 10.66},
    {"asin": "B00DW3ABII", "imageId": "41L2fTjtfgL", "price": 20.44},
    {"asin": "B00B30IK08", "imageId": "41ACGsWrLTL", "price": 23.58},
    {"asin": "B004UJL0O2", "imageId": "41uBMzIKaQL", "price": 13.77},
    {"asin": "B004UJL0O2", "imageId": "41-6ohEmV7L", "price": 8.34},
    {"asin": "B004UJL0O2", "imageId": "31EZAgJNg5L", "price": 12.71},
    {"asin": "B00E1L9CEE", "imageId": "41DHfxesVfL", "price": 11.44},
    {"asin": "B00DW3ATY4", "imageId": "41AMcKj5SCL", "price": 20.24},
    {"asin": "B004UJL0O2", "imageId": "41YMdn8F1JL", "price": 12.54},
    {"asin": "B004UJL0O2", "imageId": "41rlCMQd%2B2L", "price": 16.15},
    {"asin": "B004UJL0O2", "imageId": "51%2BBm-vG-1L", "price": 13.41},
    {"asin": "B005FJINTQ", "imageId": "41dyGJoncTL", "price": 7.44},
    {"asin": "B004UJL0O2", "imageId": "41YZ%2BDqil4L", "price": 9.28},
    {"asin": "B009791H8Y", "imageId": "41WigxuGzqL", "price": 42.2},
    {"asin": "B00D83QXH0", "imageId": "417jjoltM7L", "price": 20.08},
    {"asin": "B004UJL0O2", "imageId": "51IyOM%2BMDIL", "price": 13.26}
]

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
