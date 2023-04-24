import { choose } from "./choose.js";

function encode(sortedValues: number[]):bigint {
    const binomials:bigint[] = sortedValues.map(
        (value:number, index:number):bigint => choose(value,index+1)
    )
    return binomials.reduce(
        (sum:bigint,current:bigint):bigint => sum+current
    )
}

function decode(value:bigint, n:number): number[] {
    return [1]
}

export {encode}
