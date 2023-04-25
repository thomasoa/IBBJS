import {
    DealSignature, signature_or_default, NumericDeal, 
    CardNumber, HandArray, SeatNumber, PageNumber // types
} from './deal.js'

class PavlicekStrategy {
    readonly signature:DealSignature

    constructor(signature:DealSignature|undefined) {
        this.signature = signature_or_default(signature)
    }

}

export {PavlicekStrategy}