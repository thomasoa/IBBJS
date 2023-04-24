import { choose } from "./choose.js";

function encode(sortedValues: Array<number>):bigint {
    const binomials:bigint[] = sortedValues.map(
        (value:number, index:number):bigint => choose(value,index+1)
    )
    return binomials.reduce(
        (sum:bigint,current:bigint):bigint => sum+current
    )
}

export {encode}
