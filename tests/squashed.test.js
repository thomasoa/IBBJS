var squashed = require('../dest/numeric/squashed.js')

test('encode 0,1,2,3,4', () => {
  expect(squashed.encode([0,1,2,3,4])).toBe(BigInt(0));
});
