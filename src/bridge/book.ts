import {Deck, Seats, Seat, Card}  from "./constants.js"
import {BookStrategy, PageNumber, SeatNumber,  NumericDeal, DealSignature, bridgeSignature} from "../numeric/index.js"
import {Deal} from "./deal.js"

interface OrderedType {
    order:number
}

interface Bijection<T extends OrderedType> {
    mapTo(num:number):T
    mapFrom(t:T):number
}

class SimpleBijection<T extends OrderedType> {
    instances: readonly T[]
    reverse: readonly number[]

    constructor(allT:readonly T[], map:(n:number)=> number = (n)=> n) {
        const instances = new Array<T>(allT.length)
        const reverse = new Array<number>(allT.length)
        allT.forEach((t:T,num)=>{
            instances[num]=allT[map(num)]
            reverse[map(num)] = num
        })
        this.instances = instances
        this.reverse = reverse
    }

    mapTo(num:number):T {
        return this.instances[num]
    }

    mapFrom(t:T):number {
        return this.reverse[t.order]
    }
}
const defaultBijectionSeat:Bijection<Seat> = new SimpleBijection<Seat>(Seats.all)
const defaultBijectionCard:Bijection<Card> = new SimpleBijection<Card>(Deck.cards)

function validate_signature(signature:DealSignature):void {
    if (!bridgeSignature.equals(signature)) {
        throw new TypeError('Invalid signature')
    }
}

class BridgeBook {
    readonly strategy:BookStrategy
    readonly seatBijection:Bijection<Seat>
    readonly cardBijection:Bijection<Card>

    constructor(
        strategy: BookStrategy,
        seatBijection:Bijection<Seat>=defaultBijectionSeat,
        cardBijection:Bijection<Card>=defaultBijectionCard
        ) {
            
            validate_signature(strategy.signature)
            this.strategy = strategy
            this.seatBijection = seatBijection
            this.cardBijection = cardBijection
        }
        
        get pages() { return this.strategy.pages}
        get lastPage() { return this.strategy.pages}
        
        validPageNumber(pageNo:PageNumber) {
            return pageNo>= BigInt(1) && pageNo<= this.lastPage
        }
        getDeal(pageNo:PageNumber):Deal {
            if (!this.validPageNumber(pageNo)) {
                throw RangeError('Invalid page number ' + pageNo + ', must be between 1 and ' + this.lastPage)
            }
            const numDeal = this.strategy.computePageContent(pageNo-BigInt(1))
            const seatMap = this.seatBijection
            const cardMap = this.cardBijection
            const toWhom : Array<Seat> = new Array<Seat>(Deck.cards.length)
            
            numDeal.toWhom.forEach((seatNum,cardNum)=> {
                const seat = seatMap.mapTo(seatNum)
                const card = cardMap.mapTo(cardNum)
                toWhom[card.order] = seat
            })
            
            return new Deal(toWhom)
        }

        private numericDeal(deal:Deal):NumericDeal {
            const toWhom = new Array<SeatNumber>(52)
            const cardMap = this.cardBijection
            const seatMap = this.seatBijection
            deal.eachCard((card:Card, seat:Seat)=>{
                const seatNum = seatMap.mapFrom(seat)
                const cardNum = cardMap.mapFrom(card)
                toWhom[cardNum] = seatNum
            })
            return new NumericDeal(this.strategy.signature, toWhom)
        }

        getPageNumber(deal:Deal):PageNumber {
            const numericDeal = this.numericDeal(deal)
            return this.strategy.computePageNumber(numericDeal)+BigInt(1)
        }
    }
    
    export {BridgeBook, SimpleBijection, validate_signature}
