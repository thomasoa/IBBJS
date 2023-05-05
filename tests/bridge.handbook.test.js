import {AndrewsHandBook, PavlicekHandBook} from '../dest/bridge/handbook.js'

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

})

