import * as C from "./constants.js"
//import * as numeric from "../numeric/deal.js"

//type CardMap = (card:numeric.CardNumber) => C.Card
//type SeatMap = (seat:numeric.SeatNumber) => C.Seat

class Holding {
    readonly ranks: Array<C.Rank>
    readonly bits:number
    constructor(ranks:Array<C.Rank>) {
        this.ranks = ranks
        this.bits = ranks.reduce(
            (binary,rank) => rank.bit|binary,
            0
            )
        }
        
        get length() { return this.ranks.length }
        
        asString(divider:string):string {
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
        
        has(rank:C.Rank):boolean {
            return (this.bits & rank.bit) != 0
        }
        
        
    }
    
    class Hand {
        cards: Array<C.Card>
        holdings: Array<Holding>
        constructor(cards:Array<C.Card>) {
            this.cards = cards
            const suits = C.Suits.all.map(() => new Array<C.Rank>())
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
    
    function buildHands(toWhom:Array<C.Seat>):Array<Hand> {
        const cards: Array<Array<C.Card>> = Array.from({length:4},()=> new Array<C.Card>(0))
        toWhom.forEach((seat:C.Seat,cardNum:number)=>{
            cards[seat.order].push(C.Cards[cardNum])
        })
        return cards.map((handCards)=> new Hand(handCards))
    }
    
    class Deal {
        
        toWhom: Array<C.Seat>;
        hands: Array<Hand>;
        constructor(toWhom:Array<C.Seat>) {
            this.toWhom = toWhom
            this.hands = buildHands(toWhom)
        }

        hand(seat:C.Seat):Hand {
            return this.hands[seat.order]
        }
        
        get north():Hand {   return this.hand(C.Seats.north) }
        get east():Hand {   return this.hand(C.Seats.east) }
        get south():Hand {   return this.hand(C.Seats.south) }
        get west():Hand {   return this.hand(C.Seats.west) }
        
        eachHand(method: (seat:C.Seat,hand:Hand)=> void):void {
            //var hands=this.hands;
            //C.Seats.all.forEach((seat)=> method(seat,hands[seat.order]))
            this.hands.forEach((hand,index) => method(C.Seats.all[index],hand))           
        }

        eachCard(method: (card:C.Card,seat:C.Seat) => void ):void {
            this.toWhom.forEach((seat:C.Seat, index:number) => method(C.Cards[index],seat))
        }
    }
    
    export {Holding, Hand, Deal}