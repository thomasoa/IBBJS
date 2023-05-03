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
    contains(num:bigint):boolean {
        return num>=this.start && num<this.last
    }
    
    computeWidth(numerator:number,denominator:number):bigint {
        return this.width * BigInt(numerator)/BigInt(denominator)
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
    
    private checkedNextRange(range,pageNo, card):Range {
        var nextStart = range.start
        for (var seat =0; seat<this.perSeat.length; seat++) {
            var cards = this.perSeat[seat]    
            var width: bigint = range.computeWidth(cards,this.total)
            var nextRange = new Range(nextStart,width)
            if (nextRange.contains(pageNo)) {
                this.toWhom[card]= seat
                this.total--
                this.perSeat[seat]--
                return nextRange
            }
            nextStart = nextStart + width
        }
        throw new Error('Could not find seat for card ' +card +' and page '+ pageNo)
    }
    nextRange(range:Range,pageNo:PageNumber, card:CardNumber):Range {
        /**
        * Used when computing a deal from a page number
        */
        if (!range.contains(pageNo)) {
            throw new RangeError('Invalid page number '+ (pageNo.toString()))
        }
        return this.checkedNextRange(range,pageNo,card)
    }
    
    nextCard(card:CardNumber, seat:SeatNumber,range:Range):Range {
        /**
        * Used when computing a page number from a deal
        */
        var skip = 0
        for (var skipSeat:SeatNumber=0; skipSeat< seat; skipSeat++) {
            skip += this.perSeat[skipSeat]
        }
        var newStart = range.start + range.computeWidth(skip,this.total)
        var width = range.computeWidth(this.perSeat[seat],this.total)
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
    
    constructor(signature:DealSignature=bridgeSignature) {
        this.signature = signature
    }
    
    get pages():PageNumber { return this.signature.pages }
    get lastPage():PageNumber { return this.signature.lastPage }
    
    /**
    * The range for all pages for this strategy
    */
    private get baseRange():Range { 
        return new Range(BigInt(0),this.pages)
    }
    
    computePageContent(pageNo:PageNumber):NumericDeal {
        this.signature.assertValidPageNo(pageNo)
        var sig: DealSignature = this.signature
        var remaining = new Remaining(sig.perSeat, sig.cards)
        var range = this.baseRange
        
        for (var card:CardNumber = 0; card<sig.cards; card++) {
            range = remaining.nextRange(range,pageNo,card)
        }
        return new NumericDeal(sig,remaining.toWhom)
    }
    
    computePageNumber(deal:NumericDeal):PageNumber {
        this.signature.assertEqual(
            deal.signature,
            'Mismatched signatures for Deal and PavlicekStrategy'
        )
        var range = this.baseRange
        var remaining = new Remaining(deal.signature.perSeat,deal.signature.cards)
        deal.toWhom.forEach((seat,card) => {
            range = remaining.nextCard(card,seat,range)
        })
        if (range.width != BigInt(1)) {
            // Shouldn't normally be reached
            throw new Error('Got range width ' + range.width.toString() + ' after decode')
        }
        return range.start
    }
    
    
}

export {PavlicekStrategy}
