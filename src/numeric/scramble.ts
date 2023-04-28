// A crude way to create scrambled deal strategies
import { modular_inverse, safe_mod} from "./modinverse.js";
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
        this.scramble  = (pageNo:PageNumber) => safe_mod(pageNo *multiplier+translate,pages)
        this.unscramble = (pageNo:bigint) => safe_mod((pageNo-translate)*inverse,pages)
    }
}

class ScrambleStrategy {
    base:BookStrategy;
    scrambler:Scrambler;

    constructor(baseStrategy:BookStrategy, scrambler:Scrambler) {
        this.base = baseStrategy
        this.scrambler = scrambler
    }

    get signature():DealSignature { return this.base.signature} 
    get pages():PageNumber { return this.base.pages }
    get lastPage():PageNumber { return this.base.lastPage }

    computePageContent(pageNo:PageNumber):NumericDeal {
        var basePage = this.scrambler.scramble(pageNo)
        return this.base.computePageContent(basePage)
    }

    computePageNumber(deal:NumericDeal):PageNumber {
        var basePage = this.base.computePageNumber(deal)
        return this.scrambler.unscramble(basePage)
    }
}

function scramble_book(base:BookStrategy,multiplier:bigint,translate:bigint):BookStrategy {
    var scrambler = new MultiplierScrambler(base.signature.pages,multiplier,translate)
    return new ScrambleStrategy(base,scrambler)
}

export {Scrambler, MultiplierScrambler, ScrambleStrategy, scramble_book}