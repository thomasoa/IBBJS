import { Seats, Deck } from "../dest/bridge/constants.js"

test("Ensure the sizes are right", () => {
    expect(Seats.all.length).toBe(4)
    expect(Deck.suits.all.length).toBe(4)
    expect(Deck.ranks.all.length).toBe(13)
    expect(Deck.cards.length).toBe(52)
})

test('cardByName when card does not exist', () => {
    expect(() => Deck.cardByName('NA')).toThrow()
})

test("Ensure seat orders are in agreement", () => {
    Seats.all.forEach((seat, index) => {
        expect(seat.order).toBe(index)
    })
})

test("Ensure suit orders are in agreement", () => {
    Deck.suits.all.forEach((suit, index) => {
        expect(suit.order).toBe(index)
    })
})

test("Ensure rank orders agree with the linear order", () => {
    expect(Deck.ranks.all[0]).toBe(Deck.ranks.ace)
    Deck.ranks.all.forEach((rank, index) => {
        expect(rank.order).toBe(index)
    })
})

test("Ensure card orders agree with the linear order", () => {
    Deck.cards.forEach((card, index) => {
        expect(card.order).toBe(index)
    })

})

test("CardsByName lookup", () => {
    var spadeThree = Deck.cardByName('S3')
    expect(spadeThree.suit).toBe(Deck.suits.spades)
    expect(spadeThree.rank).toBe(Deck.ranks.three)
})

test('rankByText examples',() => {
    expect(Deck.rankByText('A')).toBe(Deck.ranks.ace)
    expect(Deck.rankByText('K')).toBe(Deck.ranks.king)
    expect(Deck.rankByText('Q')).toBe(Deck.ranks.queen)
    expect(Deck.rankByText('J')).toBe(Deck.ranks.jack)
    expect(Deck.rankByText('T')).toBe(Deck.ranks.ten)
    expect(Deck.rankByText('10')).toBe(Deck.ranks.ten)
    expect(Deck.rankByText('9')).toBe(Deck.ranks.nine)
    expect(Deck.rankByText('8')).toBe(Deck.ranks.eight)
    expect(Deck.rankByText('7')).toBe(Deck.ranks.seven)
    expect(Deck.rankByText('6')).toBe(Deck.ranks.six)
    expect(Deck.rankByText('5')).toBe(Deck.ranks.five)
    expect(Deck.rankByText('4')).toBe(Deck.ranks.four)
    expect(Deck.rankByText('3')).toBe(Deck.ranks.three)
    expect(Deck.rankByText('2')).toBe(Deck.ranks.two)

    expect(() => Deck.rankByText('X')).toThrow()
    expect(() => Deck.rankByText('1')).toThrow()
    expect(() => Deck.rankByText('A ')).toThrow()
    expect(() => Deck.rankByText(' A')).toThrow()


})

test('ranksByText examples', () => {
    const ranks = Deck.ranks
    expect(Deck.ranksByText('AJT2')).toEqual([ranks.ace,ranks.jack, ranks.ten, ranks.two])
    expect(Deck.ranksByText('A J  10 2 ')).toEqual([ranks.ace,ranks.jack, ranks.ten, ranks.two])
    expect(Deck.ranksByText('')).toEqual([])
    expect(Deck.ranksByText('-')).toEqual([])

    expect(() => Deck.ranksByText('AA')).toThrow()
    expect(() => Deck.ranksByText('KA')).toThrow()
    expect(() => Deck.ranksByText('AKQJFred')).toThrow()
    expect(() => Deck.ranksByText('T10')).toThrow()
    expect(() => Deck.ranksByText('AJ12')).toThrow()
    expect(() => Deck.ranksByText('AJ 1 02')).toThrow()
    expect(() => Deck.ranksByText('--')).toThrow()

})

test('Deck.card() method',() => {
    const ranks = Deck.ranks
    const suits = Deck.suits
    expect(Deck.card(suits.clubs,ranks.ten).short).toBe('C10')
    expect(Deck.card(suits.spades,ranks.two).short).toBe('S2')
})