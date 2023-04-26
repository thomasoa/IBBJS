import { NumericDeal, AndrewsStrategy, BookStrategy, PavlicekStrategy,scramble_book} from "./numeric/book.js"

function make_scrambler():(BookStrategy)=>(BookStrategy) {
  var multiplier = BigInt("13109994191499930367061460371")
  var translation = BigInt("34563463456363563565356345634")
  return (book) => scramble_book(book,multiplier,translation)
}

interface BookInfo {
    edition: string;
    scrambled: boolean;
    title: string;
}

interface ProducedDeal {
    deal: NumericDeal,
    bookInfo: BookInfo,
    pageNo: bigint,
    index: number
}

type ProducedDealCallback = (dealEvent:ProducedDeal)=> any

class Model {
    readonly books:Map<string,Array<BookStrategy>>
    readonly callbacks = {
        updateCurrentDeal: new Array<ProducedDealCallback>(),
        updateDealCount: new Array<()=>any>()
    }

    readonly deals = new Array<ProducedDeal>()
    constructor() {
        var scrambler = make_scrambler()
        var andrewsBook = new AndrewsStrategy(undefined /* default*/)
        var pavlicekBook = new PavlicekStrategy(undefined)
        this.books = new Map<string,Array<BookStrategy>>([
           ['Andrews',[andrewsBook,scrambler(andrewsBook)]],
           ['Pavlicek',[pavlicekBook,scrambler(pavlicekBook)]] 
        ])
    }

    editionNames():Array<string> {
        return Array.from(this.books.keys())
    }
}

export {Model}