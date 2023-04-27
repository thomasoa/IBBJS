import * as C from "./constants.js"
import * as numeric from "../numeric/deal.js"

type CardMap = (card:numeric.CardNumber) => C.Card
type SeatMap = (seat:numeric.SeatNumber) => C.Seat

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

export {Holding, Hand, Deal}