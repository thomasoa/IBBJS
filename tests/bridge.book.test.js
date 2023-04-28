import * as Books from "../dest/bridge/book.js"
import * as C from "../dest/bridge/constants.js"
import {PavlicekStrategy, AndrewsStrategy} from "../dest/numeric/book.js"

test("Book constructor",() => {
    var strategy = new PavlicekStrategy()
    var book = new Books.BridgeBook(strategy)
    expect(book.pages.toString()).toEqual("53644737765488792839237440000")
    expect(book.lastPage.toString()).toEqual("53644737765488792839237440000")
})

test("Pavclicek Book generate first deal",() => {
    var strategy = new PavlicekStrategy()
    var book = new Books.BridgeBook(strategy)
    var firstDeal = book.getDeal(BigInt(1))
    expect(firstDeal.toWhom).toBeDefined()
    expect(firstDeal.hands).toBeDefined()
    expect(firstDeal.north.toString()).toBe('AKQJ1098765432 - - -')
    expect(firstDeal.east.toString()).toBe('- AKQJ1098765432 - -')
    expect(firstDeal.south.toString()).toBe('- - AKQJ1098765432 -')
    expect(firstDeal.west.toString()).toBe('- - - AKQJ1098765432')
})

test("Andrews Book generate first deal",() => {
    var strategy = new AndrewsStrategy()
    var seatMap = (seatNum) => C.Seats.all[3-seatNum]
    var book = new Books.BridgeBook(strategy,seatMap)
    var firstDeal = book.getDeal(BigInt(1))

    expect(firstDeal.north.toString()).toBe('AKQJ1098765432 - - -')
    expect(firstDeal.east.toString()).toBe('- AKQJ1098765432 - -')
    expect(firstDeal.south.toString()).toBe('- - AKQJ1098765432 -')
    expect(firstDeal.west.toString()).toBe('- - - AKQJ1098765432')
})


test("Book generate last deal",() => {
    var strategy = new PavlicekStrategy()
    var book = new Books.BridgeBook(strategy)
    var lastDeal = book.getDeal(book.lastPage)

    expect(lastDeal.north.toString()).toBe('- - - AKQJ1098765432')
    expect(lastDeal.east.toString()).toBe('- - AKQJ1098765432 -')
    expect(lastDeal.south.toString()).toBe('- AKQJ1098765432 - -')
    expect(lastDeal.west.toString()).toBe('AKQJ1098765432 - - -')

})



