import {
    DealSignature, NumericDeal,        // classes
    bridgeSignature,                   // constant
    CardNumber, SeatNumber, PageNumber // types
} from './deal.js'

class Range {
    /**
     * Used for computations: a range of bigint values.
     * start - the first value
     * width - the size of the range
     */
    readonly start:bigint;
    readonly width:bigint;
    constructor(start:bigint,width:bigint) {
        this.start = start
        this.width = width
    }
    get last() { return this.start+this.width }
    contain(num:bigint):boolean {
        return num>=this.start && num<this.last
    }
}

class Remaining {
    /**
     * Used for two different purposes 
     * - decoding page numbers to deals
     * - encoding deals to page numbers
     */
    toWhom: SeatNumber[];
    perSeat: number[];
    total: number;

    constructor(perSeat:readonly number[],total:number) {
        this.perSeat = Array.from(perSeat)
        this.toWhom = new Array<SeatNumber>(total)
        this.total = total
    }

    nextRange(range:Range,pageNo:PageNumber, card:CardNumber):Range {
        /**
         * Used when computing a deal from a page number
         */
        var nextStart = range.start
        for (var seat =0; seat<this.perSeat.length; seat++) {
            var cards = this.perSeat[seat]    
            var width: bigint = range.width * BigInt(cards)/BigInt(this.total)
            if (nextStart + width > pageNo) {
                this.toWhom[card]= seat
                this.total--
                this.perSeat[seat]--
                return new Range(nextStart,width)
            }
            nextStart = nextStart + width
        }
        throw new Error('Invalid page number '+ (pageNo.toString()))
    }

    nextCard(card:CardNumber, seat:SeatNumber,range:Range):Range {
        /**
         * Used when computing a page number from a deal
         */
        var skip = 0
        for (var skipSeat:SeatNumber=0; skipSeat< seat; skipSeat++) {
            skip += this.perSeat[skipSeat]
        }
        var newStart = range.start + range.width * BigInt(skip)/BigInt(this.total)
        var width = range.width * BigInt(this.perSeat[seat]) / BigInt(this.total)
        this.total -= 1
        this.perSeat[seat] -= 1
        return new Range(newStart,width)
    }
}

class PavlicekStrategy {
    /**
     * Described here: http://www.rpbridge.net/7z68.htm
     */
    readonly signature:DealSignature

    constructor(signature:DealSignature|undefined) {
        this.signature = signature || bridgeSignature
    }

    get pages():PageNumber { return this.signature.pages }
    get lastPage():PageNumber { return this.signature.lastPage }

    computePageContent(pageNo:PageNumber):NumericDeal {
        var sig: DealSignature = this.signature
        var remaining = new Remaining(sig.perSeat, sig.cards)
        var range = new Range(BigInt(0),sig.pages)

        for (var card:CardNumber = 0; card<sig.cards; card++) {
            range = remaining.nextRange(range,pageNo,card)
        }
        return new NumericDeal(sig,remaining.toWhom)
    }

    computePageNumber(deal:NumericDeal):PageNumber {
        var range = new Range(BigInt(0),deal.signature.pages)
        var remaining = new Remaining(deal.signature.perSeat,deal.signature.cards)
        deal.toWhom.forEach((seat,card) => {
            range = remaining.nextCard(card,seat,range)
        })
        if (range.width != BigInt(1)) {
            throw new Error('Got range width ' + range.width.toString() + ' after decode')
        }
        return range.start
    }

}

export {PavlicekStrategy}