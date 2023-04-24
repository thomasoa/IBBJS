import { ChooseCache } from '../src/choose'

describe('Test index file', () => {
    test('10 choose 5', () => {
      const c = new ChooseCache(10)
      expect(c.choose(10,5)).toBe(BigInt(252))
    });
  });
  