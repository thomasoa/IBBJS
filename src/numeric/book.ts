//  An entirely numeric version of the book
import {choose, multinomial} from "./choose.js"
import {decode, encode} from './squashed.js'

interface SeatFactor {
    quotient:bigint;
    seat: number;
    cards: number;
}

function computeFactors(cardsPer:number[]): SeatFactor[] {
    var totalCards:number = 0
    var totalProduct = BigInt(1)
    var oldProduct = BigInt(1)
    const result:SeatFactor[] = cardsPer.map(
        (cards:number,seat:number) => {
            totalCards += cards;
            oldProduct = totalProduct;
            totalProduct *= choose(totalCards,cards)
            
            return {quotient: oldProduct, seat: seat, cards:cards}
        }
    )
    return result.slice(1).reverse()

}

function updateSequence(
    seat:number,
    sequence: number[],
    toWhom:number[],
    remaining: number[]
):number[] {
    const newRemaining = Array<number>(remaining.length-sequence.length)
    var iSeq = 0
    var iNewRemaining = 0
    for(var i=0; i<remaining.length; i++) {
        if (iSeq<sequence.length && sequence[iSeq]==i) {
            toWhom[remaining[i]] = seat
            iSeq++
        } else {
            newRemaining[iNewRemaining] = remaining[i]
            iNewRemaining++
        }
    }
    return newRemaining
}

class SequenceBuilder {
    seat: number;
    sequence: Array<number>;
    seqIdx: number;
    afterIndex: number;

    constructor(seat:number, cards: number) {
        this.seat = seat
        this.sequence = Array<number>(cards)
        this.seqIdx = 0
        this.afterIndex = 0
    }

    nextItem(card:number, whom:number): void {
        if (whom == this.seat) {
            this.sequence[this.seqIdx] = this.afterIndex
            this.seqIdx ++
        }
        if (whom <= this.seat) {
            this.afterIndex++
        }
    }
}

export class NumericBook {
    seats:number;
    cards:number;
    perSeat:number[];
    pages:bigint;
    factors:SeatFactor[];
    

    constructor(cardsPerSeat:number[]) {
        this.perSeat = cardsPerSeat
        this.seats = cardsPerSeat.length
        this.cards = cardsPerSeat.reduce(
            (total:number, nextVal:number) => total + nextVal
        )
        this.pages = multinomial(cardsPerSeat);
        this.factors = computeFactors(this.perSeat)
    }

    lastPage(): bigint {
        return this.pages-BigInt(1)
    }

    computePageNumber(toWhom:number[]):bigint {
        var sequences: Array<SequenceBuilder>=Array<SequenceBuilder>(this.seats-1);
        for (var i=1; i<this.seats; i++) {
            sequences[i-1]=new SequenceBuilder(i,this.perSeat[i])
        }
        toWhom.forEach((whom,card) => 
            sequences.forEach((builder) => builder.nextItem(card,whom))
        )
        var sum:bigint = BigInt(0)
        this.factors.forEach(
            (factor) => {
                var builder = sequences[factor.seat-1]
                var seqNo = encode(builder.sequence)
                sum += seqNo * factor.quotient
            }
        )
        return sum
    }

    computePageContent(pageNo:bigint): number[] {
        if (pageNo < BigInt(0) || pageNo>= this.pages) {
            throw new Error("Invalid page number pageNo outside range <="+this.pages.toString())
        }
        var toWhom: number[] = Array<number>(this.cards)
        for (var card = 0; card<this.cards; card++) {
            toWhom[card] = 0
        }

        var indices = toWhom.map((val,index) => index)
        this.factors.forEach(
            (factor:SeatFactor) => {
                // console.log(factor,indices,toWhom)
                var seatIndex:bigint = pageNo / factor.quotient
                pageNo = pageNo % factor.quotient
                var sequence: number[] = decode(seatIndex,factor.cards)
                indices = updateSequence(factor.seat,sequence,toWhom,indices)

            }
        )
        return toWhom
    }
}