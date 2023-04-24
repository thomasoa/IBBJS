var choose = require('../src/choose')

test('10 choose 5 = 252', () => {
  expect(choose.choose(10, 5)).toBe(BigInt(252));
});


