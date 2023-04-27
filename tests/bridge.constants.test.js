import {Seats, Suits, Ranks, Cards} from "../dest/bridge/constants.js"

test("Ensure the sizes are right",() => {
    expect(Seats.all.length).toBe(4)
    expect(Suits.all.length).toBe(4)
    expect(Ranks.all.length).toBe(13)
    expect(Cards.length).toBe(52)
})

test("Ensure seat orders are in agreement",()=>{
    Seats.all.forEach((seat,index) => {
        expect(seat.order).toBe(index)
    })
})

test("Ensure suit orders are in agreement",()=>{
    Suits.all.forEach((suit,index) => {
        expect(suit.order).toBe(index)
    })
})

test("Ensure rank orders agree with the linear order", ()=>{
    expect(Ranks.all[0]).toBe(Ranks.ace)
    Ranks.all.forEach((rank,index) => {
        expect(rank.order).toBe(index)
    })
})

test("Ensure card orders agree with the linear order", ()=>{
    Cards.forEach((card,index) => {
        expect(card.order).toBe(index)
    })

})