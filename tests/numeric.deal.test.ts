import * as  numDeal from '../dest/numeric/deal.js'

test('NumericDeal: Check hands for valid deal', () => {
    var sig = new numDeal.DealSignature([3, 3])
    var deal = new numDeal.NumericDeal(sig, [0, 0, 0, 1, 1, 1])
    expect(deal.hands[0]).toEqual([0, 1, 2])
    expect(deal.hands[1]).toEqual([3, 4, 5])
})

test('NumericDeal: throw error when wrong number of cards', () => {
    var sig = new numDeal.DealSignature([3, 3])
    expect(() => new numDeal.NumericDeal(sig, [0, 0, 0, 1, 1])).toThrowError()
})

test('DealStrategy: check .pages and .bits', () => {
    var sig = new numDeal.DealSignature([3, 3])
    expect(sig.pages).toBe(BigInt(20))
    expect(sig.bits).toBe(5)
})

test('NumericDeal: throw error when wrong seat number in deal', () => {
    var sig = new numDeal.DealSignature([3, 3])
    expect(() => new numDeal.NumericDeal(sig, [2, 2, 2, 2, 2, 2])).toThrowError()

})

test('NumericDeal throw error when wrong number of cards for a seat', () => {
    var sig = new numDeal.DealSignature([3, 3])
    expect(() => new numDeal.NumericDeal(sig, [1, 1, 1, 1, 0, 0])).toThrowError()
})

test('DealSignature.equal()', () => {
    var sig = new numDeal.DealSignature([3, 3])
    expect(sig.equals(sig)).toBeTruthy()
    var sigSame = new numDeal.DealSignature([3, 3])
    expect(sig.equals(sigSame)).toBeTruthy()
    var sigSeats = new numDeal.DealSignature([2, 2, 2])
    expect(sig.equals(sigSeats)).toBeFalsy()
    var sigCounts = new numDeal.DealSignature([2, 4])
    expect(sig.equals(sigCounts)).toBeFalsy()
})

test('DealSignatture.assertEqual()', () => {
    var sig = new numDeal.DealSignature([3, 3])
    var sigSeats = new numDeal.DealSignature([2, 2, 2])
    var sigCounts = new numDeal.DealSignature([2, 4])
    expect(sig.assertEqual(sig))

    expect(() => sig.assertEqual(sigSeats)).toThrowError()
    expect(() => sig.assertEqual(sigCounts, 'msg')).toThrowError()


})

test('DealSignature.toString', () => {
    var sig = new numDeal.DealSignature([3, 3])
    expect(sig.toString()).toBe('DealSignature(3,3)')
    var defSig = new numDeal.DealSignature([13, 13, 13, 13])
    expect(defSig.toString()).toBe('DealSignature(13,13,13,13)')
})

test('HandSignature.pages',() => {
    expect(new numDeal.HandSignature(2,5).pages).toBe(BigInt(10))
    expect(new numDeal.HandSignature(6,5).pages).toBe(BigInt(0))
})

test('HandSignature.assertValidPage',() => {
    const strategy = new numDeal.HandSignature(2,5)
    expect(strategy.assertValidPage(BigInt(0))).toBeUndefined()
    expect(strategy.assertValidPage(BigInt(9))).toBeUndefined()
    expect(() => strategy.assertValidPage(BigInt(10))).toThrow()
    expect(() => strategy.assertValidPage(BigInt(-1))).toThrow()
})

test('HandSignature.assertValidHand',() => {
    const strategy = new numDeal.HandSignature(2,5)
    expect(strategy.assertValidHand([0,4])).toBeUndefined()
    expect(() => strategy.assertValidHand([1])).toThrow()
    expect(() => strategy.assertValidHand([2,3,4])).toThrow()
    expect(() => strategy.assertValidHand([0,5])).toThrow()
    expect(() => strategy.assertValidHand([-1,4])).toThrow()
    expect(() => strategy.assertValidHand([4,0])).toThrow()
})


