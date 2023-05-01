import * as C from "./constants.js"
import {BookStrategy, PageNumber, SeatNumber,  CardNumber, DealSignature} from "../numeric/index.js"
import {Hand, Deal} from "./deal.js"

type CardMap = (card:CardNumber) => C.Card
type SeatMap = (seat:SeatNumber) => C.Seat
const defaultCardMap:CardMap = (card:CardNumber) => C.Cards[card]
const defaultSeatMap:SeatMap = (seat:SeatNumber) => C.Seats.all[seat]

function validate_signature(signature:DealSignature):void {
    var seats = signature.perSeat.length
    if (seats != 4) {
        throw new Error("Deal strategy signature should be [13,13,13,13], but has " + seats + " seats")
    }
    for (var seatLength of signature.perSeat) {
        if (seatLength != 13) {
            throw new Error("Signature must be [13,13,13,13] but got a seat length of " + seatLength)
        }
    }
    
}
class BridgeBook {
    readonly strategy:BookStrategy
    readonly seatMap:SeatMap
    readonly cardMap:CardMap
    constructor(
        strategy: BookStrategy,
        seatMap:SeatMap|undefined,
        cardMap:CardMap|undefined
    ) {
        
        validate_signature(strategy.signature)
        this.strategy = strategy
        seatMap = seatMap || defaultSeatMap
        cardMap = cardMap || defaultCardMap
        this.seatMap = seatMap
        this.cardMap = cardMap
    }

    get pages() { return this.strategy.pages}
    get lastPage() { return this.strategy.pages}
    getDeal(pageNo:PageNumber):Deal {
        if (pageNo<BigInt(1) || pageNo>this.lastPage) {
            throw Error('Invalid page number ' + pageNo + ', must be between 1 and ' + this.lastPage)
        }
        var numDeal = this.strategy.computePageContent(pageNo-BigInt(1))
        var seatMap = this.seatMap
        var cardMap = this.cardMap
        var toWhom : Array<C.Seat> = new Array<C.Seat>(C.Cards.length)

        numDeal.toWhom.forEach((seatNum,cardNum)=> {
             var seat = seatMap(seatNum)
             var card = cardMap(cardNum)
             toWhom[card.order] = seat
        })

        return new Deal(toWhom)
    }
}

export {BridgeBook, SeatMap, CardMap, validate_signature}