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
    var myCount = 1000 
    var myIndex = 1000
    var myDeal = 1
    app.listenDealCount((count) => {
        state.count = count
    })
    app.listenCurrentDeal((index,deal) => {
        state.current = index
        state.deal = deal
    })
    app.reset()
    expect(state.count).toBe(0)
    expect(state.current).toBe(-1)
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

test("Exceptions with updateCurrent",()=>{
    var app = new Application()
    expect(() => app.updateCurrent(0)).toThrow()
    expect(() => app.updateCurrent(1)).toThrow()
    app.findDeals("Pavlicek",false,[BigInt(10),BigInt(10000)])
    expect(()=> app.updateCurrent(2)).toThrow()
    expect(()=> app.updateCurrent(-1)).toThrow()
    expect(()=> app.updateCurrent(-12)).toThrow()
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