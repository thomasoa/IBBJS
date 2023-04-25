import {DealSignature, signature_or_default, NumericDeal} from './deal.js'

class PavlicekStrategy {
    signature:DealSignature

    constructor(signature:DealSignature) {
        this.signature = signature_or_default(signature)
    }

}

export {PavlicekStrategy}