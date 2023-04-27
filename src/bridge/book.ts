import * as C from "./constants.js"
import * as numeric from "../numeric/deal.js"
import {BookStrategy} from "../numeric/book.js"
import {Hand, Deal} from "./deal.js"

type CardMap = (card:numeric.CardNumber) => C.Card
type SeatMap = (seat:numeric.SeatNumber) => C.Seat
const defaultCardMap:CardMap = (card:numeric.CardNumber) => C.Cards[card]
const defaultSeatMap:SeatMap = (seat:numeric.SeatNumber) => C.Seats.all[seat]

class BridgeBook {
    readonly strategy:BookStrategy
    readonly seatMap:SeatMap
    readonly cardMap:CardMap
    constructor(
        strategy: BookStrategy, 
        seatMap:SeatMap|undefined,
        cardMap:CardMap|undefined
    ) {
        this.strategy = strategy
        if (seatMap == undefined) {
            seatMap = defaultSeatMap
        }
        if (cardMap == undefined) {
            cardMap = defaultCardMap
        }
        this.seatMap = seatMap
        this.cardMap = cardMap
    }

    getDeal(pageNo:numeric.PageNumber):Deal|void {
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

export {BridgeBook}