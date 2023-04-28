import {modular_inverse,safe_mod, long_gcd} from '../dest/numeric/modinverse.js'

function int_mod_inverse(m,n) {
    var value = modular_inverse(BigInt(m),BigInt(n))
    //console.log('int_mod_inverse',m,n,value)
    return value
}

function int_safe_mod(m,n) {
    return safe_mod(BigInt(m),BigInt(n))
}

test('safe_mod when normal mod might return negative',()=>{
   expect(int_safe_mod(13,-3)).toBe(BigInt(1))
   expect(int_safe_mod(-13,3)).toBe(BigInt(2))
   expect(int_safe_mod(-13,-3)).toBe(BigInt(2))
})

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

test('Find gcd of 53644737765488792839237440000 and unit 13109994191499930367061460371',()=>{
    var m = BigInt('53644737765488792839237440000')
    var n = BigInt('13109994191499930367061460371')
    expect(long_gcd(m,n).gcd).toBe(BigInt(1))
    var inverse = modular_inverse(m,n)
    expect(inverse).toBeGreaterThan(BigInt(0))
    expect((inverse*n)%m).toBe(BigInt(1))
})
