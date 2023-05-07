import * as pavlicek from '../dest/numeric/pavlicek.js'
import * as numDeal from '../dest/numeric/deal.js'


function signature1234() {
  // dommon signature for these tests
  return new numDeal.DealSignature([1, 2, 3, 4]);
}

test("Pavlicek strategy default signature",
  () => {
    var pBook = new pavlicek.PavlicekDealStrategy()
    expect(pBook.signature.perSeat).toEqual([13, 13, 13, 13])
  }
)

test("Pavlicek strategy decode", () => {
  var pBook = new pavlicek.PavlicekDealStrategy(signature1234())
  var deal = pBook.computePageContent(BigInt(0))
  expect(deal.toWhom).toEqual([0, 1, 1, 2, 2, 2, 3, 3, 3, 3])
})

test("Pavlicek strategy decode - last page", () => {
  var pBook = new pavlicek.PavlicekDealStrategy(signature1234())
  var deal = pBook.computePageContent(pBook.lastPage)
  expect(deal.toWhom).toEqual([3, 3, 3, 3, 2, 2, 2, 1, 1, 0])
})

test("Pavlicek strategy: computePageNumber returns original page number",
  () => {
    // Ensure computing the contents then 
    var sig = new numDeal.DealSignature([1, 2, 3, 4])
    var pBook = new pavlicek.PavlicekDealStrategy(sig)
    var pageNo = BigInt(755)
    var deal = pBook.computePageContent(pageNo)
    expect(pBook.computePageNumber(deal)).toEqual(pageNo)
  }
)

test("Pavlicek strategy complete deals ensured unique [2,2,2,2]", () => {
  var sig = new numDeal.DealSignature([2, 2, 2, 2]) // 2520 pages
  var pBook = new pavlicek.PavlicekDealStrategy(sig)
  var map = new Map()
  for (var page = BigInt(0); page < sig.pages; page++) {
    var deal = pBook.computePageContent(page)
    var dealString = deal.toWhom.join('')
    expect(map.has(dealString)).toBeFalsy()
    map.set(dealString, page)
    expect(pBook.computePageNumber(deal)).toBe(page)
  }
})

test('Out of bounds page number', () => {
  var sig = new numDeal.DealSignature([2, 2, 2, 2]) // 2520 pages

  var pBook = new pavlicek.PavlicekDealStrategy(sig)
  expect(() => pBook.computePageContent(pBook.lastPage + 1)).toThrow()
  expect(() => pBook.computePageContent(new BigInt(-1))).toThrow()

})

test('Check computePageNumber with unmatching signatures', () => {
  var sig2 = new numDeal.DealSignature([2, 2, 2, 2]) // 2520 pages
  var pBook = new pavlicek.PavlicekDealStrategy(sig2)
  var sig1 = new numDeal.DealSignature([1, 1, 1, 1])
  var deal = new numDeal.NumericDeal(sig1, [0, 1, 2, 3])
  expect(() => pBook.computePageNumber(deal)).toThrow()
})

test('First Hand page is [0,1,2], last is [3,4,5]', ()=>{
  const sig = new numDeal.HandSignature(3,6)
  const pBook = new pavlicek.PavlicekHandStrategy(sig)

  expect(pBook.computePageContent(BigInt(0))).toEqual([0,1,2])
  expect(pBook.computePageContent(pBook.lastPage)).toEqual([3,4,5])
})





