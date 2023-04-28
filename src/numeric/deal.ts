// Common numeric deal logic and types
import { multinomial} from "./choose.js"

type SeatNumber = number;
type CardNumber = number;
type PageNumber = bigint;
type HandArray = CardNumber[]

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
        this.perSeat = [...cardsPerSeat]
        this.seats = cardsPerSeat.length
        this.cards = cardsPerSeat.reduce(
            (total:number, nextVal:number) => total + nextVal
        )
        this.pages = multinomial(cardsPerSeat);
    }

    get lastPage(): PageNumber {
        return this.pages-BigInt(1)
    }

    assertValidPageNo(pageNo:PageNumber):void {
        if (pageNo>=this.pages || pageNo<BigInt(0)) {
            throw new Error("Invalid page " + pageNo + " outside range <="+this.pages.toString())
        }
    }
}

const defaultSignature = new DealSignature([13,13,13,13])

function signature_or_default(sig:DealSignature|undefined):DealSignature {
    if (sig == undefined) {
        return defaultSignature
    }
    return sig
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
        this.toWhom = [...toWhom]
        // Split deal into hands
        this.hands = this.signature.perSeat.map((cards,seat) => Array<number>(0))
        this.toWhom.forEach((seat,card) => {
            if (seat>= sig.seats || seat< 0) {
                throw Error(
                    'Invalid seat ' + seat + ' for deal in with ' + sig.seats + ' seats'
                )
            }
            this.hands[seat].push(card)
        })

        sig.perSeat.forEach((cards:number,seat:SeatNumber) => {
             if (cards != this.hands[seat].length) {
                throw Error(
                    'Wrong number of cards for seat ' + seat + ' expected ' + cards + ' cards'
                )
             }
        })

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
    signature_or_default, // function
    BookStrategy, CardNumber, SeatNumber, PageNumber, HandArray // types
}