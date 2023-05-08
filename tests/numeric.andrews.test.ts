import * as andrews from "../src/numeric/andrews"
import * as  Deal from "../src/numeric/deal"

function signature1234() {
  // dommon signature for these tests
  return new Deal.DealSignature([1, 2, 3, 4]);
}

test('SequenceBuilder simple example', () => {
  const builder = new andrews.SequenceBuilder(2, 3)
  const toWhom = [0, 3, 2, 3, 1, 2, 3, 2]
  toWhom.forEach((seat, card) => {
    builder.nextItem(card, seat)
  })
  expect(builder.sequence).toEqual([1, 3, 4])
})

test("Andrews strategy default signature",() => {
  const aBook = new andrews.AndrewsDealStrategy()
    expect(aBook.signature.perSeat).toEqual([13, 13, 13, 13])
})

test("Andrews strategy factors",() => {
  const sig = signature1234()
  const aBook = new andrews.AndrewsDealStrategy(sig)
    expect(aBook.factors[0]).toMatchObject({ seat: 3, cards: 4, quotient: BigInt(60) })
    expect(aBook.factors[1]).toMatchObject({ seat: 2, cards: 3, quotient: BigInt(3) })
    expect(aBook.factors[2]).toMatchObject({ seat: 1, cards: 2, quotient: BigInt(1) })
});

test("Andrews strategy: Try first and last deal",() => {
  const sig = signature1234()
  const aBook = new andrews.AndrewsDealStrategy(sig)
    expect(aBook.computePageContent(BigInt(0)).toWhom).toEqual([3, 3, 3, 3, 2, 2, 2, 1, 1, 0])
    const lastPage = aBook.lastPage
    expect(aBook.computePageContent(lastPage).toWhom).toEqual([0, 1, 1, 2, 2, 2, 3, 3, 3, 3])
  }
)

test("Andrews strategy: computePageNumber returns original page number",() => {
    // Ensure computing the contents then 
    const sig = new Deal.DealSignature([1, 2, 3, 4])
    const aBook = new andrews.AndrewsDealStrategy(sig)
    const pageNo = BigInt(755)
    const deal = aBook.computePageContent(pageNo)
    expect(aBook.computePageNumber(deal)).toEqual(pageNo)
  })

test("Andrews book complete invertible for signature [2,2,2,2]", () => {
  const sig = new Deal.DealSignature([2, 2, 2, 2])
  const aBook = new andrews.AndrewsDealStrategy(sig)

  for (let page = BigInt(0); page < sig.pages; page++) {
    const deal = aBook.computePageContent(page)
    expect(aBook.computePageNumber(deal)).toBe(page)
  }
})

test('Check computePageNumber with unmatching signatures', () => {
  const sig2 = new Deal.DealSignature([2, 2, 2, 2]) // 2520 pages
  const aBook = new andrews.AndrewsDealStrategy(sig2)
  const sig1 = new Deal.DealSignature([1, 1, 1, 1])
  const deal = new Deal.NumericDeal(sig1, [0, 1, 2, 3])
  expect(() => aBook.computePageNumber(deal)).toThrow()
})

test('First Hand page is [0,1,2]', ()=>{
  const sig = new Deal.HandSignature(3,6)
  const aBook = new andrews.AndrewsHandStrategy(sig)

  expect(aBook.computePageContent(BigInt(0))).toEqual([0,1,2])
  expect(aBook.computePageContent(aBook.lastPage)).toEqual([3,4,5])
})
