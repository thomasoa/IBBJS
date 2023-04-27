import {Edition, build_editions} from "./model/books.js"
import {Deal} from "./bridge/deal.js"
import {PageNumber} from "./numeric/deal.js"
import { BridgeBook } from "./bridge/book.js"


interface ProducedDeal {
    deal: Deal,
    edition: string,
    scrambled: boolean,
    pageNo: bigint,
}

type ProducedDealCallback = (index:number, dealEvent:ProducedDeal|undefined)=> any

class Application {
    readonly editions:Map<string,Edition> = build_editions()
    readonly deals:Array<ProducedDeal> = new Array<ProducedDeal>()
    readonly callbacks = {
        updateCurrentDeal: new Array<ProducedDealCallback>(),
        updateDealCount: new Array<(count:number)=>any>()
    }
    currentDeal:number = -1

    constructor() {
    }

    get length() {
        return this.deals.length
    }

    get editionNames():Array<string> {
        return Array.from(this.editions.keys())
    }

    book(editionName:string,scrambled:boolean):BridgeBook {
        var edition = this.editions.get(editionName)
        if (scrambled) {
            return edition.scrambled
        } else {
            return edition.book
        }
    }
    lookupDeal(editionName:string,scrambled:boolean, pageNumber:PageNumber):Deal {
        var book = this.book(editionName,scrambled)
        return book.getDeal(pageNumber)
    }

    updateCount():void {
        this.callbacks.updateDealCount.forEach(
            (callback)=> callback(this.length)
            )
    }

    reset():void {
        this.deals = new Array<ProducedDeal>(0)
        this.updateCount()
        this.updateCurrent(-1)
    }

    updateCurrent(currentDeal:number):void {
        if (currentDeal >= this.length) {
            throw Error('No deal number' + currentDeal)
        }
        this.currentDeal = currentDeal
        var deal:ProducedDeal|undefined;
        this.currentDeal = currentDeal
        if (currentDeal<0) {
            deal = undefined
        } else { 
            deal = this.deals[this.currentDeal]
        }
        this.callbacks.updateCurrentDeal.forEach(
            (callback) => callback(currentDeal,deal)
        )
    }
}

export {Application}