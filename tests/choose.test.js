var choose = require( '../dest/numeric/choose.js')

test('10 choose 5 = 252', () => {
  expect(choose.choose(10, 5)).toBe(BigInt(252));
});

test('10 choose 2,3,4,1', () => {
  expect(choose.multinomial([2,3,4,1])).toEqual(BigInt(12600))
})

test('52 choose 13,13,13,13', ()=> {
  expect(choose.multinomial([13,13,13,13])).toEqual(
    BigInt('53644737765488792839237440000')
  )
})
