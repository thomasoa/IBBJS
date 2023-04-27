import * as C from "./constants.js"
import * as numeric from "../numeric/deal.js"
import {BookStrategy} from "../numeric/book.js"

type CardMap = (card:numeric.CardNumber) => C.Card
type SeatMap = (seat:numeric.SeatNumber) => C.Seat

const defaultCardMap:CardMap = (card:numeric.CardNumber) => C.Cards[card]
const defaultSeatMap:SeatMap = (seat:numeric.SeatNumber) => C.Seats.all[seat]

class Holding {
    readonly ranks: Array<C.Rank>
    readonly length: number
    readonly bits:number
    constructor(ranks:Array<C.Rank>) {
        this.ranks = ranks
        this.length = ranks.length
        this.bits = ranks.reduce(
            (binary,rank) => rank.bit|binary,
            0
        )
    }

    asString(divider:string):string {
        if (this.length == 0) {
            return '-'
        }

        return this.ranks.map((rank)=> rank.brief).join(divider)
    }

    toString():string {
        return this.asString(' ')
    }

    has(rank:C.Rank):boolean {
        return (this.bits & rank.bit) != 0
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
    suit(suit:C.Suit): Holding {
        return this.holdings[suit.order]
    }
    spades():Holding {return this.suit(C.Suits.spades)}
    hearts():Holding {return this.suit(C.Suits.hearts)}
    diamonds():Holding {return this.suit(C.Suits.diamonds)}
    clubs():Holding {return this.suit(C.Suits.clubs)}

    has(card:C.Card):boolean {
        return this.suit(card.suit).has(card.rank)
    }
}

class Deal {
    toWhom: Array<C.Seat>;
    hands: Array<Hand>;
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

export { Holding, Hand, Deal, BridgeBook}