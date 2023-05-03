import {BridgeBook,SimpleBijection ,Deal} from "../bridge/index.js"
import {Seats, Seat} from "../bridge/constants.js"
import {
    BookStrategy, 
    AndrewsStrategy, 
    PavlicekStrategy, 
    scramble_book
}  from "../numeric/index.js"

function scramble(strategy:BookStrategy):BookStrategy {
    // Copied from original Impossible Bridge Book
    const multiplier = BigInt("13109994191499930367061460371")
    const translation = BigInt("34563463456363563565356345634")
    return scramble_book(strategy,multiplier,translation)
}

interface Edition { 
    normal: BridgeBook, 
    scrambled: BridgeBook 
}

function edition(book:BridgeBook):Edition {
    const scrambledStrat:BookStrategy = scramble(book.strategy)
    const scrambled = new BridgeBook(scrambledStrat, book.seatBijection, book.cardBijection)
    return {normal: book, scrambled: scrambled }
}

function pavlicekBook():BridgeBook {
    const strategy = new PavlicekStrategy()
    return new BridgeBook(strategy)
}

function andrewsBook():BridgeBook {
    const strategy = new AndrewsStrategy()
    const seatBijection = new SimpleBijection<Seat>(Seats.all, (seatNumber) => 3-seatNumber)
    
    return new BridgeBook(strategy,seatBijection)
}

function build_editions():Map<string,Edition> {
    const editions = new Map<string,Edition>()
    editions.set("Pavlicek",edition(pavlicekBook()))
    editions.set("Andrews",edition(andrewsBook()))
    return editions
}

class BookSet {
    editions: Map<string,Edition>;
    
    constructor() {
        this.editions = build_editions()
    }
    
    names():string[] {
        return Array.from(this.editions.keys())
    }

    edition(name:string):Edition {
        const edition:Edition|undefined = this.editions.get(name)
        if (edition) return edition
        throw new Error('Invalid edition name: '+name)
    }
    
    book(name:string, scrambled:boolean):BridgeBook {
        const edition:Edition = this.edition(name)

        if (scrambled) {
            return edition.scrambled
        } else {
                return edition.normal
        }
    }
}
export {BookSet}