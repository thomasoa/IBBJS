import {DealSignature, PageNumber, AndrewsHandStrategy, HandStrategy, PavlicekStrategy, SeatNumber, NumericDeal} from "../numeric/index.js"
import * as squashed from '../numeric/squashed.js'
import {choose} from "../numeric/choose.js"

import {Bijection, defaultBijectionCard} from './bijection.js'
import {Card} from './constants.js'
import {Hand} from "./deal.js" 

function assertBridgeHandStrategy(strategy: HandStrategy) {
    const sig = strategy.signature
    if (sig.handLength != 13 || sig.cards !=52) {
        throw new TypeError('Invalid HandStrategy for hand with ' + sig.pages + ' cards from deck of ' + sig.cards)
    }
}

class HandBook {
    readonly cardBijection:Bijection<Card>
    readonly strategy: HandStrategy 

    constructor(strategy:HandStrategy, bijection:Bijection<Card> = defaultBijectionCard) {
        assertBridgeHandStrategy(strategy)
        this.cardBijection = bijection
        this.strategy = strategy
    }

    get pages() { return this.strategy.pages }
    get lastPage() { return this.pages }

    getHand(pageNo:PageNumber):Hand {
        const pageIndex = pageNo - BigInt(1)
        console.log(this.strategy)
        this.strategy.assertValidPage(pageIndex,BigInt(1))
        const bijection = this.cardBijection
        const numericCards = this.strategy.computePageContent(pageNo-BigInt(1))
        const cards = numericCards.map(
            (cardNum) => bijection.mapTo(cardNum) 
        )
        return new Hand(cards)
    }

    getPageNumber(hand:Hand):PageNumber {
        const bijection = this.cardBijection
        const sequence = hand.cards.map((c)=> bijection.mapFrom(c))
        return this.strategy.computePageNumber(sequence)+BigInt(1)
    }
}

export { HandBook}