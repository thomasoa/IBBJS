import { HandBook } from "../bridge/handbook"
import {FullHand} from '../basics/src/index'
import {
    HandStrategy,
    AndrewsHandStrategy,
    PavlicekHandStrategy,
    MultiplierScrambler,
    Scrambler,
    ScrambleStrategy,
    bridgeHandSignature,
    PageNumber
} from "../numeric/index"

function common_scrambler(): Scrambler {
    const multiplier = BigInt("13109994191499930367061460371")
    const translation = BigInt("34563463456363563565356345634")
    return new MultiplierScrambler(bridgeHandSignature.pages, multiplier, translation)
}

function pavlicekBook(): HandBook {
    const strategy = new PavlicekHandStrategy()
    return new HandBook(strategy)
}

function andrewsBook(): HandBook {
    // We use a seat map to match the original book
    const strategy = new AndrewsHandStrategy()
    return new HandBook(strategy)
}

function build_editions(): Map<string, HandBook> {
    const editions = new Map<string, HandBook>()
    editions.set("Pavlicek", pavlicekBook())
    editions.set("Andrews", andrewsBook())
    return editions
}

type EditionPage = {
    name: string,
    page: PageNumber
}

class BookSet {
    editions: Map<string, HandBook>

    constructor() {
        this.editions = build_editions()
    }

    names(): string[] {
        return Array.from(this.editions.keys())
    }

    edition(name: string): HandBook {
        const edition: HandBook | undefined = this.editions.get(name)
        if (edition) return edition
        throw new Error('Invalid edition name: ' + name)
    }

    book(name: string): HandBook {
        return this.edition(name)
    }

    pageNumbers(hand: FullHand): EditionPage[] {
        const pages = new Array<EditionPage>()
        this.editions.forEach((edition, name) => {
            const normalPage = edition.getPageNumber(hand)
            pages.push({ name: name, page: normalPage })
        })
        return pages
    }

    get lastPage(): PageNumber {
        return bridgeHandSignature.pages
    }
}

export { BookSet }