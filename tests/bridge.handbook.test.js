import {AndrewsHandBook, PavlicekHandBook} from '../dest/bridge/handbook.js'
import {Hand} from "../dest/bridge/deal.js"
import {Deck} from '../dest/bridge/constants.js'
import {SimpleBijection} from '../dest/bridge/bijection.js'

test('First page is the same', ()=>{
    const aBook = new AndrewsHandBook()
    const pBook = new PavlicekHandBook()
    expect(aBook.pages).toBe(pBook.pages)
    expect(aBook.lastPage).toBe(pBook.lastPage)

    const lastPage = aBook.lastPage

    expect(aBook.getHand(BigInt(1)).toString()).toBe('AKQJ1098765432 - - -')
    expect(aBook.getHand(lastPage).toString()).toBe('- - - AKQJ1098765432')
    expect(pBook.getHand(BigInt(1)).toString()).toBe('AKQJ1098765432 - - -')
    expect(pBook.getHand(lastPage).toString()).toBe('- - - AKQJ1098765432')

    expect(() => aBook.getHand(BigInt(0))).toThrow()
    expect(() => pBook.getHand(BigInt(0))).toThrow()
    expect(() => aBook.getHand(lastPage+BigInt(1))).toThrow()
    expect(() => pBook.getHand(lastPage+BigInt(1))).toThrow()
})

test('Reverse lookup: Andrews', ()=>{
    const aBook = new AndrewsHandBook()

    var first = Hand.forString('sAKQJT98765432 h- d- c-')
    expect(aBook.getPageNumber(first)).toBe(BigInt(1))

    var last = Hand.forString('s- h- d- cAKQJT98765432')
    expect(aBook.getPageNumber(last)).toBe(aBook.lastPage)

    var page = aBook.pages * BigInt(29)/BigInt(73)
    var aHand = aBook.getHand(page)
    expect(aBook.getPageNumber(aHand)).toBe(page)


})

test('Reverse lookup: Pavlicek', ()=>{
    const pBook = new PavlicekHandBook()

    var first = Hand.forString('sAKQJT98765432 h- d- c-')
    expect(pBook.getPageNumber(first)).toBe(BigInt(1))

    var last = Hand.forString('s- h- d- cAKQJT98765432')
    expect(pBook.getPageNumber(last)).toBe(pBook.lastPage)

    var page = pBook.pages * BigInt(29)/BigInt(73)
    var pHand = pBook.getHand(page)
    expect(pBook.getPageNumber(pHand)).toBe(page)

})

test('Bijection: Andrews', ()=>{
    const reverse = new SimpleBijection(Deck.cards.all, (num) => 51-num)
    const aBook = new AndrewsHandBook(reverse)
    const lastPage = aBook.lastPage

    expect(aBook.getHand(BigInt(1)).toString()).toBe('- - - AKQJ1098765432')
    expect(aBook.getHand(lastPage).toString()).toBe('AKQJ1098765432 - - -')
})

test('Bijection: Pavlicek', ()=>{
    const reverse = new SimpleBijection(Deck.cards.all, (num) => 51-num)
    const aBook = new PavlicekHandBook(reverse)
    const lastPage = aBook.lastPage

    expect(aBook.getHand(BigInt(1)).toString()).toBe('- - - AKQJ1098765432')
    expect(aBook.getHand(lastPage).toString()).toBe('AKQJ1098765432 - - -')
})
