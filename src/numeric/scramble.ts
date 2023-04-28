// A crude way to create scrambled deal strategies
import { modular_inverse } from "./modinverse.js";
import { BookStrategy, PageNumber, NumericDeal, DealSignature} from "./deal.js";

type PageTransform = (pageNo:PageNumber) => PageNumber;

interface Scrambler {
    scramble: PageTransform 
    unscramble: PageTransform    
}

function safe_mod(n1:bigint,n2:bigint): bigint {
    // The % operator sometimes returns negative numbers
    const zero = BigInt(0)
    if (n2<zero) {
        n2 = -n1
    }
    var result = n1%n2
    if (result < zero) {
        return result+n2
    } else {
        return result
    }
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