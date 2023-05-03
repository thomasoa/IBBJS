const numDeal = require('../dest/numeric/deal.js')

test('NumericDeal: Check hands for valid deal',() => {
    var sig = new numDeal.DealSignature([3,3])
    var deal = new numDeal.NumericDeal(sig,[0,0,0,1,1, 1])
    expect(deal.hands[0]).toEqual([0,1,2])
    expect(deal.hands[1]).toEqual([3,4,5])
})

test('NumericDeal: throw error when wrong number of cards',() => {
    var sig = new numDeal.DealSignature([3,3])
    expect(() => new numDeal.NumericDeal(sig,[0,0,0,1,1])).toThrowError()   
})

test('NumericDeal: throw error when wrong seat number in deal',() => {
    var sig = new numDeal.DealSignature([3,3])
    expect(() => new numDeal.NumericDeal(sig,[2,2,2,2,2,2])).toThrowError()   
    
})

test('NumericDeal throw error when wrong number of cards for a seat', ()=> {
    var sig = new numDeal.DealSignature([3,3])
    expect(() => new numDeal.NumericDeal(sig,[1,1,1,1,0,0])).toThrowError()   
})

test('DealSignature.equal()', ()=>{
    var sig = new numDeal.DealSignature([3,3])
    expect(sig.equals(sig)).toBeTruthy()
    var sigSame = new numDeal.DealSignature([3,3])
    expect(sig.equals(sigSame)).toBeTruthy()
    var sigSeats = new numDeal.DealSignature([2,2,2])
    expect(sig.equals(sigSeats)).toBeFalsy()
    var sigCounts = new numDeal.DealSignature([2,4])
    expect(sig.equals(sigCounts)).toBeFalsy()
})

test('DealSignatture.assertEqual()',()=>{
    var sig = new numDeal.DealSignature([3,3])
    var sigSeats = new numDeal.DealSignature([2,2,2])
    var sigCounts = new numDeal.DealSignature([2,4])

    expect(() => sig.assertEqual(sigSeats)).toThrowError()
    expect(() => sig.assertEqual(sigCounts,'msg')).toThrowError()


})