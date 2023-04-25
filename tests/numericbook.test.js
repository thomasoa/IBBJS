const book = require('../dest/numeric/book.js')

function test_sig1234() {
    return new book.DealSignature([1,2,3,4]) ;
}


test("deal signature constructor",
  () => {
    var sig = test_sig1234(); // [1,2,3,4]
    expect(sig.seats).toBe(4)
    expect(sig.cards).toBe(10)
    expect(sig.perSeat).toEqual([1,2,3,4])
    expect(sig.pages).toEqual(BigInt(12600))
  })

test("Andrews strategy default signature", 
  () => {
    var aBook = new book.AndrewsStrategy()
    expect(aBook.signature.perSeat).toEqual([13,13,13,13])
  }
)

test("Andrews strategy factors",
 () => {
    var sig = test_sig1234()
    var aBook = new book.AndrewsStrategy(sig)
    expect(aBook.factors[0]).toMatchObject({seat:3,cards:4,quotient:BigInt(60)})
    expect(aBook.factors[1]).toMatchObject({seat:2,cards:3,quotient:BigInt(3)})
    expect(aBook.factors[2]).toMatchObject({seat:1,cards:2,quotient:BigInt(1)})
});

test("Try an index",
  ()=> {
    var sig = test_sig1234()
    var aBook = new book.AndrewsStrategy(sig)
    expect(aBook.computePageContent(BigInt(0))).toEqual([3,3,3,3,2,2,2,1,1,0])
    var lastPage = aBook.lastPage()
    expect(aBook.computePageContent(lastPage)).toEqual([0,1,1,2,2,2,3,3,3,3])
  }
)

test("getPageNo returns original page number",
  ()=> {
    // Ensure computing the contents then 
    var sig = new book.DealSignature([1,2,3,4])
    var aBook = new book.AndrewsStrategy(sig)
    var pageNo = BigInt(755)
    var contents = aBook.computePageContent(pageNo)    
    expect(aBook.computePageNumber(contents)).toEqual(pageNo)
  }
)

test("Pavlicek strategy default signature", 
  () => {
    var pBook = new book.PavlicekStrategy()
    expect(pBook.signature.perSeat).toEqual([13,13,13,13])
  }
)