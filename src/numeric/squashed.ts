import { choose } from "./choose.js";

function encode(sortedValues: readonly number[]):bigint {
    const binomials:bigint[] = sortedValues.map(
        (value:number, index:number):bigint => choose(value,index+1)
    )
    return binomials.reduce(
        (sum:bigint,current:bigint):bigint => sum+current
    )
}

function largestLessThan(index:bigint, n:number): number {
    var k:number = n-1
    while (choose(k+1,n)<=index) {
        k = k+1
    }
    return k
}

function decode(index:bigint, n:number): number[] {
    const result = Array(n)
    while (n>0) {
        result[n-1]=largestLessThan(index, n)
        index -= choose(result[n-1],n)
        n = n-1
    }
    return result
}

export {encode, decode}
