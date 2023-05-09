import {HandBook} from "../src/bridge/handbook"
import {Hand} from "../src/bridge/deal"
import {Deck} from "../src/basics/src/bridge/constants"
import {SimpleBijection} from "../src/bridge/bijection"
import { AndrewsHandStrategy, PavlicekHandStrategy} from "../src/numeric/index"
import { HandSignature } from "../src/numeric/deal"

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

    const first = Hand.forString('sAKQJT98765432 h- d- c-')
    expect(aBook.getPageNumber(first)).toBe(BigInt(1))

    const last = Hand.forString('s- h- d- cAKQJT98765432')
    expect(aBook.getPageNumber(last)).toBe(aBook.lastPage)

    const page = aBook.pages * BigInt(29)/BigInt(73)
    const aHand = aBook.getHand(page)
    expect(aBook.getPageNumber(aHand)).toBe(page)

    const pageNo = aBook.pages *BigInt(33)/BigInt(103)
    const hand = aBook.getHand(pageNo)
    const inverse = aBook.getPageNumber(hand)
    expect(inverse).toBe(pageNo)

})

test('Reverse lookup: Pavlicek', ()=>{
    const pBook = new HandBook(new PavlicekHandStrategy())

    const first = Hand.forString('sAKQJT98765432 h- d- c-')
    expect(pBook.getPageNumber(first)).toBe(BigInt(1))

    const last = Hand.forString('s- h- d- cAKQJT98765432')
    expect(pBook.getPageNumber(last)).toBe(pBook.lastPage)

    const page = pBook.pages * BigInt(29)/BigInt(73)
    const pHand = pBook.getHand(page)
    expect(pBook.getPageNumber(pHand)).toBe(page)

    const pageNo = pBook.pages *BigInt(33)/BigInt(103)
    const hand = pBook.getHand(pageNo)
    const inverse = pBook.getPageNumber(hand)
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
