import * as Books from "../dest/bridge/book.js"
import * as C from "../dest/bridge/constants.js"
import {PavlicekStrategy, AndrewsStrategy, DealSignature} from "../dest/numeric/index.js"

test("Book constructor",() => {
    var book = new Books.BridgeBook(new PavlicekStrategy())
    expect(book.pages.toString()).toEqual("53644737765488792839237440000")
    expect(book.lastPage.toString()).toEqual("53644737765488792839237440000")
})

test("Bijection Seat",()=>{
    var bijection = new Books.SimpleBijection(C.Seats.all, (n)=> (n+2)%4)
    expect(bijection.mapTo(0)).toBe(C.Seats.south)
    expect(bijection.mapTo(1)).toBe(C.Seats.west)
    expect(bijection.mapTo(2)).toBe(C.Seats.north)
    expect(bijection.mapTo(3)).toBe(C.Seats.east)
    expect(bijection.mapFrom(C.Seats.south)).toBe(0)
    expect(bijection.mapFrom(C.Seats.west)).toBe(1)
    expect(bijection.mapFrom(C.Seats.north)).toBe(2)
    expect(bijection.mapFrom(C.Seats.east)).toBe(3)

})

test("Bijection Card default",()=>{
    var bijection = new Books.SimpleBijection(C.Cards)
    C.Cards.forEach((card,index) =>{
        expect(bijection.mapTo(index)).toBe(card)
        expect(bijection.mapFrom(card)).toBe(index)
    })
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
    var seatBijection = new Books.SimpleBijection(C.Seats.all,(n)=> 3-n)
    var book = new Books.BridgeBook(new AndrewsStrategy(),seatBijection)
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

test('Reverse lookup',()=>{
    var seatBijection = new Books.SimpleBijection(C.Seats.all,(n)=> 3-n)
    var book = new Books.BridgeBook(new AndrewsStrategy(),seatBijection)
    var page = BigInt(53)**BigInt(12)
    var deal = book.getDeal(page)
    expect(book.getPageNumber(deal)).toBe(page)
})


