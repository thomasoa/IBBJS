import {Deck, Seats, Seat, Card, Rank, Suit} from "../basics/src/bridge/constants"

class Holding {
    readonly ranks: Array<Rank>
    readonly bits:number
    constructor(ranks:Array<Rank>) {
        this.bits = ranks.reduce(
            (binary,rank) => rank.bit|binary,
            0
        )
        this.ranks = Deck.ranks.fromBits(this.bits)
    }
        
    get length() { return this.ranks.length }
        
    asString(divider:string=''):string {
        if (this.length == 0) {
            return '-'
        }
            
        return this.ranks.map((rank)=> rank.brief).join(divider)
    }
        
    isVoid():boolean {
            return this.length == 0
    }
        
    toString():string {
            return this.asString(' ')
    }
        
    has(rank:Rank):boolean {
        return (this.bits & rank.bit) != 0
    }

    static forString(text:string):Holding {
        return new Holding(Deck.ranks.parse(text.toUpperCase()))
    }

    static fromBits(bits:number):Holding {
        return new Holding(Deck.ranks.fromBits(bits))
    }
        
 }
    
class Hand {
    cards: Array<Card>
    holdings: Array<Holding>
    constructor(cards:Card[]) {
        this.cards = cards
        const suits = Deck.suits.map(() => new Array< Rank>())
        this.cards.forEach((card)=> {
            suits[card.suit.order].push(card.rank)
        })
        this.holdings = suits.map((ranks)=> new Holding(ranks))
    }
        
    suit(suit:Suit): Holding {
        return this.holdings[suit.order]
    }
    
    get spades():Holding {return this.suit(Deck.suits.spades)}
    get hearts():Holding {return this.suit(Deck.suits.hearts)}
    get diamonds():Holding {return this.suit(Deck.suits.diamonds)}
    get clubs():Holding {return this.suit(Deck.suits.clubs)}
        
    has(card:Card):boolean {
        return this.suit(card.suit).has(card.rank)
    }
        
    toString():string {
        return this.holdings.map((h)=> h.asString('')).join(' ')
    }
        
    eachSuit(method: (suit:Suit,holding:Holding) => void):void {
        this.holdings.forEach((holding,index) => method(Deck.suits.all[index],holding))
    }
        
    static forHoldings(holdings: Holding[]):Hand {
        if (holdings.length !=4) {
            throw new Error('Should be exactly four holdings')
        }
        const cards = new Array<Card>()
        holdings.forEach((h,suitNum) => {
            const suit = Deck.suits.all[suitNum]
            h.ranks.forEach( (rank) => {
                cards.push(Deck.card(suit,rank))
            })
        })
        return new Hand(cards)
    }
        
        
    static forString(handString:string):Hand {
        handString = handString.toUpperCase()
        const match = handString.match(
            /^ *S:?([^SHDC]*)H:?([^SHDC]*)D:?([^SHDC]*)C:?([^SHDC]*)$/
        )
        if (match) {
            const holdings = [match[1],match[2],match[3],match[4]].map((s) => Holding.forString(s.trim()))
            return Hand.forHoldings(holdings)
        }
        throw Error('Invalid hand string: ' + handString)
    }
}
        
function buildHands(toWhom:Seat[]):Hand[] {
    const cards: Array<Array<Card>> = Array.from({length:4},()=> new Array<Card>(0))
    toWhom.forEach((seat:Seat,cardNum:number)=>{
        cards[seat.order].push(Deck.cards.all[cardNum])
    })
    return cards.map((handCards)=> new Hand(handCards))
}
        
class Deal {
            
    toWhom: Array<Seat>;
    hands: Array<Hand>;
    constructor(toWhom:Seat[]) {
        this.toWhom = toWhom
        this.hands = buildHands(toWhom)
    }
            
    hand(seat:Seat):Hand {
        return this.hands[seat.order]
    }
            
    get north():Hand {   return this.hand(Seats.north) }
    get east():Hand {   return this.hand(Seats.east) }
    get south():Hand {   return this.hand(Seats.south) }
    get west():Hand {   return this.hand(Seats.west) }
            
    eachHand(method: (seat:Seat,hand:Hand)=> void):void {
        this.hands.forEach((hand,index) => method(Seats.all[index],hand))           
    }
            
    eachCard(method: (card:Card,seat:Seat) => void ):void {
        this.toWhom.forEach((seat:Seat, index:number) => method(Deck.cards.all[index],seat))
    }
            
    equals(other:Deal):boolean {
        return (this.toWhom.length == other.toWhom.length) && 
        this.toWhom.every((seat,index) => seat == other.toWhom[index])
    }        
}
        
export {Holding, Hand, Deal}
