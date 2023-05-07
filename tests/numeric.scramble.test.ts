import { MultiplierScrambler, scramble_book } from '../src/numeric/scramble'
import { AndrewsDealStrategy } from '../src/numeric/andrews'
import { DealSignature } from '../src/numeric/deal'

test('Multiplier scrambler', () => {
    var modulus = BigInt(11)
    var multiplier = BigInt(3)
    var translate = BigInt(7)
    var scrambler = new MultiplierScrambler(modulus, multiplier, translate)

    expect(scrambler.scramble(BigInt(1))).toBe(BigInt((1 * 3 + 7) % 11))
    expect(scrambler.scramble(BigInt(2))).toBe(BigInt((2 * 3 + 7) % 11))
    expect(scrambler.scramble(BigInt(0))).toBe(BigInt((0 * 3 + 7) % 11))

    for (var i = BigInt(0); i < modulus; i++) {
        expect(scrambler.unscramble(scrambler.scramble(i))).toBe(i)
    }
})

test('Multiplier with negative values', () => {
    var modulus = BigInt(-11)
    var multiplier = BigInt(-3)
    var translate = BigInt(-7)
    var scrambler = new MultiplierScrambler(modulus, multiplier, translate)
    expect(scrambler.scramble(BigInt(1))).toBe(BigInt((1 * (11 - 3) + (11 - 7)) % 11))
    expect(scrambler.scramble(BigInt(2))).toBe(BigInt((2 * (11 - 3) + (11 - 7)) % 11))
    for (var i = BigInt(0); i < modulus; i++) {
        expect(scrambler.unscramble(scrambler.scramble(i))).toBe(i)
    }
})

test("Scrambled book complete invertible for signature [2,2,2,2]", () => {
    var sig = new DealSignature([2, 2, 2, 2])
    var aBook = new AndrewsDealStrategy(sig)
    var sBook = scramble_book(aBook, BigInt(11 * 17 * 31), BigInt(1001))
    expect(sBook.pages).toBe(aBook.pages)
    expect(sBook.lastPage).toBe(aBook.lastPage)
    for (var page = BigInt(0); page < sig.pages; page++) {
        var deal = sBook.computePageContent(page)
        expect(sBook.computePageNumber(deal)).toBe(page)
    }
})
