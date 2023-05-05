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
    order: number,
    bit: number
}

type Suit = {
    name:string;
    letter:string;
    symbol:string;
    order:number
}

const Spades: Suit = {name:'spades',letter:'S', symbol:'\U+2660', order:0}
const Hearts: Suit = {name:'hearts',letter:'H', symbol:'\U+2665', order:1}
const Diamonds: Suit = {name:'diamonds',letter:'D', symbol:'\U+2666', order:2}
const Clubs: Suit = {name:'clubs',letter:'C', symbol:'\U+2663',order:3}

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

function qr(s,o):Rank { return {brief:s, order:o, bit: 1<<(12-o)} }

const Ace = qr('A',0)
const King = qr('K',1)
const Queen = qr('Q',2)
const Jack = qr('J',3)
const Ten = qr('10',4)
const Nine = qr('9',5)
const Eight = qr('8',6)
const Seven = qr('7',7)
const Six = qr('6',8)
const Five = qr('5',9)
const Four = qr('4',10)
const Three = qr('3',11)
const Two = qr('2',12)
const Ranks = {
    ace: Ace,
    king: King,
    queen: Queen,
    jack: Jack,
    ten: Ten,
    nine: Nine,
    eight: Eight,
    seven: Seven,
    six: Six,
    five: Five,
    four: Four,
    three: Three,
    two: Two,
    all: [Ace,King, Queen,Jack,Ten,Nine,Eight,Seven,Six,Five,Four,Three,Two]
}

function make_cards():Array<Card> {
    const cards = new Array<Card>(52)
    for (let cardNum=0; cardNum<52; cardNum++) {
        const suit = Suits.all[Math.floor(cardNum/13)]
        const rank = Ranks.all[cardNum % 13]
        cards[cardNum] = new Card(suit,rank)
    }
    return cards
}
const Cards = make_cards()
const CardsByName = new Map<string,Card>(Cards.map((card)=>[card.short,card]))

const Deck = {
    ranks: Ranks,
    suits: Suits,
    cards: Cards,
    cardByName: CardsByName
}

export { /* Suits, Ranks, Cards, */ Suit, CardsByName, Seats, Rank, Card, Seat, Deck}