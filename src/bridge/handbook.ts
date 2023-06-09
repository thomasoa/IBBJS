import { PageNumber, HandStrategy} from "../numeric/index"
import {Bijection, defaultBijectionCard} from "./bijection"
import {Card, FullHand} from "../basics/src/index"

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

    getHand(pageNo:PageNumber):FullHand {
        const pageIndex = pageNo - BigInt(1)
        this.strategy.assertValidPage(pageIndex,BigInt(1))
        const bijection = this.cardBijection
        const numericCards = this.strategy.computePageContent(pageNo-BigInt(1))
        const cards = numericCards.map(
            (cardNum) => bijection.mapTo(cardNum) 
        )
        return FullHand.byCards(cards)
    }

    getPageNumber(hand:FullHand):PageNumber {
        const bijection = this.cardBijection
        const sequence = hand.mapCards((c)=> bijection.mapFrom(c))
        return this.strategy.computePageNumber(sequence)+BigInt(1)
    }
}

export { HandBook}
