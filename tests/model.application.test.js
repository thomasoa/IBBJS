import {Application} from "../dest/model/application.js"

test("Model has editions 'Andrews' and 'Pavlicek'",()=>{
    var model =  new Application()
    var editions = model.editionNames
    expect(editions).toContain('Andrews')
    expect(editions).toContain('Pavlicek')
    expect(editions.length).toBe(2)
})

test("Application findDeal", ()=> {
    var app = new Application()
    app.findDeal("Andrews",false,BigInt(1))
    var foundDeal = app.deal(0)
    expect(foundDeal.edition).toBe('Andrews')
    expect(foundDeal.scramble).toBeFalsy()
    expect(foundDeal.pageNo.toString()).toBe("1")
})

test("Application findDeal callbacks",()=> {
    var app = new Application()
    var state = {count: 1000, current: 1000, deal: 1}
    app.listenDealCount((count) => {
        state.count = count
    })
    app.listenCurrentDeal((dealInfo) => {
        if (dealInfo) {
            state.current = dealInfo.index
            state.deal = dealInfo
        } else {
            state.current = undefined
            state.deal = undefined
        }
    })
    app.reset()
    expect(state.count).toBe(0)
    expect(state.current).toBeUndefined()
    expect(state.deal).toBeUndefined()
    
    app.findDeal("Andrews",false,BigInt(1))
    expect(state.count).toBe(1)
    expect(state.current).toBe(0)
    expect(state.deal.edition).toBe("Andrews")
    expect(state.deal.scrambled).toBeFalsy()
    expect(state.deal.pageNo.toString()).toBe("1")
    
    app.findDeals("Andrews",true,[BigInt(4),BigInt(5)])
    expect(state.count).toBe(3)
    expect(state.current).toBe(1)
    expect(state.deal.edition).toBe("Andrews")
    expect(state.deal.scrambled).toBeTruthy()
    expect(state.deal.pageNo.toString()).toBe("4")
    
    app.nextDeal()
    expect(state.count).toBe(3)
    expect(state.current).toBe(2)
    expect(state.deal.edition).toBe("Andrews")
    expect(state.deal.scrambled).toBeTruthy()
    expect(state.deal.pageNo.toString()).toBe("5")
    
    app.previousDeal()
    expect(state.count).toBe(3)
    expect(state.current).toBe(1)
    expect(state.deal.edition).toBe("Andrews")
    expect(state.deal.scrambled).toBeTruthy()
    expect(state.deal.pageNo.toString()).toBe("4")
    
    state.count = -1
    state.current = -2
    state.deal = -3
    app.findDeals("Andrews",false,[])
    expect(state.count).toBe(-1)
    expect(state.current).toBe(-2)
    expect(state.deal).toBe(-3)
})

test("Exceptions with nextPage and previousPage",()=>{
    var app = new Application()
    // Empty app at start cannot go to next or previous
    expect(()=> app.nextPage()).toThrow()
    expect(()=> app.previousDeal()).toThrow()
    app.findDeals("Pavlicek",false,[BigInt(10),BigInt(10000)])
    expect(()=> app.previousDeal()).toThrow()
    app.nextDeal()
    expect(()=> app.nextDeal()).toThrow()
})

test('chooseCurrent usages',()=>{
    var app = new Application()
    var currentEvent = undefined
    app.listenCurrentDeal((event)=>{
        currentEvent = event
    })
    expect(()=> app.chooseCurrent(0)).toThrow()
    expect(()=> app.chooseCurrent(-1)).toThrow()
    app.findDeals("Pavlicek",false,[BigInt(1),BigInt(10)])
    app.chooseCurrent(1)
    expect(currentEvent.pageNo).toBe(BigInt(10))
    app.chooseCurrent(0)
    expect(currentEvent.pageNo).toBe(BigInt(1))
    expect(()=> app.chooseCurrent(2)).toThrow()
    expect(()=> app.chooseCurrent(-1)).toThrow()

})

test('Call findPageNumber',()=>{
    var app = new Application()
    var page = BigInt(59)**BigInt(12)
    var dealInfo = app.lookupDeals('Andrews',false, [page])[0]
    expect(app.findPageNumber("Andrews",false,dealInfo.deal)).toBe(page)
})

test('Application.lastPage',()=>{
    var app = new Application()
    expect(app.lastPage).toBe(BigInt('53644737765488792839237440000'))
})