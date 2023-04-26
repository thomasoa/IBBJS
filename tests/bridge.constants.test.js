import {Seats, Suits, Ranks, Cards} from "../dest/bridge/constants.js"

test("Ensure the sizes are right",() => {
    expect(Seats.all.length).toBe(4)
    expect(Suits.all.length).toBe(4)
    expect(Ranks.length).toBe(13)
    expect(Cards.length).toBe(52)
})