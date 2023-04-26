// A crude way to create scrambled deal strategies
import { modular_inverse } from "./modinverse.js";
import { BookStrategy, PageNumber, NumericDeal, DealSignature} from "./deal.js";

type PageTransform = (pageNo:PageNumber) => PageNumber;

interface Scrambler {
    scramble: PageTransform 
    unscramble: PageTransform    
}

class MultiplierScrambler {
    scramble: PageTransform 
    unscramble: PageTransform
    constructor(pages:bigint,multiplier:bigint,translate:bigint) {
        var inverse = modular_inverse(pages,multiplier)
        this.scramble  = (pageNo:PageNumber) => (pageNo *multiplier+translate)%pages
        this.unscramble = (pageNo:bigint) => ((pageNo-translate)*inverse)%pages
    }
}

class ScrambleStrategy {
    base:BookStrategy;
    signature:DealSignature;
    scrambler:Scrambler;

    constructor(baseStrategy:BookStrategy, scrambler:Scrambler) {
        this.signature = baseStrategy.signature
        this.base = baseStrategy
        this.scrambler = scrambler
    }

    computePageContent(pageNo:PageNumber):NumericDeal {
        var basePage = this.scrambler.scramble(pageNo)
        return this.base.computePageContent(basePage)
    }

    computePageNumber(deal:NumericDeal):PageNumber {
        var basePage = this.base.computePageNumber(deal)
        return this.scrambler.unscramble(basePage)
    }
}

export {MultiplierScrambler, ScrambleStrategy}