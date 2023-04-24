const book = require('../dest/numeric/book.js')

test("numeric book constructor",
() => {
    var aBook = new book.NumericBook([1,2,3,4]);
    expect(aBook.seats).toBe(4)
    expect(aBook.cards).toBe(10)
    expect(aBook.perSeat).toEqual([1,2,3,4])
    expect(aBook.pages).toEqual(BigInt(12600))
})