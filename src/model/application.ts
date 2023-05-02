import {Edition, build_editions} from "./books.js"
import {Deal} from "../bridge/deal.js"
import {PageNumber} from "../numeric/deal.js"
import { BridgeBook } from "../bridge/book.js"


/**
 * Interface for a class of events that occur when the application has
 * a new CurrentDeal.
 */
interface NewCurrentDealEvent {
    deal: Deal,
    edition: string,
    scrambled: boolean,
    pageNo: PageNumber,
    index?:number,
    count?:number
}

/* 
 * Callbacks for two event types.
 */
type NewCurrentDealCalllback = (dealEvent:NewCurrentDealEvent|undefined)=> void
type DealCountCallback = (count:number)=>void

interface AppCallbacks {
    updateCurrentDeal: Array<NewCurrentDealCalllback>
    updateDealCount: Array<DealCountCallback>
}

class Application {
    /**
     * Implements the non-display logic of the application.
     * 
     * The application keeps track of an array of produced deals and
     * which deal is 'current.'
     * 
     * The main useful public methods are:
     *    findDeals(bookName:string, scrambled:boolean, bigint[])
     *    findDeal(bookName:string, scrambled:boolean, bigint)
     *       - These two look up page numbers in the "books," append the
     *         deals ffound there to the array of found deals.
     *       - Updates the current deal to be the first of the new found deals.
     *       - Emits both a NewCurrentDeal event, and a new count event (which is just
     *         the count.) 
     * 
     *    listenDealCount(callback) - the callback takes a parameter of signature:
     *            { 
     *              currentDeal: number; 
     *              deal?: { deal: Deal, edition: string, scrambled: boolean, pageNo: bigint }
     *            }
     * where deal: will be undefined if currentDeal < 0 (after a reset, for example)
     * 
     *    listenDealCount(callback) - the callback takes a parameter just a number, the
     *    count of the deals
     * 
     *    reset() - Clears the array and emits both a DealCount event and a CurrentDeal event.
     * 
     *    allowsBack allowsForward - true if you can move in that direction in tthe array
     *    from the currentDeal.
     */

    readonly editions:Map<string,Edition>;
    private deals:Array<NewCurrentDealEvent>;
    readonly callbacks:AppCallbacks; 
    currentIndex:number = -1

    constructor() {
        this.editions = build_editions()
        this.deals = new Array<NewCurrentDealEvent>()
        this.callbacks = {
            updateCurrentDeal: new Array<NewCurrentDealCalllback>(),
            updateDealCount: new Array<(count:number)=>any>()
        }
    }

    deal(index:number):NewCurrentDealEvent {
        return this.deals[index]
    }

    get length() {
        return this.deals.length
    }

    nextDeal() {
        if (!this.allowNext) {
            throw Error('Cannot go to next page')
        }
        this.updateCurrent(this.currentIndex+1)
    }

    previousDeal() {
        if (! this.allowPrevious) {
            throw Error('Cannot go to previous deal')          
        }
        this.updateCurrent(this.currentIndex-1)

    }

    get allowNext():boolean {
        return (this.currentIndex>=0 && this.currentIndex< this.length-1)
    }

    get allowPrevious():boolean {
        return this.currentIndex>0
    }
    
    addDeal(deal:NewCurrentDealEvent):number {
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
        this.updateCurrent(newCurrent)
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
        this.deals = new Array<NewCurrentDealEvent>(0)
        this.updateCount()
        this.updateCurrent(-1)
    }

    listenCurrentDeal(callback:NewCurrentDealCalllback):void {
        this.callbacks.updateCurrentDeal.push(callback)
    }

    listenDealCount(callback:DealCountCallback):void {
        this.callbacks.updateDealCount.push(callback)
    }

    get currentDeal():NewCurrentDealEvent|undefined {
        if (this.currentIndex>=0) {
            var deal = this.deals[this.currentIndex]
            deal.index = this.currentIndex
            deal.count = this.length
            return deal
        }
        return undefined
    }

    private currentDealCallBacks():void {
        var deal = this.currentDeal
        this.callbacks.updateCurrentDeal.forEach(
            (callback) => callback(deal)
        )

    }
    private updateCurrent(currentIndex:number):void {
        this.currentIndex = currentIndex
        this.currentDealCallBacks()
    }

    chooseCurrent(currentIndex:number):void {
        if (currentIndex<0 || currentIndex>=this.length) {
            throw new Error('Can only choose deal between 0 and '+(this.length-1))
        }
        this.updateCurrent(currentIndex)
    }
}

export {Application}