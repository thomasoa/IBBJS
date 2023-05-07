
interface LongGCDResult {
    gcd: bigint;
    quotients: bigint[]
}

// File constants
const zero = BigInt(0)
const one = BigInt(1)

function abs(value: bigint): bigint {
    if (value < BigInt(0)) {
        return -value
    } else {
        return value
    }
}

export function safe_mod(n1: bigint, n2: bigint): bigint {
    // Computes n1 % n2, but with values r in range
    // 0 <= r < abs(n2)
    // The % operator sometimes returns negative numbers
    n2 = abs(n2)
    const result = n1 % n2
    if (result < zero) {
        return result + n2
    } else {
        return result
    }
}

export function long_gcd(m: bigint, n: bigint): LongGCDResult {

    const quotients = Array<bigint>()
    m = abs(m)

    if (m == zero) {
        throw Error('long_gcd cannot be called when m is zero')
    }

    n = safe_mod(n, m)

    while (n != zero) {
        const q = m / n
        const r = m % n
        quotients.push(q)
        m = n
        n = r
    }
    return { gcd: m, quotients: quotients }
}

function buildInverseFromQuotients(quotients: bigint[]): bigint {
    // Standard algorithm for contiued fraction expansion
    // Numerators only needed.
    //
    // If m/n is a fraction, then the penultimate continued fraction for m/n, p/q,
    // satisfies np-mq= +/- 1, depending on the parity of the number of terms. So the
    // inverse with be +/- p. Here we compute the continued fraction numerators only.
    //
    let p_0 = zero, p_1 = one
    quotients.forEach((quotient) => {
        const p_new = p_1 * quotient + p_0
        p_0 = p_1; p_1 = p_new;
    })

    if (quotients.length % 2 == 1) {
        return p_0
    } else {
        return p_1 - p_0
    }
}

export function modular_inverse(modulus: bigint, unit: bigint): bigint {
    if (modulus < zero) {
        modulus = -modulus
    }
    unit = safe_mod(unit, modulus)
    const result = long_gcd(modulus, unit)
    if (result.gcd != one) {
        throw Error('Modulus ' + modulus
            + ' and unit ' + unit
            + ' are not relatively prime, gcd=' + result.gcd)
    }
    return buildInverseFromQuotients(result.quotients)
}
