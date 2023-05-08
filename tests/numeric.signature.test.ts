import * as numDeal from "../src/numeric/deal"

test("deal signature constructor",
  () => {
    const sig = new numDeal.DealSignature([1, 2, 3, 4]);
    expect(sig.seats).toBe(4)
    expect(sig.cards).toBe(10)
    expect(sig.perSeat).toEqual([1, 2, 3, 4])
    expect(sig.pages).toEqual(BigInt(12600))
    expect(sig.lastPage).toBe(BigInt(12599))
    expect(() => sig.assertValidPageNo(sig.pages)).toThrowError()
    expect(() => sig.assertValidPageNo(BigInt(-1))).toThrowError()
  })

test("deal signature for four player Texas Hold'em", () => {
  const sig = new numDeal.DealSignature([39 /* undealt*/, 2, 2, 2, 2, 3 /* flop */, 1, 1])
  expect(sig.cards).toBe(52)
  expect(sig.pages).toBe(BigInt("41190027540742080000"))
})

test('HandSignature', ()=>{
  const sig = new numDeal.HandSignature(3,7)
  expect(sig.pages).toBe(BigInt(35))
  expect(sig.lastPage).toBe(BigInt(34))
})
