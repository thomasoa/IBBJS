import * as pavlicek from "../src/numeric/pavlicek"
import {AndrewsDealStrategy} from "../src/numeric/andrews"
import * as numDeal from "../src/numeric/deal"

function signature1234() {
  // dommon signature for these tests
  return new numDeal.DealSignature([1, 2, 3, 4]);
}

test("Pavlicek strategy default signature",
  () => {
    const pBook = new pavlicek.PavlicekDealStrategy()
    expect(pBook.signature.perSeat).toEqual([13, 13, 13, 13])
  }
)

test("Pavlicek strategy decode", () => {
  const pBook = new pavlicek.PavlicekDealStrategy(signature1234())
  const deal = pBook.computePageContent(BigInt(0))
  expect(deal.toWhom).toEqual([0, 1, 1, 2, 2, 2, 3, 3, 3, 3])
})

test("Pavlicek strategy decode - last page", () => {
  const pBook = new pavlicek.PavlicekDealStrategy(signature1234())
  const deal = pBook.computePageContent(pBook.lastPage)
  expect(deal.toWhom).toEqual([3, 3, 3, 3, 2, 2, 2, 1, 1, 0])
})

test("Pavlicek strategy: computePageNumber returns original page number",
  () => {
    // Ensure computing the contents then 
    const sig = new numDeal.DealSignature([1, 2, 3, 4])
    const pBook = new pavlicek.PavlicekDealStrategy(sig)
    const pageNo = BigInt(755)
    const deal = pBook.computePageContent(pageNo)
    expect(pBook.computePageNumber(deal)).toEqual(pageNo)
  }
)

test("Pavlicek strategy complete deals ensured unique [2,2,2,2]", () => {
  const sig = new numDeal.DealSignature([2, 2, 2, 2]) // 2520 pages
  const pBook = new pavlicek.PavlicekDealStrategy(sig)
  const map = new Map()
  for (let page = BigInt(0); page < sig.pages; page++) {
    const deal = pBook.computePageContent(page)
    const dealString = deal.toWhom.join('')
    expect(map.has(dealString)).toBeFalsy()
    map.set(dealString, page)
    expect(pBook.computePageNumber(deal)).toBe(page)
  }
})

test('Out of bounds page number', () => {
  const sig = new numDeal.DealSignature([2, 2, 2, 2]) // 2520 pages

  const pBook = new pavlicek.PavlicekDealStrategy(sig)
  expect(() => pBook.computePageContent(pBook.lastPage + BigInt(1))).toThrow()
  expect(() => pBook.computePageContent(BigInt(-1))).toThrow()

})

test('Check computePageNumber with unmatching signatures', () => {
  const sig2 = new numDeal.DealSignature([2, 2, 2, 2]) // 2520 pages
  const pBook = new pavlicek.PavlicekDealStrategy(sig2)
  const sig1 = new numDeal.DealSignature([1, 1, 1, 1])
  const deal = new numDeal.NumericDeal(sig1, [0, 1, 2, 3])
  expect(() => pBook.computePageNumber(deal)).toThrow()
})

test('First Hand page is [0,1,2], last is [3,4,5]', ()=>{
  const sig = new numDeal.HandSignature(3,6)
  const pBook = new pavlicek.PavlicekHandStrategy(sig)

  expect(pBook.computePageContent(BigInt(0))).toEqual([0,1,2])
  expect(pBook.computePageContent(pBook.lastPage)).toEqual([3,4,5])

  for (let pageNo = BigInt(0); pageNo<pBook.pages; pageNo++) {
    const cardsTo = pBook.computePageContent(pageNo)
    const reversed = pBook.computePageNumber(cardsTo)
    expect(reversed).toBe(pageNo)
  }
})

test('AndrewsDealStrategy with PavlicekHandStrategy',()=> {
  const sig = new numDeal.HandSignature(3,6)
  const pBook = new pavlicek.PavlicekHandStrategy(sig, AndrewsDealStrategy)

  expect(pBook.computePageContent(BigInt(0))).toEqual([3,4,5])
  expect(pBook.computePageContent(pBook.lastPage)).toEqual([0,1,2])

  for (let pageNo = BigInt(0); pageNo<pBook.pages; pageNo++) {
    const cardsTo = pBook.computePageContent(pageNo)
    const reversed = pBook.computePageNumber(cardsTo)
    expect(reversed).toBe(pageNo)
  }
})





