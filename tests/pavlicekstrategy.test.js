const pavlicek = require('../dest/numeric/pavlicek.js')
const numDeal = require('../dest/numeric/deal.js')


function signature1234() {
  // dommon signature for these tests
  return new numDeal.DealSignature([1,2,3,4]) ;
}

test("Pavlicek strategy default signature", 
  () => {
    var pBook = new pavlicek.PavlicekStrategy()
    expect(pBook.signature.perSeat).toEqual([13,13,13,13])
  }
)

test("Pavlicek strategy decode", () => {
   var pBook = new pavlicek.PavlicekStrategy(signature1234())
   var deal = pBook.computePageContent(BigInt(0))
   expect(deal.toWhom).toEqual([0,1,1,2,2,2,3,3,3,3])
})

test("Pavlicek strategy decode - last page", () => {
  var pBook = new pavlicek.PavlicekStrategy(signature1234())
  var deal = pBook.computePageContent(pBook.signature.lastPage())
  expect(deal.toWhom).toEqual([3,3,3,3,2,2,2,1,1,0])
})

test("Pavlicek strategy complete deals ensure unique [2,2,2,2]",() => {
  var sig = new numDeal.DealSignature([2,2,2,2])
  var pBook = new pavlicek.PavlicekStrategy(sig)
  var map = new Map()
  for (var page=BigInt(0); page<sig.pages; page++) {
    var deal = pBook.computePageContent(page)

    var dealString = deal.toWhom.join('')
    
    expect(map.has(dealString)).toBeFalsy()
    map.set(dealString,page)
  }
})





