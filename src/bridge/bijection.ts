import {Deck, Seats, Seat, Card}  from "../basics/src/bridge/constants"

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
const defaultBijectionCard:Bijection<Card> = new SimpleBijection<Card>(Deck.cards.all)

export {Bijection, SimpleBijection, defaultBijectionCard, defaultBijectionSeat}
