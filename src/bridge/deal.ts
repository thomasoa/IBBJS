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
    get spades():Holding {return this.suit(C.Suits.spades)}
    get hearts():Holding {return this.suit(C.Suits.hearts)}
    get diamonds():Holding {return this.suit(C.Suits.diamonds)}
    get clubs():Holding {return this.suit(C.Suits.clubs)}

    has(card:C.Card):boolean {
        return this.suit(card.suit).has(card.rank)
    }

    toString():string {
        return this.holdings.map((h)=> h.asString('')).join(' ')
    }

    eachSuit(method: (suit:C.Suit,holding:Holding) => void):void {
        this.holdings.forEach((holding,index) => method(C.Suits.all[index],holding))
    }
}

class Deal {

    toWhom: Array<C.Seat>;
    hands: Array<Hand>;
    constructor(toWhom:Array<C.Seat>,hands:Array<Hand>) {
        this.toWhom = toWhom
        this.hands = hands
    }
    hand(seat:C.Seat):Hand {
        return this.hands[seat.order]
    }

    get north():Hand {   return this.hand(C.Seats.north) }
    get east():Hand {   return this.hand(C.Seats.east) }
    get south():Hand {   return this.hand(C.Seats.south) }
    get west():Hand {   return this.hand(C.Seats.west) }

    eachHand(method: (seat:C.Seat,hand:Hand)=> any):void {
        var _this=this;
        C.Seats.all.forEach((seat)=> method(seat,_this.hands[seat.order]))
    }
}

export {Holding, Hand, Deal}