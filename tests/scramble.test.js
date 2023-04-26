import {MultiplierScrambler, ScrambleStrategy} from '../dest/numeric/scramble.js'
import {AndrewsStrategy} from '../dest/numeric/andrews.js'

test('Multiplier scrambler',() => {
    var modulus = BigInt(11)
    var multiplier = BigInt(3)
    var translate = BigInt(7)
    var scrambler = new MultiplierScrambler(modulus,multiplier,translate)
    expect(scrambler.scramble(BigInt(0))).toBe(BigInt(7))

    for (var i=BigInt(0); i<modulus; i++) {
        expect(scrambler.unscramble(scrambler.scramble(i))).toBe(i)
    }
})