var mod_inverse = require( '../dest/numeric/modinverse.js').modular_inverse
var int_mod_inverse = (m,u) => mod_inverse(BigInt(m),BigInt(u))

test('Inverse of 3 modulo 7',() => {
    expect(int_mod_inverse(7,3)).toBe(BigInt(5))
})

test('Expect error when unit is divisible by modulus',()=>{
    expect(()=> mod_inverse(7,14)).toThrow()
})

test('Expect throw when unit is not relatively prime to modulus', () => {
    expect(() => int_mod_inverse(12,4)).toThrow()
})

test('Expect inverse of 34 modulo 55 is 34', () => {
    expect(int_mod_inverse(55,34)).toEqual(BigInt(34))
})
