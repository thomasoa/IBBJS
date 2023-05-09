import * as Books from "../src/bridge/book"
import {Deck, Seats } from "../src/basics/src/bridge/constants"
import { PavlicekDealStrategy, AndrewsDealStrategy, DealSignature } from "../src/numeric/index"

test("Book constructor", () => {
    const book = new Books.BridgeBook(new PavlicekDealStrategy())
    expect(book.pages.toString()).toEqual("53644737765488792839237440000")
    expect(book.lastPage.toString()).toEqual("53644737765488792839237440000")
})

test("Bijection Seat", () => {
    const bijection = new Books.SimpleBijection(Seats.all, (n) => (n + 2) % 4)
    expect(bijection.mapTo(0)).toBe(Seats.south)
    expect(bijection.mapTo(1)).toBe(Seats.west)
    expect(bijection.mapTo(2)).toBe(Seats.north)
    expect(bijection.mapTo(3)).toBe(Seats.east)
    expect(bijection.mapFrom(Seats.south)).toBe(0)
    expect(bijection.mapFrom(Seats.west)).toBe(1)
    expect(bijection.mapFrom(Seats.north)).toBe(2)
    expect(bijection.mapFrom(Seats.east)).toBe(3)

})

test("Bijection Card default", () => {
    const bijection = new Books.SimpleBijection(Deck.cards.all)
    Deck.cards.each((card, index) => {
        expect(bijection.mapTo(index)).toBe(card)
        expect(bijection.mapFrom(card)).toBe(index)
    })
})


test("Pavclicek Book generate first deal", () => {
    const book = new Books.BridgeBook(new PavlicekDealStrategy())
    const firstDeal = book.getDeal(BigInt(1))
    expect(firstDeal.toWhom).toBeDefined()
    expect(firstDeal.hands).toBeDefined()
    expect(firstDeal.north.toString()).toBe('AKQJ1098765432 - - -')
    expect(firstDeal.east.toString()).toBe('- AKQJ1098765432 - -')
    expect(firstDeal.south.toString()).toBe('- - AKQJ1098765432 -')
    expect(firstDeal.west.toString()).toBe('- - - AKQJ1098765432')
})

test("Andrews Book generate first deal", () => {
    const seatBijection = new Books.SimpleBijection(Seats.all, (n) => 3 - n)
    const book = new Books.BridgeBook(new AndrewsDealStrategy(), seatBijection)
    const firstDeal = book.getDeal(BigInt(1))

    expect(firstDeal.north.toString()).toBe('AKQJ1098765432 - - -')
    expect(firstDeal.east.toString()).toBe('- AKQJ1098765432 - -')
    expect(firstDeal.south.toString()).toBe('- - AKQJ1098765432 -')
    expect(firstDeal.west.toString()).toBe('- - - AKQJ1098765432')
})


test("Book generate last deal", () => {
    const book = new Books.BridgeBook(new PavlicekDealStrategy())
    const lastDeal = book.getDeal(book.lastPage)

    expect(lastDeal.north.toString()).toBe('- - - AKQJ1098765432')
    expect(lastDeal.east.toString()).toBe('- - AKQJ1098765432 -')
    expect(lastDeal.south.toString()).toBe('- AKQJ1098765432 - -')
    expect(lastDeal.west.toString()).toBe('AKQJ1098765432 - - -')

})

test('validate_strategy throws an error for a strategy with the wrong signature', () => {
    expect(() => Books.validate_signature(new DealSignature([13, 13, 13]))).toThrow()
    expect(() => Books.validate_signature(new DealSignature([13, 13, 13, 13, 13]))).toThrow()
    expect(() => Books.validate_signature(new DealSignature([13, 13, 12, 14]))).toThrow()

})

test('Fail on a page out of range', () => {
    const book = new Books.BridgeBook(new PavlicekDealStrategy())
    expect(() => book.getDeal(BigInt(0))).toThrow()
    expect(() => book.getDeal(book.lastPage + BigInt(1))).toThrow()

})

test('Reverse lookup', () => {
    const seatBijection = new Books.SimpleBijection(Seats.all, (n) => 3 - n)
    const book = new Books.BridgeBook(new AndrewsDealStrategy(), seatBijection)
    const page = BigInt(53) ** BigInt(12)
    const deal = book.getDeal(page)
    expect(book.getPageNumber(deal)).toBe(page)
})
