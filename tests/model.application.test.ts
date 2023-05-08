import { Application, NewCurrentDealEvent } from "../src/model/application"

test("Model has editions 'Andrews' and 'Pavlicek'", () => {
    const model = new Application()
    const editions = model.editionNames
    expect(editions).toContain('Andrews')
    expect(editions).toContain('Pavlicek')
    expect(editions.length).toBe(2)
})

test('Application throws errors when calling currentDeal() after reset',() => { 
    const app = new Application()
    app.reset()
    expect(() => app.currentDeal).toThrow()
})

test("Application findDeal", () => {
    const app = new Application()
    app.findDeal("Andrews", false, BigInt(1))
    const foundDeal = app.deal(0)
    expect(foundDeal.edition).toBe('Andrews')
    expect(foundDeal.scrambled).toBeFalsy()
    expect(foundDeal.pageNo.toString()).toBe("1")
})

test("Application findDeal callbacks", () => {
    const app = new Application()
    type State = { count: number, current:number|undefined, deal: NewCurrentDealEvent|undefined}
    const state: State = { count: 1000, current: 1000, deal: undefined }
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
    app.listenReset(() => {
        state.count = 0
        state.deal = undefined
        state.current = -1
    })
    app.reset()
    expect(state.count).toBe(0)
    expect(state.current).toBe(-1)
    expect(state.deal).toBeUndefined()

    app.findDeal("Andrews", false, BigInt(1))
    expect(state.count).toBe(1)
    expect(state.current).toBe(0)
    expect(state.deal).toBeDefined()
    expect(state.deal && state.deal.edition).toBe("Andrews")
    expect(state.deal && state.deal.scrambled).toBeFalsy()
    expect(state.deal && state.deal.pageNo.toString()).toBe("1")

    app.findDeals("Andrews", true, [BigInt(4), BigInt(5)])
    expect(state.count).toBe(3)
    expect(state.current).toBe(1)

    expect(state.deal && state.deal.edition).toBe("Andrews")
    expect(state.deal && state.deal.scrambled).toBeTruthy()
    expect(state.deal && state.deal.pageNo.toString()).toBe("4")

    app.nextDeal()
    expect(state.count).toBe(3)
    expect(state.current).toBe(2)
    expect(state.deal).toBeDefined()
    if (state.deal) {
        expect(state.deal.edition).toBe("Andrews")
        expect(state.deal.scrambled).toBeTruthy()
        expect(state.deal.pageNo.toString()).toBe("5")
    }

    app.previousDeal()
    expect(state.count).toBe(3)
    expect(state.current).toBe(1)
    expect(state.deal).toBeDefined()
    if (state.deal) {
        expect(state.deal.edition).toBe("Andrews")
        expect(state.deal.scrambled).toBeTruthy()
        expect(state.deal.pageNo.toString()).toBe("4")
    }

    state.count = -1
    state.current = -2
    state.deal = undefined
    app.findDeals("Andrews", false, [])
    expect(state.count).toBe(-1)
    expect(state.current).toBe(-2)
    expect(state.deal).toBeUndefined()
})

test("Exceptions with nextPage and previousPage", () => {
    const app = new Application()
    // Empty app at start cannot go to next or previous
    expect(() => app.nextDeal()).toThrow()
    expect(() => app.previousDeal()).toThrow()
    app.findDeals("Pavlicek", false, [BigInt(10), BigInt(10000)])
    expect(() => app.previousDeal()).toThrow()
    app.nextDeal()
    expect(() => app.nextDeal()).toThrow()
})

test('chooseCurrent usages', () => {
    let app = new Application()
    let currentEvent:undefined|NewCurrentDealEvent = undefined

    app.listenCurrentDeal((event) => {
        currentEvent = event
    })

    app.listenReset(() => { 
        currentEvent = undefined 
    })

    app.reset()
    expect(() => app.chooseCurrent(0)).toThrow()
    expect(() => app.chooseCurrent(-1)).toThrow()
    app.findDeals("Pavlicek", false, [BigInt(1), BigInt(10)])
    app.chooseCurrent(1)
    expect(currentEvent && currentEvent['pageNo']).toBe(BigInt(10))
    
    app.chooseCurrent(0)
    expect(currentEvent && currentEvent['pageNo']).toBe(BigInt(1))
    expect(() => app.chooseCurrent(2)).toThrow()
    expect(() => app.chooseCurrent(-1)).toThrow()

})

test('Call findPageNumber', () => {
    const app = new Application()
    const page = BigInt(59) ** BigInt(12)
    const dealInfo = app.lookupDeals('Andrews', false, [page])[0]
    expect(app.findPageNumber("Andrews", false, dealInfo.deal)).toBe(page)
})

test('Application.lastPage', () => {
    const app = new Application()
    expect(app.lastPage).toBe(BigInt('53644737765488792839237440000'))
})