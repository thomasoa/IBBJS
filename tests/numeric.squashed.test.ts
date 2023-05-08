import * as squashed from "../src/numeric/squashed"
import * as choose from "../src/numeric/choose"

test('encode 0,1,2,3,4', () => {
  expect(squashed.encode([0, 1, 2, 3, 4])).toBe(BigInt(0));
});

test('encode 0,1,2,3,5', () => {
  expect(squashed.encode([0, 1, 2, 3, 5])).toBe(BigInt(1));
});

test('encode 8,9,10', () => {
  expect(squashed.encode([8, 9, 10])).toBe(choose.choose(11, 3) - BigInt(1));
});

test('decode 0n, 5', () => {
  expect(squashed.decode(BigInt(0), 5)).toEqual([0, 1, 2, 3, 4])
});

test('decode choose(11,3)-1, 3', () => {
  const index = choose.choose(11, 3) - BigInt(1)
  expect(index).toBe(BigInt(164))
  expect(squashed.decode(index, 3)).toEqual([8, 9, 10])
});


