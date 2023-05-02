import {randomPageNumber} from '../dest/numeric/randomPage.js'
import { DealSignature } from '../dest/numeric/deal.js'

test('randomPageNumber trials',()=>{
    const sig = new DealSignature([1,1,1,1])
    for (let i=0; i<1000; i++) {
        const value = randomPageNumber(sig)
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(sig.pages)
    }
})
