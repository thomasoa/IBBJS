// Common numeric deal logic and types
import { multinomial} from "./choose.js"

type SeatNumber = number;
type CardNumber = number;
type PageNumber = bigint;
type HandArray = CardNumber[]

class DealSignature {
    // An immutable definition ffor a class of deals
    // 
    // sig = new DealSignature[4,4,4,4]
    //
    // sig.perSet - an array telling how man cards each seat is suppose to get]
    // sig.seats  - the number of seats
    // sig.cards  - the total number of cards to be dealt
    // sig.pages  - The total number of distinct deals of this type
    //
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

    lastPage(): PageNumber {
        return this.pages-BigInt(1)
    }

    assertValidPageNo(pageNo:PageNumber):void {
        if (pageNo>=this.pages || pageNo<BigInt(0)) {
            throw new Error("Invalid page number pageNo outside range <="+this.pages.toString())
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


class NumericDeal {
    // A deal which matches a signature
    // 
    readonly signature: DealSignature;
    readonly toWhom: readonly SeatNumber[];
    readonly hands: readonly HandArray[];

    constructor(sig:DealSignature,toWhom:number[]) {
        this.signature = sig
        this.toWhom = [...toWhom]
        if (toWhom.length != sig.cards) {
            throw Error('Wrong number of cards in deal. Expected' + sig.cards + ', got ' + toWhom.length)
        }
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
interface BookStrategy {
    readonly signature: DealSignature;
    computePageContent(pageNo:PageNumber):number[];
    computePageNumber(deal:NumericDeal):PageNumber;
}

export {
    DealSignature, NumericDeal, signature_or_default, 
    BookStrategy, CardNumber, SeatNumber, PageNumber, HandArray 
}