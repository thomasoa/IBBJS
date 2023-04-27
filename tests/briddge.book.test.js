import * as books from "../dest/bridge/book.js"
import {PavlicekStrategy} from "../dest/numeric/pavlicek.js"

test("Book generate first deal",() => {
    var strategy = new PavlicekStrategy()
    var book = new books.BridgeBook(strategy)
    var firstDeal = book.getDeal(BigInt(0))
    expect(firstDeal.toWhom).toBeDefined()
    expect(firstDeal.hands).toBeDefined()
    expect(firstDeal.north().toString()).toBe('AKQJ1098765432 - - -')
    expect(firstDeal.east().toString()).toBe('- AKQJ1098765432 - -')
    expect(firstDeal.south().toString()).toBe('- - AKQJ1098765432 -')
    expect(firstDeal.west().toString()).toBe('- - - AKQJ1098765432')
})

test("Book generate last deal",() => {
    var strategy = new PavlicekStrategy()
    var book = new books.BridgeBook(strategy)
    var lastDeal = book.getDeal(book.lastPage)

    expect(lastDeal.north().toString()).toBe('- - - AKQJ1098765432')
    expect(lastDeal.east().toString()).toBe('- - AKQJ1098765432 -')
    expect(lastDeal.south().toString()).toBe('- AKQJ1098765432 - -')
    expect(lastDeal.west().toString()).toBe('AKQJ1098765432 - - -')

})

test("Book constructor",() => {
    var strategy = new PavlicekStrategy()
    var book = new books.BridgeBook(strategy)
    expect(book.pages.toString()).toEqual("53644737765488792839237440000")
    expect(book.lastPage.toString()).toEqual("53644737765488792839237439999")
})


