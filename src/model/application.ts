import {Edition, build_editions} from "./books.js"
import {Deal} from "../bridge/deal.js"
import {PageNumber} from "../numeric/deal.js"
import { BridgeBook } from "../bridge/book.js"


interface ProducedDeal {
    deal: Deal,
    edition: string,
    scrambled: boolean,
    pageNo: bigint,
}

type ProducedDealCallback = (index:number, dealEvent:ProducedDeal|undefined)=> any
type DealCountCallback = (count:number)=>any
interface AppCallbacks {
    updateCurrentDeal: Array<ProducedDealCallback>
    updateDealCount: Array<DealCountCallback>
}

class Application {
    readonly editions:Map<string,Edition>;
    private deals:Array<ProducedDeal>;
    readonly callbacks:AppCallbacks; 
    currentDeal:number = -1

    constructor() {
        this.editions = build_editions()
        this.deals = new Array<ProducedDeal>()
        this.callbacks = {
            updateCurrentDeal: new Array<ProducedDealCallback>(),
            updateDealCount: new Array<(count:number)=>any>()
        }
    }

    deal(index:number):ProducedDeal {
        return this.deals[index]
    }

    get length() {
        return this.deals.length
    }

    nextDeal() {
        if (!this.allowNext) {
            throw Error('Cannot go to next page')
        }
        this.updateCurrent(this.currentDeal+1)
    }

    previousDeal() {
        if (! this.allowPrevious) {
            throw Error('Cannot go to previous deal')          
        }
        this.updateCurrent(this.currentDeal-1)

    }

    get allowNext():boolean {
        return (this.currentDeal>=0 && this.currentDeal< this.length-1)
    }

    get allowPrevious():boolean {
        return this.currentDeal>0
    }
    
    addDeal(deal:ProducedDeal):number {
        this.deals.push(deal)
        this.updateCount()
        return this.length
    }

    findDeals(editionName:string,scramble:boolean, pages:Array<PageNumber>):void {
        if (pages.length == 0) { 
            return 
        }
        var book = this.book(editionName,scramble)
        var newCurrent = this.length
        var newDeals = pages.map((page) => {
            var deal = book.getDeal(page)
            return {
                deal: deal, 
                edition: editionName, 
                scrambled: scramble, 
                pageNo: page
            }
        })
        var _this = this
        newDeals.forEach ((deal) => _this.addDeal(deal))
        if (this.length > newCurrent) {
            this.updateCurrent(newCurrent)
        }
    }

    findDeal(edition:string,scrambled:boolean,page:PageNumber):void {
        this.findDeals(edition,scrambled,[page])
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

    listenCurrentDeal(callback:ProducedDealCallback):void {
        this.callbacks.updateCurrentDeal.push(callback)
    }

    listenDealCount(callback:DealCountCallback):void {
        this.callbacks.updateDealCount.push(callback)
    }

    updateCurrent(currentDeal:number):void {
        if (currentDeal >= this.length) {
            throw Error('No deal number' + currentDeal)
        }
        if (currentDeal<0) {
            if (this.length>0) {
                throw Error("Cannot set current deal to a negative value when deals exist")
            }
            currentDeal = -1
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