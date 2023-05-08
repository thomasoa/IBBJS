// A crude way to create scrambled deal strategies
import { modular_inverse, safe_mod} from "./modinverse";
import { DealStrategy, PageNumber, NumericDeal, DealSignature} from "./deal";

type PageTransform = (pageNo:PageNumber) => PageNumber;

interface Scrambler {
    scramble: PageTransform 
    unscramble: PageTransform    
}


class MultiplierScrambler {
    scramble: PageTransform 
    unscramble: PageTransform
    constructor(pages:bigint,multiplier:bigint,translate:bigint) {
        const inverse = modular_inverse(pages,multiplier)
        this.scramble  = (pageNo:PageNumber) => safe_mod(pageNo *multiplier+translate,pages)
        this.unscramble = (pageNo:bigint) => safe_mod((pageNo-translate)*inverse,pages)
    }
}

class ScrambleStrategy {
    base:DealStrategy;
    scrambler:Scrambler;
    
    constructor(baseStrategy:DealStrategy, scrambler:Scrambler) {
        this.base = baseStrategy
        this.scrambler = scrambler
    }
    
    get signature():DealSignature { return this.base.signature} 
    get pages():PageNumber { return this.base.pages }
    get lastPage():PageNumber { return this.base.lastPage }
    
    computePageContent(pageNo:PageNumber):NumericDeal {
        const basePage = this.scrambler.scramble(pageNo)
        return this.base.computePageContent(basePage)
    }
    
    computePageNumber(deal:NumericDeal):PageNumber {
        const basePage = this.base.computePageNumber(deal)
        return this.scrambler.unscramble(basePage)
    }
}

function scramble_book(base:DealStrategy,multiplier:bigint,translate:bigint):DealStrategy {
    const scrambler = new MultiplierScrambler(base.signature.pages,multiplier,translate)
    return new ScrambleStrategy(base,scrambler)
}

export {Scrambler, MultiplierScrambler, ScrambleStrategy, scramble_book}