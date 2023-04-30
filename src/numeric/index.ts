//  Just a single source library for all you need to import
// from this numeric directory for the Impossible Bridge Book.
import {DealSignature, BookStrategy, NumericDeal, 
    PageNumber,CardNumber,SeatNumber} from "./deal.js"
import {AndrewsStrategy} from "./andrews.js"
import { PavlicekStrategy } from "./pavlicek.js"
import { scramble_book } from "./scramble.js"

export {
    DealSignature, NumericDeal, 
    AndrewsStrategy, PavlicekStrategy, // Classes
    BookStrategy,  // interface
    PageNumber,CardNumber,SeatNumber, // Types
    scramble_book  // Function
}