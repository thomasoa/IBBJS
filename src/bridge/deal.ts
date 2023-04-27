import * as C from "./constants.js"
import * as numeric from "../numeric/deal.js"
import {BookStrategy} from "../numeric/book.js"

type CardMap = (card:numeric.CardNumber) => C.Card
type SeatMap = (seat:numeric.SeatNumber) => C.Seat

const defaultCardMap:CardMap = (card:numeric.CardNumber) => C.Cards[card]
const defaultSeatMap:SeatMap = (seat:numeric.SeatNumber) => C.Seats.all[seat]

class Holding {
    ranks: Array<C.Rank>
    length: number
    bits:number
    constructor(ranks:Array<C.Rank>) {
        this.ranks = ranks
        this.length = ranks.length
        this.bits = ranks.reduce(
            (binary,rank) => (1<< (12-rank.order))|binary,
            0
        )
    }

    toString():string {
        if (this.length == 0) {
            return '-'
        }
        return this.ranks.map((rank)=> rank.brief).join(' ')
    }


}

class Hand {
    cards: Array<C.Card>
    holdings: Array<Holding>
    constructor(cards:Array<C.Card>) {
        this.cards = cards
        var suits = C.Suits.all.map(() => new Array<C.Rank>())
        this.cards.forEach((card)=> {
            suits[card.suit.order].push(card.rank)
        })
        this.holdings = suits.map((ranks)=> new Holding(ranks))
    }
}

class Deal {
    toWhom: Array<C.Seat>;
    hands: Array<Hand>
    constructor(toWhom:Array<C.Seat>,hands:Array<Hand>) {
        this.toWhom = toWhom
        this,hands = hands
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

    }
}

export { Holding, Hand, Deal, BridgeBook}