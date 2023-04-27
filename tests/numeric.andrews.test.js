const andrews = require('../dest/numeric/andrews.js')
const numDeal = require('../dest/numeric/deal.js')

function signature1234() {
  // dommon signature for these tests
  return new numDeal.DealSignature([1,2,3,4]) ;
}

test('SequenceBuilder simple example',() => {
  var builder = new andrews.SequenceBuilder(2,3)
  var toWhom = [0,3,2,3,1,2,3,2]
  toWhom.forEach((seat,card) => {
    builder.nextItem(card,seat)  
  })
  expect(builder.sequence).toEqual([1,3,4])
})

test("Andrews strategy default signature", 
  () => {
    var aBook = new andrews.AndrewsStrategy()
    expect(aBook.signature.perSeat).toEqual([13,13,13,13])
  }
)

test("Andrews strategy factors",
 () => {
    var sig = signature1234()
    var aBook = new andrews.AndrewsStrategy(sig)
    expect(aBook.factors[0]).toMatchObject({seat:3,cards:4,quotient:BigInt(60)})
    expect(aBook.factors[1]).toMatchObject({seat:2,cards:3,quotient:BigInt(3)})
    expect(aBook.factors[2]).toMatchObject({seat:1,cards:2,quotient:BigInt(1)})
});

test("Andrews strategy: Try first and last deal",
  ()=> {
    var sig = signature1234()
    var aBook = new andrews.AndrewsStrategy(sig)
    expect(aBook.computePageContent(BigInt(0)).toWhom).toEqual([3,3,3,3,2,2,2,1,1,0])
    var lastPage = aBook.lastPage
    expect(aBook.computePageContent(lastPage).toWhom).toEqual([0,1,1,2,2,2,3,3,3,3])
  }
)

test("Andrews strategy: computePageNumber returns original page number",
  ()=> {
    // Ensure computing the contents then 
    var sig = new numDeal.DealSignature([1,2,3,4])
    var aBook = new andrews.AndrewsStrategy(sig)
    var pageNo = BigInt(755)
    var deal = aBook.computePageContent(pageNo)    
    expect(aBook.computePageNumber(deal)).toEqual(pageNo)
  }
)

test("Andrews book complete invertible for signature [2,2,2,2]",() => {
   var sig = new numDeal.DealSignature([2,2,2,2])
   var aBook = new andrews.AndrewsStrategy(sig)

   for (var page=BigInt(0); page<sig.pages; page++) {
     var deal = aBook.computePageContent(page)
     expect(aBook.computePageNumber(deal)).toBe(page)
   }
})
