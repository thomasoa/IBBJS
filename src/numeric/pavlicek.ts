import {
    DealSignature, NumericDeal, HandSignature, // classes
    bridgeSignature, bridgeHandSignature, // constant
    CardNumber, SeatNumber, PageNumber, HandArray, DealStrategy // types
} from "./deal"

class Range {
    /**
    * Used for computations: a range of bigint values.
    * start - the first value
    * width - the size of the range
    */
    readonly start: bigint;
    readonly width: bigint;
    constructor(start: bigint, width: bigint) {
        this.start = start
        this.width = width
    }
    get last() { return this.start + this.width }
    contains(num: bigint): boolean {
        return num >= this.start && num < this.last
    }

    computeWidth(numerator: number, denominator: number): bigint {
        return this.width * BigInt(numerator) / BigInt(denominator)
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

    constructor(perSeat: readonly number[], total: number) {
        this.perSeat = Array.from(perSeat)
        this.toWhom = new Array<SeatNumber>(total)
        this.total = total
    }

    private checkedNextRange(range, pageNo, card): Range {
        let nextStart = range.start
        for (let seat = 0; seat < this.perSeat.length; seat++) {
            const cards = this.perSeat[seat]
            const width: bigint = range.computeWidth(cards, this.total)
            const nextRange = new Range(nextStart, width)
            if (nextRange.contains(pageNo)) {
                this.toWhom[card] = seat
                this.total--
                this.perSeat[seat]--
                return nextRange
            }
            nextStart = nextStart + width
        }
        throw new Error('Could not find seat for card ' + card + ' and page ' + pageNo)
    }

    nextRange(range: Range, pageNo: PageNumber, card: CardNumber): Range {
        /**
        * Used when computing a deal from a page number
        */
        if (!range.contains(pageNo)) {
            throw new RangeError('Invalid page number ' + (pageNo.toString()))
        }
        return this.checkedNextRange(range, pageNo, card)
    }

    nextCard(card: CardNumber, seat: SeatNumber, range: Range): Range {
        /**
        * Used when computing a page number from a deal
        */
        let skip = 0
        for (let skipSeat: SeatNumber = 0; skipSeat < seat; skipSeat++) {
            skip += this.perSeat[skipSeat]
        }
        const newStart = range.start + range.computeWidth(skip, this.total)
        const width = range.computeWidth(this.perSeat[seat], this.total)
        this.total -= 1
        this.perSeat[seat] -= 1
        return new Range(newStart, width)
    }
}

class PavlicekDealStrategy {
    /**
    * Described here: http://www.rpbridge.net/7z68.htm
    */
    readonly signature: DealSignature

    constructor(signature: DealSignature = bridgeSignature) {
        this.signature = signature
    }

    get pages(): PageNumber { return this.signature.pages }
    get lastPage(): PageNumber { return this.signature.lastPage }

    /**
    * The range for all pages for this strategy
    */
    private get baseRange(): Range {
        return new Range(BigInt(0), this.pages)
    }

    computePageContent(pageNo: PageNumber): NumericDeal {
        this.signature.assertValidPageNo(pageNo)
        const sig: DealSignature = this.signature
        const remaining = new Remaining(sig.perSeat, sig.cards)
        let range = this.baseRange

        for (let card: CardNumber = 0; card < sig.cards; card++) {
            range = remaining.nextRange(range, pageNo, card)
        }
        return new NumericDeal(sig, remaining.toWhom)
    }

    computePageNumber(deal: NumericDeal): PageNumber {
        this.signature.assertEqual(
            deal.signature,
            'Mismatched signatures for Deal and PavlicekDealStrategy'
        )
        let range = this.baseRange
        const remaining = new Remaining(deal.signature.perSeat, deal.signature.cards)
        deal.toWhom.forEach((seat, card) => {
            range = remaining.nextCard(card, seat, range)
        })

        if (range.width != BigInt(1)) {
            // Shouldn't normally be reached
            throw new Error('Got range width ' + range.width.toString() + ' after decode')
        }
        return range.start
    }


}

type DealStrategyClass = new (HandSignature) => DealStrategy

class PavlicekHandStrategy {
    signature: HandSignature
    pStrategy: DealStrategy

    constructor(
        sig: HandSignature = bridgeHandSignature,
        cls: DealStrategyClass = PavlicekDealStrategy
    ) {
        this.signature = sig
        const dSig = new DealSignature([sig.handLength, sig.cards - sig.handLength])
        this.pStrategy = new cls(dSig)
    }

    get pages(): PageNumber {
        return this.signature.pages
    }

    get lastPage(): PageNumber {
        return this.signature.lastPage
    }

    assertValidPage(pageNo: PageNumber, adjust: PageNumber = BigInt(0)) {
        this.signature.assertValidPage(pageNo, adjust)
    }

    computePageContent(pageNo: PageNumber): HandArray {
        this.assertValidPage(pageNo)
        const rawDeal: NumericDeal = this.pStrategy.computePageContent(pageNo)
        return rawDeal.hands[0]
    }

    computePageNumber(cards: HandArray): PageNumber {
        const toWhom = new Array<SeatNumber>(this.signature.cards)
        for (let i = 0; i < this.signature.cards; i++) {
            toWhom[i] = 1
        }
        cards.forEach((card) => {
            toWhom[card] = 0
        })
        const deal = new NumericDeal(this.pStrategy.signature, toWhom)
        return this.pStrategy.computePageNumber(deal)
    }
}

export {
    PavlicekDealStrategy, PavlicekHandStrategy,
    Range, Remaining // For testing only
}
