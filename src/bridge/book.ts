import * as C from "./constants.js"
import {BookStrategy, PageNumber, SeatNumber,  CardNumber, DealSignature, bridgeSignature} from "../numeric/index.js"
import {Deal} from "./deal.js"

type CardMap = (card:CardNumber) => C.Card
type SeatMap = (seat:SeatNumber) => C.Seat
const defaultCardMap:CardMap = (card:CardNumber) => C.Cards[card]
const defaultSeatMap:SeatMap = (seat:SeatNumber) => C.Seats.all[seat]

function validate_signature(signature:DealSignature):void {
    if (!bridgeSignature.equals(signature)) {
        throw new TypeError('Invalid signature')
    }
}

class BridgeBook {
    readonly strategy:BookStrategy
    readonly seatMap:SeatMap
    readonly cardMap:CardMap
    constructor(
        strategy: BookStrategy,
        seatMap:SeatMap=defaultSeatMap,
        cardMap:CardMap=defaultCardMap
        ) {
            
            validate_signature(strategy.signature)
            this.strategy = strategy
            this.seatMap = seatMap
            this.cardMap = cardMap
        }
        
        get pages() { return this.strategy.pages}
        get lastPage() { return this.strategy.pages}
        
        validPageNumber(pageNo:PageNumber) {
            return pageNo>= BigInt(1) && pageNo<= this.lastPage
        }
        getDeal(pageNo:PageNumber):Deal {
            if (!this.validPageNumber(pageNo)) {
                throw RangeError('Invalid page number ' + pageNo + ', must be between 1 and ' + this.lastPage)
            }
            const numDeal = this.strategy.computePageContent(pageNo-BigInt(1))
            const seatMap = this.seatMap
            const cardMap = this.cardMap
            const toWhom : Array<C.Seat> = new Array<C.Seat>(C.Cards.length)
            
            numDeal.toWhom.forEach((seatNum,cardNum)=> {
                const seat = seatMap(seatNum)
                const card = cardMap(cardNum)
                toWhom[card.order] = seat
            })
            
            return new Deal(toWhom)
        }
    }
    
    export {BridgeBook, SeatMap, CardMap, validate_signature}
