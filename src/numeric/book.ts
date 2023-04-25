//  An entirely numeric version of the book
import {choose, multinomial} from "./choose.js"
import {decode, encode} from './squashed.js'

class DealSignature {
    readonly perSeat:number[];
    readonly seats:number;
    readonly cards:number;
    readonly pages:bigint;

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
    // Represents a factor of the Andrews strategy
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
 

interface BookStrategy {
    readonly signature: DealSignature;
    computePageContent(pageNo:bigint):number[];
    computePageNumber(deal:number[]):bigint;
}

class NumericDeal {
    // A deal which matches a signature
    // 
    signature: DealSignature;
    toWhom: number[];
    hands: number[][];

    constructor(sig:DealSignature,toWhom:number[]) {
        this.signature = sig
        this.toWhom = [...toWhom]
        if (toWhom.length != sig.cards) {
            throw Error('Wrong number of cards in deal. Expected' + sig.cards + ', got ' + toWhom.length)
        }
        this.hands = this.signature.perSeat.map((cards,seat) => Array<number>(0))
        this.toWhom.forEach((seat,card) => {
            if (seat>= sig.seats || seat< 0) {
                throw Error(
                    'Invalid seat ' + seat + ' for deal in with ' + sig.seats + ' seats'
                )
            }
            this.hands[seat].push(card)
        })

        sig.perSeat.forEach((cards,seat) => {
             if (cards != this.hands[seat].length) {
                throw Error(
                    'Wrong number of cards for seat ' + seat + ' expected ' + cards + ' cards'
                )
             }
        })

    }

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
    // Keeps track of the number of cards in the seat or
    // lower seats, and determines the sequence of cards
    // as a subset of those cards only. 
    // 
    // builder2 = SequenceBuilder(2,3)
    // [0,3,2,3,1,2,3,2].forEach((seat,card) => {
    //     builder2.nextItem(card,seat)  
    // }
    //
    // Then builder2.sequence should be [1,3,4], because, ignoring the
    // higher seats (3) we get [0,2,1,2,2] and  [1,3,4] is the indices
    // of 2 in that sequence.

    sequence: Array<number>;
    seqIdx: number;
    afterIndex: number;
    seat: number;

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

    computePageNumber(deal:NumericDeal):bigint {
        const sig=this.signature
        var sequences: Array<SequenceBuilder>=Array<SequenceBuilder>(sig.seats-1);
        for (var i=1; i<sig.seats; i++) {
            sequences[i-1]=new SequenceBuilder(i,sig.perSeat[i])
        }
        deal.toWhom.forEach((whom,card) => 
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

    computePageContent(pageNo:bigint): NumericDeal {
        // Determine what deal is on the given page number
        const sig  = this.signature
        this.signature.assertValidPageNo(pageNo)
        var toWhom: number[] = Array<number>(sig.cards)
        for (var card = 0; card<sig.cards; card++) {
            toWhom[card] = 0 // default
        }

        var indices = toWhom.map((val,index) => index)
        // Factors are stored in reverse order by seatts, and with
        // no entry for seat 0 because that seat gets all the remaining
        // cards.
        this.factors.forEach(
            (factor:SeatFactor) => {
                // console.log(factor,indices,toWhom)
                var seatIndex:bigint = pageNo / factor.quotient
                pageNo = pageNo % factor.quotient
                var sequence: number[] = decode(seatIndex,factor.cards)
                indices = updateSequence(factor.seat,sequence,toWhom,indices)

            }
        )
        return new NumericDeal(this.signature,toWhom)
    }
}

class PavlicekStrategy {
    signature:DealSignature

    constructor(signature:DealSignature) {
        this.signature = signature_or_default(signature)
    }

}

export {DealSignature, AndrewsStrategy, PavlicekStrategy, NumericDeal}