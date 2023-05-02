
interface LongGCDResult {
    gcd:bigint;
    quotients:bigint[]
}

export function safe_mod(n1:bigint,n2:bigint): bigint {
    // Computes n1 % n2, but with values r in range
    // 0 <= r < abs(n2)
    // The % operator sometimes returns negative numbers
    const zero = BigInt(0)
    if (n2<zero) {
        n2 = -n2
    }
    var result = n1%n2
    if (result < zero) {
        return result+n2
    } else {
        return result
    }
}


export function long_gcd(m:bigint,n:bigint):LongGCDResult {
    
    var quotients = Array<bigint>()
    var zero = BigInt(0)
    if (m<zero) {
        m = -m
    }
    
    if (m==zero) {
        throw Error('long_gcd cannot be called when m is zero')
    }
    
    n = safe_mod(n,m)
    
    if (n==zero) {
        return {gcd: m, quotients: quotients}
    }
    
    while (true) {
        var q = m/n
        var r = m % n
        if (r==zero) {
            return {gcd: n, quotients: quotients}
        }
        quotients.push(q)
        m = n
        n = r
    }
}

export function modular_inverse(modulus:bigint, unit:bigint):bigint {
    var zero = BigInt(0), one = BigInt(1)
    
    if (modulus<zero) {
        modulus = -modulus
    }
    unit = safe_mod(unit, modulus)
    
    if (unit == zero) {
        throw Error('Unit ' + unit + ' is divible by the modulus '+modulus)
    }
    const result = long_gcd(modulus,unit)
    if (result.gcd != one) {
        throw Error('Modulus ' + modulus
                    + ' and unit '+ unit 
                    + ' are not relatively prime, gcd='+result.gcd)
    }
    var p_0=zero, p_1 = one, q_0 = one, q_1= zero
    result.quotients.forEach((quotient)=>{
        var p_new = p_1*quotient + p_0
        var q_new = q_1*quotient + q_0
        p_0=p_1 ; p_1=p_new; q_0=q_1; q_1=q_new
    })
    if (result.quotients.length % 2 == 0) {
        return p_1
    } else {
        return modulus-p_1
    }
    
}
