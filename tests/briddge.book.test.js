import * as books from "../dest/bridge/book.js"
import {PavlicekStrategy} from "../dest/numeric/pavlicek.js"

test("Book constructor",() => {
    var strategy = new PavlicekStrategy()
    var book = new books.BridgeBook(strategy)
    var deal = book.getDeal(BigInt(0))
    expect(deal.toWhom).toBeDefined()
    expect(deal.hands).toBeDefined()
    expect(deal.north().toString()).toBe('AKQJ1098765432 - - -')
    expect(deal.east().toString()).toBe('- AKQJ1098765432 - -')
    expect(deal.south().toString()).toBe('- - AKQJ1098765432 -')
    expect(deal.west().toString()).toBe('- - - AKQJ1098765432')
})

