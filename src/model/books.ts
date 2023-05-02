import {BridgeBook, SeatMap,Deal} from "../bridge/index.js"
import {Seats} from "../bridge/constants.js"
import {
    BookStrategy, 
    AndrewsStrategy, 
    PavlicekStrategy, 
    scramble_book
}  from "../numeric/index.js"

function scramble(strategy:BookStrategy):BookStrategy {
    var multiplier = BigInt("13109994191499930367061460371")
    var translation = BigInt("34563463456363563565356345634")
    return scramble_book(strategy,multiplier,translation)
}

interface Edition { 
    normal: BridgeBook, 
    scrambled: BridgeBook 
}

function edition(book:BridgeBook):Edition {
    var scrambledStrat:BookStrategy = scramble(book.strategy)
    var scrambled = new BridgeBook(scrambledStrat, book.seatMap, book.cardMap)
    return {normal: book, scrambled: scrambled }
}

function pavlicekBook():BridgeBook {
    var strategy = new PavlicekStrategy(undefined)
    return new BridgeBook(strategy,undefined,undefined)
}

function andrewsBook():BridgeBook {
    var strategy = new AndrewsStrategy(undefined)
    var seatMap:SeatMap = (seatNumber) => Seats.all[3-seatNumber]
    return new BridgeBook(strategy,seatMap,undefined)
}

function build_editions():Map<string,Edition> {
    var editions = new Map<string,Edition>()
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
        var edition = this.editions.get(name)
        if (scrambled) {
            return edition.scrambled
        } else {
            return edition.normal
        }
    }
    
    getBookPage(name:string, scrambled:boolean, pageNo:bigint):Deal {
        return this.book(name,scrambled).getDeal(pageNo)
    }
}
export {BookSet}