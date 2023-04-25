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