//  An entirely numeric version of the book
import {choose, multinomial} from "./choose.js"
import {decode} from './squashed.js'

export class NumericBook {
    seats:number;
    cards:number;
    perSeat:number[];
    pages:bigint;
    

    constructor(cardsPerSeat:number[]) {
        this.perSeat = cardsPerSeat
        this.seats = cardsPerSeat.length
        this.cards = cardsPerSeat.reduce(
            (total:number, nextVal:number) => total + nextVal
        )
        this.pages = multinomial(cardsPerSeat);
    }
}