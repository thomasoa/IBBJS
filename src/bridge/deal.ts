import * as C from "./constants.js"
import * as numeric from "../numeric/deal.js"
import {BookStrategy} from "../numeric/book.js"

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
}