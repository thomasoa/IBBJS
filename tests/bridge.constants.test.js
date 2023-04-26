import {Seats, Suits, Ranks, Cards} from "../dest/bridge/constants.js"

test("Ensure the sizes are right",() => {
    expect(Seats.all.length).toBe(4)
    expect(Suits.all.length).toBe(4)
    expect(Ranks.length).toBe(13)
    expect(Cards.length).toBe(52)
})

test("Ensure seat orders are in agreement",()=>{
    Seats.all.forEach((seat,index) => {
        expect(seat.order).toBe(index)
    })
})

test("Ensure rank orders agree with the linear order", ()=>{
    Ranks.forEach((rank,index) => {
        expect(rank.order).toBe(index)
    })

})