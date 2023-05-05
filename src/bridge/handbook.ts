import {DealSignature, PageNumber, PavlicekStrategy, SeatNumber, NumericDeal} from "../numeric/index.js"
import * as squashed from '../numeric/squashed.js'
import {choose} from "../numeric/choose.js"

import {Bijection, defaultBijectionCard} from './bijection.js'
import {Card} from './constants.js'
import {Hand} from "./deal.js" 
    
interface HandBook {
    pages: bigint
    lastPage: bigint
    getHand(pageNo:PageNumber):Hand
    getPageNumber(hand:Hand):PageNumber
}

class AndrewsHandBook {
    readonly cardBijection:Bijection<Card>
    pages: bigint
        
    constructor(bijection:Bijection<Card>=defaultBijectionCard) {
        this.cardBijection = bijection
        this.pages = choose(52,13)
    }

    get lastPage() {
        return this.pages
    }

    assertValidPage(pageNo:PageNumber):void {
        if (pageNo<BigInt(1) || pageNo > this.pages) {
            throw new Error('Page out of bounds: '+pageNo)
        }
    }

    getHand(pageNo:PageNumber):Hand {
        this.assertValidPage(pageNo)
        const bijection = this.cardBijection
        const cards = squashed.decode(pageNo-BigInt(1),13).map(
            (cardNum) => bijection.mapTo(cardNum) 
        )
        return new Hand(cards)    
    }

    getPageNumber(hand:Hand):PageNumber {
        const bijection = this.cardBijection
        const sequence = hand.cards.map((c)=> bijection.mapFrom(c))
        return squashed.encode(sequence)+BigInt(1)
    }
}

class PavlicekHandBook {
    strategy:PavlicekStrategy
    cardBijection:Bijection<Card>
        
    constructor(bijection:Bijection<Card>=defaultBijectionCard) {
        const signature = new DealSignature([13,39])
        this.strategy = new PavlicekStrategy(signature)
        this.cardBijection = bijection
    }

    get pages() {
        return this.strategy.pages
    }

    get lastPage() {
        return this.pages
    }

    assertValidPage(pageNo:PageNumber):void {
        if (pageNo<BigInt(1) || pageNo > this.pages) {
            throw new Error('Page out of bounds: '+pageNo)
        }
    }

    getHand(pageNo:PageNumber):Hand {
        this.assertValidPage(pageNo)
        const bijection = this.cardBijection
        const toWhom = this.strategy.computePageContent(pageNo-BigInt(1)).toWhom
        const cards = new Array<Card>(13) 
        toWhom.forEach((whom,cardNum) => {
            if (whom===0) cards.push(bijection.mapTo(cardNum))
        })
        return new Hand(cards)
    }

    getPageNumber(hand:Hand):PageNumber {
        const bijection = this.cardBijection
        const sequence = hand.cards.map((c)=> bijection.mapFrom(c))
        const toWhom = new Array<SeatNumber>(52)
        for (var i=0; i<52; i++) toWhom[i] = 0
        sequence.forEach((cardNum) => {
            toWhom[cardNum] = 1
        })
        return BigInt(1) + this.strategy.computePageNumber(new NumericDeal(this.strategy.signature, toWhom))
    }
}

export { HandBook, AndrewsHandBook, PavlicekHandBook}