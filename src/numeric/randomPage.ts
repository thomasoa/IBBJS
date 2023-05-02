var  random = require( "./random.js")
import { bridgeSignature, DealSignature } from "./deal.js"

export function randomPageNumber(signature:DealSignature = bridgeSignature):bigint {
    const bits = signature.bits
    while (true) {
        const value = random(bits)
        if (value<signature.pages) {
            return value
        }
    }
}

