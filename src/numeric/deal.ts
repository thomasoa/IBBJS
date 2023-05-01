// Common numeric deal logic and types
import { multinomial} from "./choose.js"

type SeatNumber = number;
type CardNumber = number;
type PageNumber = bigint;
type HandArray =  readonly CardNumber[]

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
    readonly seats:number;
    readonly cards:number;
    readonly pages:bigint;

    constructor(cardsPerSeat:number[]) {
        this.perSeat = Array.from(cardsPerSeat)
        this.seats = cardsPerSeat.length
        this.cards = cardsPerSeat.reduce(
            (total:number, nextVal:number) => total + nextVal
        )
        this.pages = multinomial(cardsPerSeat);
    }

    get lastPage(): PageNumber {
        return this.pages-BigInt(1)
    }

    validSeat(seatNum:SeatNumber):boolean {
        return seatNum>=0 && seatNum<this.seats
    }

    validHands(hands:readonly HandArray[]):boolean {
        return (hands.length == this.seats) && 
            this.perSeat.every((len,seatNum)=> len == hands[seatNum].length)
    }

    assertValidPageNo(pageNo:PageNumber):void {
        if (pageNo>=this.pages || pageNo<BigInt(0)) {
            throw new Error("Invalid page " + pageNo + " outside range <="+this.pages.toString())
        }
    }

    equals(otherSig:DealSignature):boolean {
        if (this===otherSig) {
            return true
        }

        if (this.seats != otherSig.seats) {
            return false
        }
        return this.perSeat.every((value,index)=> value == otherSig.perSeat[index])
    }

}

/**
 * A standard bridge signature - four seats, each seat getting 13 cards
 */
const bridgeSignature = new DealSignature([13,13,13,13])

function buildHands(signature:DealSignature, toWhom: SeatNumber[]):readonly HandArray[] {
    var hands = signature.perSeat.map((cards,seat) => new Array<number>(0))
    toWhom.forEach((seat,card) => {
        if (signature.validSeat(seat)) {
            hands[seat].push(card)
        } else {
            throw Error(
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

    constructor(sig:DealSignature,toWhom:number[]) {
        if (toWhom.length != sig.cards) {
            throw Error('Wrong number of cards in deal. Expected' + sig.cards + ', got ' + toWhom.length)
        }
        this.signature = sig
        this.toWhom = Array.from(toWhom)
        this.hands = buildHands(sig,toWhom)
        this.validateSignature()

    }

    validateSignature():void {
        if (!this.signature.validHands(this.hands)) {
            throw new Error('Invalid deal signature')
        }
        
    }
}

/**
 * A BookStrategy is a way of converting deals into indexes.
 * 
 * The 'page numbers' start from zero and end at the number of
 * pages minus 1, as computed by the DealSignature.
 */
interface BookStrategy {
    readonly signature: DealSignature;
    readonly pages:PageNumber;
    readonly lastPage:PageNumber;
    computePageContent(pageNo:PageNumber):NumericDeal;
    computePageNumber(deal:NumericDeal):PageNumber;
}

export {
    DealSignature, NumericDeal, //classes
    bridgeSignature, // constant
    BookStrategy, CardNumber, SeatNumber, PageNumber, HandArray // types
}