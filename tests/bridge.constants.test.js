import { Seats, Deck } from "../dest/bridge/constants.js"

test("Ensure the sizes are right", () => {
    expect(Seats.all.length).toBe(4)
    expect(Deck.suits.all.length).toBe(4)
    expect(Deck.ranks.all.length).toBe(13)
    expect(Deck.cards.length).toBe(52)
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
    var spadeThree = Deck.cardByName.get('S3')
    expect(spadeThree.suit).toBe(Deck.suits.spades)
    expect(spadeThree.rank).toBe(Deck.ranks.three)
})