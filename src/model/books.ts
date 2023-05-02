import {BridgeBook, SeatMap,Deal} from "../bridge/index.js"
import {Seats} from "../bridge/constants.js"
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
    const scrambled = new BridgeBook(scrambledStrat, book.seatMap, book.cardMap)
    return {normal: book, scrambled: scrambled }
}

function pavlicekBook():BridgeBook {
    const strategy = new PavlicekStrategy(undefined)
    return new BridgeBook(strategy,undefined,undefined)
}

function andrewsBook():BridgeBook {
    const strategy = new AndrewsStrategy(undefined)
    const seatMap:SeatMap = (seatNumber) => Seats.all[3-seatNumber]
    return new BridgeBook(strategy,seatMap,undefined)
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

    book(name:string, scrambled:boolean):BridgeBook {
        const edition:Edition = this.editions.get(name)
        if (scrambled) {
            return edition.scrambled
        } else {
            return edition.normal
        }
    }
}
export {BookSet}