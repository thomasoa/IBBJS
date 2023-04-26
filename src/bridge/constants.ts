type Seat = {
    name:string;
    letter:string;
    order:number
}

const North = { name:"north",letter:"N", order:0}
const East = { name:"east",letter:"E", order:1}
const South = {name:"south", letter:"S", order:2}
const West = {name:"west", letter:"W", order:3}
const Seats = {
    north: North,
    east: East,
    south: South,
    west: West,
    all: new Array<Seat>(North,East,South,West)
}
type Rank = {
    brief: string,
    order: number
}

type Suit = {
    name:string;
    letter:string;
    symbol:string;
    order:number
}

const Spades: Suit = {name:'spades',letter:'S', symbol:'S', order:0}
const Hearts: Suit = {name:'hearts',letter:'H', symbol:'H', order:1}
const Diamonds: Suit = {name:'diamonds',letter:'DD', symbol:'D', order:2}
const Clubs: Suit = {name:'clubs',letter:'C', symbol:'C',order:3}

const Suits = {
    spades: Spades,
    hearts: Hearts,
    diamonds: Diamonds,
    clubs: Clubs,
    all: new Array<Suit>(Spades,Hearts,Diamonds,Clubs)
}

class Card {
    suit: Suit;
    rank: Rank;
    short: string;
    order: number;
    constructor(suit:Suit,rank:Rank) {
        this.suit = suit
        this.rank = rank
        this.short = suit.letter+rank.brief
        this.order = rank.order + 13*suit.order
    }
}

const Ranks :Array<Rank> = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'].map(
    (brief:string,order:number):Rank => {
        return {brief:brief, order: order}
    }
)

function make_cards():Array<Card> {
    var cards = new Array<Card>(52)
    for (var cardNum=0; cardNum<52; cardNum++) {
        var suit = Suits.all[Math.floor(cardNum/13)]
        var rank = Ranks[cardNum % 13]
        cards[cardNum] = new Card(suit,rank)
    }
    return cards
}
const Cards = make_cards()

export { Suits, Ranks, Cards, Seats, Suit, Rank, Card, Seat}