import * as Books from "../dest/bridge/book.js"
import * as C from "../dest/bridge/constants.js"
import { Deal } from "../dest/bridge/deal.js"
import {PavlicekStrategy, AndrewsStrategy, DealSignature} from "../dest/numeric/index.js"

test("Book constructor",() => {
    var book = new Books.BridgeBook(new PavlicekStrategy())
    expect(book.pages.toString()).toEqual("53644737765488792839237440000")
    expect(book.lastPage.toString()).toEqual("53644737765488792839237440000")
})

test("Pavclicek Book generate first deal",() => {
    var book = new Books.BridgeBook(new PavlicekStrategy())
    var firstDeal = book.getDeal(BigInt(1))
    expect(firstDeal.toWhom).toBeDefined()
    expect(firstDeal.hands).toBeDefined()
    expect(firstDeal.north.toString()).toBe('AKQJ1098765432 - - -')
    expect(firstDeal.east.toString()).toBe('- AKQJ1098765432 - -')
    expect(firstDeal.south.toString()).toBe('- - AKQJ1098765432 -')
    expect(firstDeal.west.toString()).toBe('- - - AKQJ1098765432')
})

test("Andrews Book generate first deal",() => {
    var seatMap = (seatNum) => C.Seats.all[3-seatNum]
    var book = new Books.BridgeBook(new AndrewsStrategy(),seatMap)
    var firstDeal = book.getDeal(BigInt(1))

    expect(firstDeal.north.toString()).toBe('AKQJ1098765432 - - -')
    expect(firstDeal.east.toString()).toBe('- AKQJ1098765432 - -')
    expect(firstDeal.south.toString()).toBe('- - AKQJ1098765432 -')
    expect(firstDeal.west.toString()).toBe('- - - AKQJ1098765432')
})


test("Book generate last deal",() => {
    var book = new Books.BridgeBook(new PavlicekStrategy())
    var lastDeal = book.getDeal(book.lastPage)

    expect(lastDeal.north.toString()).toBe('- - - AKQJ1098765432')
    expect(lastDeal.east.toString()).toBe('- - AKQJ1098765432 -')
    expect(lastDeal.south.toString()).toBe('- AKQJ1098765432 - -')
    expect(lastDeal.west.toString()).toBe('AKQJ1098765432 - - -')

})

test('validate_strategy throws an error for a strategy with the wrong signature',()=>{
    expect(()=> Books.validate_signature(new DealSignature([13,13,13]))).toThrow()
    expect(()=> Books.validate_signature(new DealSignature([13,13,13,13,13]))).toThrow()
    expect(()=> Books.validate_signature(new DealSignature([13,13,12,14]))).toThrow()

})

test('Fail on a page out of range',()=>{
    var book = new Books.BridgeBook(new PavlicekStrategy())
    expect(()=> book.getDeal(BigInt(0))).toThrow()
    expect(()=> book.getDeal(book.lastPage+BigInt(1))).toThrow()

})


