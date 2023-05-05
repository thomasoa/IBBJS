import {HandBook, AndrewsHandBook, PavlicekHandBook} from '../dest/bridge/handbook.js'

test('First page is the same', ()=>{
    const aBook = new AndrewsHandBook()
    const pBook = new PavlicekHandBook()
    expect(aBook.getHand(BigInt(1)).toString()).toBe('AKQJ1098765432 - - -')
    expect(pBook.getHand(BigInt(1)).toString()).toBe('AKQJ1098765432 - - -')

})