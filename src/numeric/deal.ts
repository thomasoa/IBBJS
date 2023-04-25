import { multinomial} from "./choose.js"

type SeatNumber = number;
type CardNumber = number;
type PageNumber = bigint;

class DealSignature {
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

    lastPage(): bigint {
        return this.pages-BigInt(1)
    }

    assertValidPageNo(pageNo:bigint):void {
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
    signature: DealSignature;
    toWhom: number[];
    hands: number[][];

    constructor(sig:DealSignature,toWhom:number[]) {
        this.signature = sig
        this.toWhom = [...toWhom]
        if (toWhom.length != sig.cards) {
            throw Error('Wrong number of cards in deal. Expected' + sig.cards + ', got ' + toWhom.length)
        }
        this.hands = this.signature.perSeat.map((cards,seat) => Array<number>(0))
        this.toWhom.forEach((seat,card) => {
            if (seat>= sig.seats || seat< 0) {
                throw Error(
                    'Invalid seat ' + seat + ' for deal in with ' + sig.seats + ' seats'
                )
            }
            this.hands[seat].push(card)
        })

        sig.perSeat.forEach((cards,seat) => {
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
    computePageContent(pageNo:bigint):number[];
    computePageNumber(deal:number[]):bigint;
}

export {DealSignature, NumericDeal, signature_or_default, BookStrategy}