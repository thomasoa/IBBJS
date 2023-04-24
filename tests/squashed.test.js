var squashed = require('../dest/numeric/squashed.js')
var choose = require('../dest/numeric/choose.js')

test('encode 0,1,2,3,4', () => {
  expect(squashed.encode([0,1,2,3,4])).toBe(BigInt(0));
});

test('encode 0,1,2,3,5', () => {
  expect(squashed.encode([0,1,2,3,5])).toBe(BigInt(1));
});

test('encode 8,9,10', () => {
  expect(squashed.encode([8,9,10])).toBe(choose.choose(11,3)-BigInt(1));
});
