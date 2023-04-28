import {Application} from "../dest/application.js"

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
    var myCount = 1000 
    var myIndex = 1000
    var myDeal = 1
    app.listenDealCount((count) => {
        myCount = count
    })
    app.listenCurrentDeal((index,deal) => {
        myIndex = index
        myDeal = deal
    })
    app.reset()
    expect(myCount).toBe(0)
    expect(myIndex).toBe(-1)
    expect(myDeal).toBeUndefined()

    app.findDeal("Andrews",false,BigInt(1))
    expect(myCount).toBe(1)
    expect(myIndex).toBe(0)
    expect(myDeal.edition).toBe("Andrews")
    expect(myDeal.scrambled).toBeFalsy()
    expect(myDeal.pageNo.toString()).toBe("1")

    app.findDeals("Andrews",true,[BigInt(4),BigInt(5)])
    expect(myCount).toBe(3)
    expect(myIndex).toBe(1)
    expect(myDeal.edition).toBe("Andrews")
    expect(myDeal.scrambled).toBeTruthy()
    expect(myDeal.pageNo.toString()).toBe("4")

    app.nextDeal()
    expect(myCount).toBe(3)
    expect(myIndex).toBe(2)
    expect(myDeal.edition).toBe("Andrews")
    expect(myDeal.scrambled).toBeTruthy()
    expect(myDeal.pageNo.toString()).toBe("5")

    app.previousDeal()
    expect(myCount).toBe(3)
    expect(myIndex).toBe(1)
    expect(myDeal.edition).toBe("Andrews")
    expect(myDeal.scrambled).toBeTruthy()
    expect(myDeal.pageNo.toString()).toBe("4")

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