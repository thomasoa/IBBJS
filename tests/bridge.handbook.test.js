import {HandBook} from '../dest/bridge/handbook.js'
import {Hand} from "../dest/bridge/deal.js"
import {Deck} from '../dest/bridge/constants.js'
import {SimpleBijection} from '../dest/bridge/bijection.js'
import { AndrewsHandStrategy, PavlicekHandStrategy} from '../dest/numeric/index.js'
import { HandSignature } from '../dest/numeric/deal.js'

test('First page and last page in both books are the same', ()=>{
    const aBook = new HandBook(new AndrewsHandStrategy())
    const pBook = new HandBook(new PavlicekHandStrategy())
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
    const aBook = new HandBook(new AndrewsHandStrategy())

    var first = Hand.forString('sAKQJT98765432 h- d- c-')
    expect(aBook.getPageNumber(first)).toBe(BigInt(1))

    var last = Hand.forString('s- h- d- cAKQJT98765432')
    expect(aBook.getPageNumber(last)).toBe(aBook.lastPage)

    var page = aBook.pages * BigInt(29)/BigInt(73)
    var aHand = aBook.getHand(page)
    expect(aBook.getPageNumber(aHand)).toBe(page)

    const pageNo = aBook.pages *BigInt(33)/BigInt(103)
    var hand = aBook.getHand(pageNo)
    var inverse = aBook.getPageNumber(hand)
    expect(inverse).toBe(pageNo)

})

test('Reverse lookup: Pavlicek', ()=>{
    const pBook = new HandBook(new PavlicekHandStrategy())

    var first = Hand.forString('sAKQJT98765432 h- d- c-')
    expect(pBook.getPageNumber(first)).toBe(BigInt(1))

    var last = Hand.forString('s- h- d- cAKQJT98765432')
    expect(pBook.getPageNumber(last)).toBe(pBook.lastPage)

    var page = pBook.pages * BigInt(29)/BigInt(73)
    var pHand = pBook.getHand(page)
    expect(pBook.getPageNumber(pHand)).toBe(page)

    const pageNo = pBook.pages *BigInt(33)/BigInt(103)
    var hand = pBook.getHand(pageNo)
    var inverse = pBook.getPageNumber(hand)
    expect(inverse).toBe(pageNo)

})

test('Bijection: Andrews', ()=>{
    const reverse = new SimpleBijection(Deck.cards.all, (num) => 51-num)
    const aBook = new HandBook(new AndrewsHandStrategy(),reverse)
    const lastPage = aBook.lastPage

    expect(aBook.getHand(BigInt(1)).toString()).toBe('- - - AKQJ1098765432')
    expect(aBook.getHand(lastPage).toString()).toBe('AKQJ1098765432 - - -')
})

test('Bijection: Pavlicek', ()=>{
    const reverse = new SimpleBijection(Deck.cards.all, (num) => 51-num)
    const pBook = new HandBook(new PavlicekHandStrategy(),reverse)
    const lastPage = pBook.lastPage

    expect(pBook.getHand(BigInt(1)).toString()).toBe('- - - AKQJ1098765432')
    expect(pBook.getHand(lastPage).toString()).toBe('AKQJ1098765432 - - -')
})

test('Error on wrong hand strategy type', ()=> {
    const hs = new HandSignature(12,52)
    expect(() => new HandBook(new AndrewsHandStrategy(hs))).toThrow()
})