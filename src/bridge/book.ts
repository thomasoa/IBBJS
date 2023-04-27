import * as C from "./constants.js"
import {PageNumber, SeatNumber,  CardNumber} from "../numeric/deal.js"
import {BookStrategy} from "../numeric/book.js"
import {Hand, Deal} from "./deal.js"

type CardMap = (card:CardNumber) => C.Card
type SeatMap = (seat:SeatNumber) => C.Seat
const defaultCardMap:CardMap = (card:CardNumber) => C.Cards[card]
const defaultSeatMap:SeatMap = (seat:SeatNumber) => C.Seats.all[seat]

class BridgeBook {
    readonly strategy:BookStrategy
    readonly seatMap:SeatMap
    readonly cardMap:CardMap
    readonly pages:PageNumber
    readonly lastPage:PageNumber
    constructor(
        strategy: BookStrategy,
        seatMap:SeatMap|undefined,
        cardMap:CardMap|undefined
    ) {
        this.strategy = strategy
        this.pages = strategy.signature.pages
        this.lastPage = strategy.signature.lastPage
        if (seatMap == undefined) {
            seatMap = defaultSeatMap
        }
        if (cardMap == undefined) {
            cardMap = defaultCardMap
        }
        this.seatMap = seatMap
        this.cardMap = cardMap
    }

    getDeal(pageNo:PageNumber):Deal|void {
        var numDeal = this.strategy.computePageContent(pageNo)
        var seatMap = this.seatMap
        var cardMap = this.cardMap
        var toWhom : Array<C.Seat> = new Array<C.Seat>(C.Cards.length)
        var cardsInHands: Array<Array<C.Card>> = C.Suits.all.map(
           () => new Array<C.Card>() 
        )

        numDeal.toWhom.forEach((seatNum,cardNum)=> {
             var seat = seatMap(seatNum)
             var card = cardMap(cardNum)
             toWhom[card.order] = seat
             cardsInHands[seat.order].push(card)
        })

        var hands: Array<Hand> = cardsInHands.map((cards) => new Hand(cards))
        return new Deal(toWhom,hands)
    }
}

export {BridgeBook, SeatMap, CardMap}