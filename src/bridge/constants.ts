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

function f<T>(obj:T): T {
    Object.freeze(obj)
    return obj
}


type Seat = {
    name:string;
    letter:string;
    order:number
}

const North = { name:"north",letter:"N", order:0}
const East = { name:"east",letter:"E", order:1}
const South = {name:"south", letter:"S", order:2}
const West = {name:"west", letter:"W", order:3}
const AllSeats: readonly Seat[] = [North, East, South, West]
AllSeats.forEach(Object.freeze)
Object.freeze(AllSeats)

const Seats = {
    north: North,
    east: East,
    south: South,
    west: West,
    all:  AllSeats,
    each: AllSeats.forEach.bind(AllSeats),
    map: AllSeats.map.bind(AllSeats)

}
Object.freeze(Seats)

type Rank = {
    brief: string,
    order: number,
    bit: number,
    letter: string,
    summand: number
}

type Suit = {
    name:string;
    letter:string;
    symbol:string;
    order:number,
    summand: number
}

const Spades:  Suit = f({name:'spades',letter:'S', symbol:'\U+2660', order:0, summand: 0})
const Hearts:  Suit = f({name:'hearts',letter:'H', symbol:'\U+2665', order:1, summand:13*1})
const Diamonds:  Suit = f({name:'diamonds',letter:'D', symbol:'\U+2666', order:2, summand:13*2})
const Clubs:  Suit = f({name:'clubs',letter:'C', symbol:'\U+2663',order:3, summand:13*3})
const AllSuits: readonly Suit[] = [Spades,Hearts,Diamonds,Clubs]
Object.freeze(AllSuits)

const Suits = {
    spades: Spades,
    hearts: Hearts,
    diamonds: Diamonds,
    clubs: Clubs,
    all:  AllSuits as readonly Suit[],
    each: AllSuits.forEach.bind(AllSuits),
    map: AllSuits.map.bind(AllSuits)
}
Suits.each(Object.freeze)
Object.freeze(Suits)

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
        Object.freeze(this)
    }
}

function qr(s:string, o:number ,letter:string|undefined=undefined): Rank { 
    return f({
        brief:s, 
        order:o, 
        bit: 1<<(12-o), 
        letter: letter || s,
        summand: o
    })
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
const AllRanks: readonly Rank[] = f([Ace,King, Queen,Jack,Ten,Nine,Eight,Seven,Six,Five,Four,Three,Two])

const Ranks = f({
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
    all: AllRanks,
    each: AllRanks.forEach.bind(AllRanks),
    map: AllRanks.map.bind(AllRanks)
})

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


function make_cards():Card[] {
    const cards = new Array<Card>(52)
    Ranks.each((rank) => {
        Suits.each((suit) => {
            const index = suit.summand+rank.summand
            cards[index] = f(new Card(suit,rank))
        })
    })
    return f(cards)
}

const AllCards: readonly Card[]= make_cards()
const CardsByName = new Map<string,Card>(AllCards.map((card)=>[card.short,card]))

function cardBySuitRank(suit: Suit, rank:Rank) {
    return AllCards[suit.summand+rank.summand]
}

function lookupCardByName (name:string):Card {
    name = name.toUpperCase()
    const card: Card|undefined = CardsByName.get(name)
    if (card) { return card }
    throw Error('Invalid card name '+ name)
}

const Cards = {
    all: AllCards,
    each: AllCards.forEach.bind(AllCards),
    map: AllCards.map.bind(AllCards)
}


const Deck = {
    ranks: Ranks,
    suits: Suits,
    cards: Cards,
    cardByName: lookupCardByName,
    cardsByNames: (names:string[]):Card[] => {
        return names.map(lookupCardByName)
    },
    rankByText: rankByText,
    ranksByText: ranksByText,
    card: cardBySuitRank
}
Object.freeze(Deck)

export { 
    Deck, Seats, /* constants */
    Suit, Rank, Card, Seat /* types */
}