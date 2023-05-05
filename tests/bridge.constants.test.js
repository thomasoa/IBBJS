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

})

test('ranksByText examples', () => {
    const ranks = Deck.ranks
    expect(Deck.ranksByText('AJT2')).toEqual([ranks.ace,ranks.jack, ranks.ten, ranks.two])
    expect(Deck.ranksByText('')).toEqual([])
    expect(Deck.ranksByText('-')).toEqual([])

    expect(() => Deck.ranksByText('AA')).toThrow()
    expect(() => Deck.ranksByText('KA')).toThrow()
    expect(() => Deck.ranksByText('AKQJFred')).toThrow()
    expect(() => Deck.ranksByText('--')).toThrow()

})