interface Seat {
    name:string;
    letter:string
}

const North = { name:"north",letter:"N"}
const East = { name:"east",letter:"E"}
const South = {name:"south", letter:"S"}
const West = {name:"west", letter:"W"}
const Seats = {
    north: North,
    east: East,
    south: South,
    west: West,
    all: new Array<Seat>(North,East,South,West)
}
type Rank = string
interface Suit {
    name:string;
    letter:string;
    symbol:string;
}

const Spades: Suit = {name:'spades',letter:'S', symbol:'S'}
const Hearts: Suit = {name:'hearts',letter:'H', symbol:'H'}
const Diamonds: Suit = {name:'diamonds',letter:'DD', symbol:'D'}
const Clubs: Suit = {name:'clubs',letter:'C', symbol:'C'}

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
    constructor(suit:Suit,rank:Rank) {
        this.suit = suit
        this.rank = rank
        this.short = suit.letter+rank
    }
}

const Ranks = ['A','K','Q','J','10','9','8','7','6','5','4','3','2']

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

export { Suits, Ranks, Cards, Seats}