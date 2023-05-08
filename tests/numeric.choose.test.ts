import * as choose from "../src/numeric/choose"

test('10 choose 5 = 252', () => {
  expect(choose.choose(10, 5)).toBe(BigInt(252));
});

test('10 choose 2,3,4,1', () => {
  expect(choose.multinomial([2, 3, 4, 1])).toEqual(BigInt(12600))
})

test('52 choose 13,13,13,13', () => {
  expect(choose.multinomial([13, 13, 13, 13])).toEqual(
    BigInt('53644737765488792839237440000')
  )
})

test('11 choose 5 bigger than cache', () => {
  const cache = new choose.ChooseCache(10)
  expect(cache.choose(11, 5)).toBe(BigInt(462))
})
