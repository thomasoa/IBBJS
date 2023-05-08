import { BookSet } from "../src/model/books"
import { bridgeSignature } from "../src/numeric/index"

test('Ensure books exist for all names', () => {
    const bookSet = new BookSet()
    expect(bookSet.book('Andrews', false)).toBeDefined()
    expect(bookSet.book('Andrews', true)).toBeDefined()
    expect(bookSet.book('Pavlicek', false)).toBeDefined()
    expect(bookSet.book('Pavlicek', true)).toBeDefined()
})

test('Ensure invalid edition name throws exception', () => {
    const bookSet = new BookSet()
    expect(() => bookSet.book('Dummy', false)).toThrowError()
})

test('pageNumbers for first page', () => {
    const bookSet = new BookSet()
    const andrews = bookSet.book('Andrews')
    const deal1 = andrews.getDeal(BigInt(1))
    const editionPages = bookSet.pageNumbers(deal1)
    expect(editionPages.length).toBe(2)
    editionPages.forEach((edPage) => {
        expect(edPage.normal).toBe(BigInt(1))
    })

})

test('pageNumbers for last page', () => {
    const bookSet = new BookSet()
    const andrews = bookSet.book('Andrews')
    const page = andrews.lastPage
    const deal = andrews.getDeal(page)
    const editionPages = bookSet.pageNumbers(deal)
    expect(editionPages.length).toBe(2)
    editionPages.forEach((edPage) => {
        expect(edPage.normal).toBe(page)
    })
})

test('Try re-lookup', () => {
    const bookSet = new BookSet()
    const andrews = bookSet.book('Andrews')
    const page = BigInt(13) ** BigInt(24)
    const deal = andrews.getDeal(page)
    const editionPages = bookSet.pageNumbers(deal)

    const lookup = (book, pageNo) => book.getDeal(pageNo)

    editionPages.forEach((edPages) => {
        const nBook = bookSet.book(edPages.name)
        expect(deal.equals(nBook.getDeal(edPages.normal))).toBeTruthy()
        const pBook = bookSet.book(edPages.name, true)
        expect(deal.equals(pBook.getDeal(edPages.scrambled))).toBeTruthy()

    })
})
