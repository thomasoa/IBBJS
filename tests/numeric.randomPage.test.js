import {randomPageNumber} from '../dest/numeric/randomPage.js'
import { DealSignature,bridgeSignature } from '../dest/numeric/deal.js'

test('randomPageNumber trials',()=>{
    const sig = new DealSignature([1,1,1,1])
    for (let i=0; i<1000; i++) {
        const value = randomPageNumber(sig)
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(sig.pages)
    }
})

test('randomPageNumber default - probabilistic test, low probability of false failure',()=>{
    var max = BigInt(0)
    for (let i=0; i<1000; i++) {
        var value = randomPageNumber()
        if (value>max) {
            max = value
        }
    }
    expect(max).toBeGreaterThan(BigInt(2)**BigInt(94))
    expect(max).toBeLessThan(bridgeSignature.pages)
})
