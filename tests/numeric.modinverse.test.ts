import { modular_inverse, safe_mod, long_gcd } from "../src/numeric/modinverse"

function int_mod_inverse(m, n) {
    const value = modular_inverse(BigInt(m), BigInt(n))
    return value
}

function int_safe_mod(m, n) {
    return safe_mod(BigInt(m), BigInt(n))
}

test('safe_mod when normal mod might return negative', () => {
    expect(int_safe_mod(13, -3)).toBe(BigInt(1))
    expect(int_safe_mod(-13, 3)).toBe(BigInt(2))
    expect(int_safe_mod(-13, -3)).toBe(BigInt(2))
})

test('long_gcd with negative values', () => {
    const result = long_gcd(BigInt(-8), BigInt(-3));
    expect(result.gcd).toBe(BigInt(1))
    expect(result.quotients).toEqual([BigInt(1), BigInt(1), BigInt(1), BigInt(2)])
})

test('long_gcd with n divivisble by m', () => {
    const result = long_gcd(BigInt(6), BigInt(12))
    expect(result.gcd).toBe(BigInt(6))
    expect(result.quotients).toEqual([])
})

test('long_gcd throws error when m is zero', () => {
    expect(() => long_gcd(BigInt(0), BigInt(1))).toThrow()
})

test('Inverse of 3 modulo 7', () => {
    expect(int_mod_inverse(7, 3)).toBe(BigInt(5))
})

test('Expect error when unit is divisible by modulus', () => {
    expect(() => int_mod_inverse(7, 14)).toThrow()
})

test('Expect throw when unit is not relatively prime to modulus', () => {
    expect(() => int_mod_inverse(12, 4)).toThrow()
})

test('Expect inverse of 34 modulo 55 is 34', () => {
    expect(int_mod_inverse(55, 34)).toEqual(BigInt(34))
})

test('mod_inverse when unit is zero in the modulus', () => {
    expect(() => int_mod_inverse(2, 0)).toThrow()
})

test('Find gcd of 53644737765488792839237440000 and unit 13109994191499930367061460371', () => {
    const m = BigInt('53644737765488792839237440000')
    const n = BigInt('13109994191499930367061460371')
    expect(long_gcd(m, n).gcd).toBe(BigInt(1))
    const inverse = modular_inverse(m, n)
    expect(inverse).toBeGreaterThan(BigInt(0))
    expect((inverse * n) % m).toBe(BigInt(1))
})
