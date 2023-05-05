import {Deck, Seats, Seat, Card, Rank, Suit} from "./constants.js"

class Holding {
    readonly ranks: Array<Rank>
    readonly bits:number
    constructor(ranks:Array<Rank>) {
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
        
        has(rank:Rank):boolean {
            return (this.bits & rank.bit) != 0
        }
        
        
    }
    
    class Hand {
        cards: Array<Card>
        holdings: Array<Holding>
        constructor(cards:Array<Card>) {
            this.cards = cards
            const suits = Deck.suits.all.map(() => new Array< Rank>())
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
    }
    
    function buildHands(toWhom:Array<Seat>):Array<Hand> {
        const cards: Array<Array<Card>> = Array.from({length:4},()=> new Array<Card>(0))
        toWhom.forEach((seat:Seat,cardNum:number)=>{
            cards[seat.order].push(Deck.cards[cardNum])
        })
        return cards.map((handCards)=> new Hand(handCards))
    }
    
    class Deal {
        
        toWhom: Array<Seat>;
        hands: Array<Hand>;
        constructor(toWhom:Array<Seat>) {
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
            //var hands=this.hands;
            //Seats.all.forEach((seat)=> method(seat,hands[seat.order]))
            this.hands.forEach((hand,index) => method(Seats.all[index],hand))           
        }

        eachCard(method: (card:Card,seat:Seat) => void ):void {
            this.toWhom.forEach((seat:Seat, index:number) => method(Deck.cards[index],seat))
        }

        equals(other:Deal):boolean {
            return (this.toWhom.length == other.toWhom.length) && 
                this.toWhom.every((seat,index) => seat == other.toWhom[index])
        }
    }
    
    export {Holding, Hand, Deal}