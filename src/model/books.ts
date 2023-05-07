import { BridgeBook, SimpleBijection, Deal, Seat, Seats } from "../bridge/index"
import {
    DealStrategy,
    AndrewsDealStrategy,
    PavlicekDealStrategy,
    MultiplierScrambler,
    Scrambler,
    bridgeSignature,
    ScrambleStrategy,
    PageNumber
} from "../numeric/index"

function common_scrambler(): Scrambler {
    const multiplier = BigInt("13109994191499930367061460371")
    const translation = BigInt("34563463456363563565356345634")
    return new MultiplierScrambler(bridgeSignature.pages, multiplier, translation)
}

interface Edition {
    normal: BridgeBook,
    scrambled: BridgeBook
}

function edition(book: BridgeBook, scrambler: Scrambler): Edition {
    const scrambledStrat: DealStrategy = new ScrambleStrategy(book.strategy, scrambler)
    const scrambled = new BridgeBook(scrambledStrat, book.seatBijection, book.cardBijection)
    return { normal: book, scrambled: scrambled }
}

function pavlicekBook(): BridgeBook {
    const strategy = new PavlicekDealStrategy()
    return new BridgeBook(strategy)
}

function andrewsBook(): BridgeBook {
    // We use a seat map to match the original book
    const strategy = new AndrewsDealStrategy()
    const seatBijection = new SimpleBijection<Seat>(Seats.all, (seatNumber) => 3 - seatNumber)

    return new BridgeBook(strategy, seatBijection)
}

function build_editions(scrambler: Scrambler): Map<string, Edition> {
    const editions = new Map<string, Edition>()
    editions.set("Pavlicek", edition(pavlicekBook(), scrambler))
    editions.set("Andrews", edition(andrewsBook(), scrambler))
    return editions
}

type EditionPage = {
    name: string,
    normal: PageNumber,
    scrambled: PageNumber
}

class BookSet {
    editions: Map<string, Edition>
    scrambler: Scrambler

    constructor() {
        this.scrambler = common_scrambler()
        this.editions = build_editions(this.scrambler)
    }

    names(): string[] {
        return Array.from(this.editions.keys())
    }

    edition(name: string): Edition {
        const edition: Edition | undefined = this.editions.get(name)
        if (edition) return edition
        throw new Error('Invalid edition name: ' + name)
    }

    book(name: string, scrambled: boolean = false): BridgeBook {
        const edition: Edition = this.edition(name)

        if (scrambled) {
            return edition.scrambled
        } else {
            return edition.normal
        }
    }

    unscramble(pageNo: PageNumber): PageNumber {
        // Scrambler uses page numbers strting at zero
        const one = BigInt(1)
        return this.scrambler.unscramble(pageNo - one) + one
    }

    pageNumbers(deal: Deal): EditionPage[] {
        const pages = new Array<EditionPage>()
        this.editions.forEach((edition, name) => {
            const normalPage = edition.normal.getPageNumber(deal)
            const scramblePage = this.unscramble(normalPage)
            pages.push({ name: name, normal: normalPage, scrambled: scramblePage })
        })
        return pages
    }

    get lastPage(): PageNumber {
        return bridgeSignature.pages
    }
}

export { BookSet }