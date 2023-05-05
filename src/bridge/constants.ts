/**
 * A set of constant describing things related to bridge deals.
 * 
 * Types: Seat, Rank, Suit, 
 * Class: Card
 * Global: Deck, Seats
 * 
 *     Deck.suits.spades:Suit
 *        ...
 *     Deck.suit.clubs:Suit
 * 
 *     Deck.suits.all:Suit[] - All of the suits
 * 
 *     Deck.ranks.ace, Deck.ranks.king, ... Deck.ranks.two
 *     Deck.ranks.all:Rank[]
 * 
 *     Deck.cards: Card[] - All 52 different card values
 * 
 *     Deck.card(suit:Suit, rank:Rank):Card - returns the card
 * 
 *     Deck.cardByName(name:string):Card - Expects suit first, then rank: 'ST' or 'd10' 
 * 
 */

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
    bit: number,
    letter: string
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

function qr(s:string, o:number ,letter:string|undefined=undefined): Rank { 
    return {
        brief:s, 
        order:o, 
        bit: 1<<(12-o), 
        letter: letter || s
    }
}

const Ace = qr('A',0)
const King = qr('K',1)
const Queen = qr('Q',2)
const Jack = qr('J',3)
const Ten = qr('10',4,'T')
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

interface RankLookupResult {
    rank:Rank,
    rest:string
}

class RankParser { 
    letter:  string
    full: string
    rank:Rank 
    constructor(text:string, rank:Rank) {
        this.letter = text.slice(0,1)
        this.full = text
        this.rank = rank
    }

    get length() { return this.full.length }

    apply(text:string):RankLookupResult {
        if (text.slice(0,this.length) == this.full) {
            return { rank: this.rank, rest: text.slice(this.length) }
        }
    }
}

function createRankParser(): (text:string) => RankLookupResult {
    const map = new Map<string,RankParser>()

    const add = (parser:RankParser):void => { 
        map.set(parser.letter,parser)
    }

    Ranks.all.forEach((rank) => {
        add(new RankParser(rank.letter,rank))
        if (rank.brief != rank.letter) {
            add(new RankParser(rank.brief,rank))
        }
    })
    
    return function (text:string): RankLookupResult {
        const parser = map.get(text.slice(0,1))
        if (parser) {
            return parser.apply(text)
        }
        throw new Error('Invalid rank ' + text)
    }
}

const rankParser = createRankParser()

function rankByText(text:string):Rank {
    text = text.toUpperCase()
    const result = rankParser(text)
    if (result.rest != "") {
        throw new Error('Invalid rank: ' + text)
    }
    return result.rank
}

function  ranksByText(text:string) {
    const ranks = new Array<Rank>()
    if (text=='-') {
        return ranks
    }
    let lastOrder = -1
    let rest = text
    while (rest != '') {
        const result = rankParser(rest)
        if (result.rank.order<= lastOrder) {
            throw new Error('Invalid rank order in ' + text)
        }
        ranks.push(result.rank)
        rest = result.rest.trimStart()
        lastOrder = result.rank.order
    }
    return ranks

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

function cardBySuitRank(suit: Suit, rank:Rank) {
    return Cards[suit.order*13+rank.order]
}

function lookupCardByName (name:string):Card {
    name = name.toUpperCase()
    const card: Card|undefined = CardsByName.get(name)
    if (card) { return card }
    throw Error('Invalid card name '+ name)
}

const Deck = {
    ranks: Ranks,
    suits: Suits,
    cards: Cards,
    cardByName: lookupCardByName,
    cardsByName: (names:string[]):Card[] => {
        return names.map(lookupCardByName)
    },
    rankByText: rankByText,
    ranksByText: ranksByText,
    card: cardBySuitRank
}

export { /* Suits, Ranks, Cards, */ Suit, CardsByName, Seats, Rank, Card, Seat, Deck}