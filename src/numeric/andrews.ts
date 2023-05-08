//  An entirely numeric version of the book
import {
    bridgeSignature, bridgeHandSignature, // constant
    DealSignature, HandSignature, NumericDeal, // Classes
    PageNumber, CardNumber, 
    SeatNumber, // types
    HandArray
} from "./deal"
import { choose } from "./choose"
import * as squashed from "./squashed"
import { OpaqueType } from "@babel/types";

interface SeatFactor {
    // Represents a factor of the Andrews strategy
    readonly quotient: bigint;
    readonly seat: number;
    readonly cards: number;
}

function computeFactors(cardsPer: readonly number[]): SeatFactor[] {
    let totalCards = 0
    let totalProduct = BigInt(1)
    let oldProduct = BigInt(1)
    const result: SeatFactor[] = cardsPer.map(
        (cards: number, seat: number) => {
            totalCards += cards;
            oldProduct = totalProduct;
            totalProduct *= choose(totalCards, cards)

            return { quotient: oldProduct, seat: seat, cards: cards }
        }
    )
    return result.slice(1).reverse()

}

function updateSequence(
    seat: number,
    sequence: number[],
    toWhom: number[],
    remaining: number[]
): number[] {
    // seat - the seat we are currently populating
    // sequence - the (sorted) subsequence of indices for this seat
    // toWhom - the deal we are updating
    // remaining - the current sequence of un-dealt cards
    const newRemaining = Array<number>(remaining.length - sequence.length)
    let iSeq = 0
    let iNewRemaining = 0
    remaining.forEach((card, i) => {
        if (iSeq < sequence.length && sequence[iSeq] == i) {
            toWhom[card] = seat
            iSeq++
        } else {
            newRemaining[iNewRemaining] = card
            iNewRemaining++
        }
    })
    return newRemaining
}

class SequenceBuilder {
    // Keeps track of the number of cards in the seat or
    // lower seats, and determines the sequence of cards
    // as a subset of those cards only. 
    // 
    // builder2 = SequenceBuilder(2,3)
    // [0,3,2,3,1,2,3,2].forEach((seat,card) => {
    //     builder2.nextItem(card,seat)  
    // }
    //
    // Then builder2.sequence should be [1,3,4], because, ignoring the
    // higher seats (3) we get [0,2,1,2,2] and  [1,3,4] is the indices
    // of 2 in that sequence.

    readonly sequence: Array<number>;
    readonly seat: SeatNumber;
    seqIdx: number;
    afterIndex: number;

    constructor(seat: SeatNumber, cards: number) {
        this.seat = seat
        this.sequence = Array<number>(cards)
        this.seqIdx = 0
        this.afterIndex = 0
    }

    nextItem(card: CardNumber, whom: SeatNumber): void {
        if (whom == this.seat) {
            this.sequence[this.seqIdx] = this.afterIndex
            this.seqIdx++
        }
        if (whom <= this.seat) {
            this.afterIndex++
        }
    }
}

class AndrewsDealStrategy {
    readonly signature: DealSignature;
    readonly factors: SeatFactor[];

    constructor(signature: DealSignature = bridgeSignature) {
        this.signature = signature;
        this.factors = computeFactors(this.signature.perSeat)
    }

    get pages(): PageNumber { return this.signature.pages }

    get lastPage(): PageNumber { return this.signature.lastPage }

    private makeSequenceBuilders(): readonly SequenceBuilder[] {
        const sig = this.signature
        const builders: SequenceBuilder[] = Array<SequenceBuilder>(sig.seats - 1);
        for (let i = 1; i < sig.seats; i++) {
            builders[i - 1] = new SequenceBuilder(i, sig.perSeat[i])
        }
        return builders

    }

    computePageNumber(deal: NumericDeal): PageNumber {
        this.signature.assertEqual(
            deal.signature,
            'Mismatched signatures for Deal and Strategy'
        )

        const builders = this.makeSequenceBuilders()
        deal.toWhom.forEach((whom, card) =>
            builders.forEach((builder) => builder.nextItem(card, whom))
        )
        let sum = BigInt(0)
        this.factors.forEach(
            (factor) => {
                const builder = builders[factor.seat - 1]
                const seqNo = squashed.encode(builder.sequence)
                sum += seqNo * factor.quotient
            }
        )
        return sum
    }

    computePageContent(pageNo: bigint): NumericDeal {
        // Determine what deal is on the given page number
        const sig = this.signature
        this.signature.assertValidPageNo(pageNo)
        const toWhom: number[] = Array<number>(sig.cards)
        for (let card = 0; card < sig.cards; card++) {
            toWhom[card] = 0 // default
        }

        let indices = toWhom.map((val, index) => index)
        // Factors are stored in reverse order by seatts, and with
        // no entry for seat 0 because that seat gets all the remaining
        // cards.
        this.factors.forEach(
            (factor: SeatFactor) => {

                const seatIndex: bigint = pageNo / factor.quotient
                pageNo = pageNo % factor.quotient
                const sequence: number[] = squashed.decode(seatIndex, factor.cards)
                indices = updateSequence(factor.seat, sequence, toWhom, indices)

            }
        )
        return new NumericDeal(this.signature, toWhom)
    }
}

class AndrewsHandStrategy {
    readonly signature: HandSignature
    constructor(sig:HandSignature = bridgeHandSignature) {
        this.signature = sig
    }

    get pages() { return this.signature.pages }
    get lastPage() { return this.signature.lastPage }

    assertValidPage(pageNo:PageNumber, adjust: PageNumber = BigInt(0)) {
        this.signature.assertValidPage(pageNo,adjust)
    }

    computePageContent(pageNo:PageNumber):HandArray {
        this.assertValidPage(pageNo)
        const result = squashed.decode(pageNo,this.signature.handLength)
        return result
    }

    computePageNumber(cards:HandArray):PageNumber {
        this.signature.assertValidHand(cards)
        return squashed.encode(cards)
    }

}

export { 
    AndrewsDealStrategy, 
    AndrewsHandStrategy,
    SequenceBuilder /* only for unit tests */
}
