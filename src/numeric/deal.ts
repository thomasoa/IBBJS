// Common numeric deal logic and types
import { multinomial, choose } from "./choose"

type SeatNumber = number;
type CardNumber = number;
type PageNumber = bigint;
type HandArray = readonly CardNumber[]

class DealSignature {
    /** An immutable definition ffor a class of deals
     * 
     * sig = new DealSignature[4,4,4,4]
     *
     * sig.perSet - an array telling how man cards each seat is suppose to get
     * sig.seats  - the number of seats
     * sig.cards  - the total number of cards to be dealt
     * sig.pages  - The total number of distinct deals of this type
     * 
     * A bridge deal has:
     *     perSeat = [13,13,13,13] - each seat gets 13 cards
     *     seats   = 4
     *     card    = 52
     *    pages   = A very large number - the multinomial of 52 choose (13,13,13,13)   
     */
    readonly perSeat: readonly number[];
    readonly seats: number;
    readonly cards: number;
    readonly pages: bigint;
    private _bits: number | undefined;

    constructor(cardsPerSeat: number[]) {
        this.perSeat = Array.from(cardsPerSeat)
        this.seats = cardsPerSeat.length
        this.cards = cardsPerSeat.reduce(
            (total: number, nextVal: number) => total + nextVal
        )
        this.pages = multinomial(cardsPerSeat);
    }

    get lastPage(): PageNumber {
        return this.pages - BigInt(1)
    }

    toString(): string {
        return 'DealSignature(' + this.perSeat.toString() + ')'
    }

    validSeat(seatNum: SeatNumber): boolean {
        return seatNum >= 0 && seatNum < this.seats
    }

    validHands(hands: readonly HandArray[]): boolean {
        return (hands.length == this.seats) &&
            this.perSeat.every((len, seatNum) => len == hands[seatNum].length)
    }
    equals(otherSig: DealSignature): boolean {
        if (this === otherSig) {
            return true
        }

        if (this.seats != otherSig.seats) {
            return false
        }
        return this.perSeat.every((value, index) => value == otherSig.perSeat[index])
    }

    get bits(): number {
        this._bits = this._bits || this.computeBits()
        return this._bits
    }

    assertEqual(otherSig: DealSignature, message = "Unmatching deal signature"): void {
        if (this.equals(otherSig)) {
            return
        }
        throw new TypeError(message + ": Expected " + this.toString() + ", got " + otherSig.toString())
    }

    assertValidPageNo(pageNo: PageNumber): void {
        if (pageNo >= this.pages || pageNo < BigInt(0)) {
            throw new RangeError("Invalid page " + pageNo + " outside range <=" + this.pages.toString())
        }
    }


    computeBits(): number {
        let bits = 0
        let pages = this.pages
        const two = BigInt(2)
        while (pages > BigInt(0)) {
            bits++
            pages /= two
        }
        return bits
    }
}

class HandSignature {
    readonly handLength: number
    readonly cards: number;
    readonly pages: bigint;

    constructor(handLength: number, deckLength: number) {
        this.handLength = handLength
        this.cards = deckLength
        this.pages = choose(deckLength, handLength)
    }

    get lastPage(): bigint { return this.pages - BigInt(1) }

    assertValidCard(card: CardNumber) {
        if (card < 0 || card >= this.cards) {
            throw new TypeError('Invalid card number ' + card + ', should be between 0 and ' + (this.cards - 1))
        }
    }

    assertValidPage(pageNo: PageNumber, adjust: PageNumber = BigInt(0)): void {
        if (pageNo < BigInt(0) || pageNo >= this.pages) {
            throw new Error('Page out of bounds: ' + (pageNo + adjust))
        }
    }

    assertValidHand(numbers: HandArray) {
        if (numbers.length != this.handLength) {
            throw new Error('Expected ' + this.handLength + ' cards, got ' + numbers.length)
        }
        let last = -1
        for (let i = 0; i < numbers.length; i++) {
            const card = numbers[i]
            if (card <= last) {
                throw new TypeError('Expected sorted list of card numbers')
            }
            this.assertValidCard(card)
            last = card
        }
        // TODO check cards are distinct
    }
}

/**
 * A standard bridge signature - four seats, each seat getting 13 cards
 */
const bridgeSignature = new DealSignature([13, 13, 13, 13])

function buildHands(signature: DealSignature, toWhom: SeatNumber[]): readonly HandArray[] {
    const hands = signature.perSeat.map(() => new Array<number>(0))
    toWhom.forEach((seat, card) => {
        if (signature.validSeat(seat)) {
            hands[seat].push(card)
        } else {
            throw RangeError(
                'Invalid seat ' + seat + ' for deal in with ' + signature.seats + ' seats'
            )
        }
    })
    return hands

}

/**
 *  A deal which matches a signature
 * 
 * Cards in a NumericDeal are just indexes from zero to one
 * less than the number of cards in the signature. No meaning
 * is implied by the seat numbers - they will be mapped in
 * the bridge package.
 */
class NumericDeal {
    readonly signature: DealSignature;
    readonly toWhom: readonly SeatNumber[];
    readonly hands: readonly HandArray[];

    constructor(sig: DealSignature, toWhom: number[]) {
        if (toWhom.length != sig.cards) {
            throw TypeError(
                'Wrong number of cards in deal. Expected'
                + sig.cards + ', got ' + toWhom.length
            )
        }
        this.signature = sig
        this.toWhom = Array.from(toWhom)
        this.hands = buildHands(sig, toWhom)
        this.validateSignature()

    }

    validateSignature(): void {
        if (!this.signature.validHands(this.hands)) {
            throw new TypeError('Invalid deal signature')
        }

    }
}

/**
 * A DealStrategy is a way of converting deals into indexes.
 * 
 * The 'page numbers' start from zero and end at the number of
 * pages minus 1, as computed by the DealSignature.
 */
interface DealStrategy {
    readonly signature: DealSignature;
    readonly pages: PageNumber;
    readonly lastPage: PageNumber;
    computePageContent(pageNo: PageNumber): NumericDeal;
    computePageNumber(deal: NumericDeal): PageNumber;
}

interface HandStrategy {
    readonly signature: HandSignature
    readonly pages: PageNumber
    readonly lastPage: PageNumber

    assertValidPage(pageNo: PageNumber, adjust: PageNumber | undefined)
    computePageContent(pageNo: PageNumber): HandArray
    computePageNumber(cards: HandArray): PageNumber
}

const bridgeHandSignature = new HandSignature(13, 52)

export {
    DealSignature, HandSignature, NumericDeal, // classes
    bridgeSignature, bridgeHandSignature,      // constant
    DealStrategy, HandStrategy,                // interfaces
    CardNumber, SeatNumber, PageNumber, HandArray // types
}
