const book = require('../dest/numeric/book.js')



test("deal signature constructor",
  () => {
    var sig = new book.DealSignature([1,2,3,4]); 
    expect(sig.seats).toBe(4)
    expect(sig.cards).toBe(10)
    expect(sig.perSeat).toEqual([1,2,3,4])
    expect(sig.pages).toEqual(BigInt(12600))
    expect(sig.lastPage()).toBe(BigInt(12599))
    expect(() => sig.assertValidPageNo(sig.pages)).toThrowError()
    expect(() => sig.assertValidPageNo(BigInt(-1))).toThrowError()
  })