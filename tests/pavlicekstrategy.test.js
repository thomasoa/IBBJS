const pavlicek = require('../dest/numeric/pavlicek.js')

function signature1234() {
  // dommon signature for these tests
  return new book.DealSignature([1,2,3,4]) ;
}

test("Pavlicek strategy default signature", 
  () => {
    var pBook = new pavlicek.PavlicekStrategy()
    expect(pBook.signature.perSeat).toEqual([13,13,13,13])
  }
)



