//  An entirely numeric version of the book
import {choose, multinomial} from "./choose.js"
import {decode, encode} from './squashed.js'

class DealSignature {
    perSeat:number[];
    seats:number;
    cards:number;
    pages:bigint;

    constructor(cardsPerSeat:number[]) {
        this.perSeat = cardsPerSeat
        this.seats = cardsPerSeat.length
        this.cards = cardsPerSeat.reduce(
            (total:number, nextVal:number) => total + nextVal
        )
        this.pages = multinomial(cardsPerSeat);
    }

    lastPage(): bigint {
        return this.pages-BigInt(1)
    }

    assertValidPageNo(pageNo:bigint):void {
        if (pageNo>=this.pages || pageNo<BigInt(0)) {
            throw new Error("Invalid page number pageNo outside range <="+this.pages.toString())
        }
    }
}

const defaultSignature = new DealSignature([13,13,13,13])

function signature_or_default(sig:DealSignature|undefined):DealSignature {
    if (sig == undefined) {
        return defaultSignature
    }
    return sig
}

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
    // seat - the seat we are currently populating
    // sequence - the (sorted) subsequence of indices for this seat
    // toWhom - the deal we are updating
    // remaining - the current sequence of un-dealt cards
    const newRemaining = Array<number>(remaining.length-sequence.length)
    var iSeq = 0
    var iNewRemaining = 0
    remaining.forEach( (card,i) =>  {
        if (iSeq<sequence.length && sequence[iSeq]==i) {
            toWhom[card] = seat
            iSeq++
        } else {
            newRemaining[iNewRemaining] = card
            iNewRemaining++
        }
    })
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

class AndrewsStrategy {
    signature:DealSignature;
    factors:SeatFactor[];
    
    constructor(signature:DealSignature|undefined) {
        this.signature = signature_or_default(signature);
        this.factors = computeFactors(this.signature.perSeat)
    }

    computePageNumber(toWhom:number[]):bigint {
        const sig=this.signature
        var sequences: Array<SequenceBuilder>=Array<SequenceBuilder>(sig.seats-1);
        for (var i=1; i<sig.seats; i++) {
            sequences[i-1]=new SequenceBuilder(i,sig.perSeat[i])
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
        const sig  = this.signature
        this.signature.assertValidPageNo(pageNo)
        var toWhom: number[] = Array<number>(sig.cards)
        for (var card = 0; card<sig.cards; card++) {
            toWhom[card] = 0 // default
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

class PavlicekStrategy {
    signature:DealSignature

    constructor(signature:DealSignature) {
        this.signature = signature_or_default(signature)
    }

}

export {DealSignature, AndrewsStrategy, PavlicekStrategy}