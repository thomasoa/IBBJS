const book = require('../dest/numeric/book.js')

test("numeric book constructor",
  () => {
    var aBook = new book.NumericBook([1,2,3,4]);
    expect(aBook.seats).toBe(4)
    expect(aBook.cards).toBe(10)
    expect(aBook.perSeat).toEqual([1,2,3,4])
    expect(aBook.pages).toEqual(BigInt(12600))
    expect(aBook.factors[0]).toMatchObject({seat:3,cards:4,quotient:BigInt(60)})
    expect(aBook.factors[1]).toMatchObject({seat:2,cards:3,quotient:BigInt(3)})
    expect(aBook.factors[2]).toMatchObject({seat:1,cards:2,quotient:BigInt(1)})
});

test("Try an index",
  ()=> {
    var aBook = new book.NumericBook([1,2,3,4])
    expect(aBook.computePageContent(BigInt(0))).toEqual([3,3,3,3,2,2,2,1,1,0])
    var lastPage = aBook.lastPage()
    expect(aBook.computePageContent(lastPage)).toEqual([0,1,1,2,2,2,3,3,3,3])
  }
)

test("getPageNo returns original page number",
  ()=> {
    // Ensure computing the contents then 
    var aBook = new book.NumericBook([1,2,3,4])
    var pageNo = BigInt(755)
    var contents = aBook.computePageContent(pageNo)    
    expect(aBook.computePageNumber(contents)).toEqual(pageNo)
  }
)