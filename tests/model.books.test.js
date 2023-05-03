import {BookSet} from "../dest/model/books.js"
import { bridgeSignature } from "../dest/numeric/index.js"

test('Ensure books exist for all names',()=>{
    var bookSet = new BookSet()
    expect(bookSet.book('Andrews',false)).toBeDefined()
    expect(bookSet.book('Andrews',true)).toBeDefined()
    expect(bookSet.book('Pavlicek',false)).toBeDefined()
    expect(bookSet.book('Pavlicek',true)).toBeDefined()
})

test('Ensure invalid edition name throws exception',()=>{
    var bookSet = new BookSet()
    expect(()=> bookSet.book('Dummy',false)).toThrowError()
})

test('pageNumbers for first page',()=> {
    var bookSet = new BookSet()
    var andrews = bookSet.book('Andrews')
    var deal1 = andrews.getDeal(BigInt(1))
    var editionPages = bookSet.pageNumbers(deal1)
    expect(editionPages.length).toBe(2)
    editionPages.forEach((edPage)=>{
        expect(edPage.normal).toBe(BigInt(1))
    })

})

test('pageNumbers for last page',()=> {
    var bookSet = new BookSet()
    var andrews = bookSet.book('Andrews')
    var page = andrews.lastPage
    var deal = andrews.getDeal(page)
    var editionPages = bookSet.pageNumbers(deal)
    expect(editionPages.length).toBe(2)
    editionPages.forEach((edPage)=>{
        expect(edPage.normal).toBe(page)
    })
})

test('Try re-lookup', ()=> {
    var bookSet = new BookSet()
    var andrews = bookSet.book('Andrews')
    var page = BigInt(13)**BigInt(24)
    var deal = andrews.getDeal(page)
    var editionPages = bookSet.pageNumbers(deal)

    var lookup = (book,pageNo) => book.getDeal(pageNo)

    editionPages.forEach((edPages)=>{
        var nBook = bookSet.book(edPages.name)
        expect(deal.equals(nBook.getDeal(edPages.normal))).toBeTruthy()
        var pBook = bookSet.book(edPages.name,true)
        expect(deal.equals(pBook.getDeal(edPages.scrambled))).toBeTruthy()

    })
})
