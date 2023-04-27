import * as d from "../dest/bridge/deal.js"
import {Rank, Ranks} from "../dest/bridge/constants.js"

test("Holding void",() => {
   var holding = new d.Holding(new Array(0))
   expect(holding.length).toBe(0)
   expect(holding.toString()).toBe('-')
   expect(holding.bits).toBe(0)
   Ranks.all.forEach((rank)=> {
      expect(holding.has(rank)).toBeFalsy()
   })
})

test("AK2 Holding", () => {
   var holding = new d.Holding([Ranks.ace,Ranks.king,Ranks.two])
   expect(holding.length).toBe(3)
   expect(holding.toString()).toBe("A K 2")
   expect(holding.bits).toBe((3<<11)+1)
   expect(holding.has(Ranks.ace)).toBeTruthy()
   expect(holding.has(Ranks.queen)).toBeFalsy()
   expect(holding.has(Ranks.three)).toBeFalsy()
   expect(holding.has(Ranks.two)).toBeTruthy()
})

test("Holding has", ()=>{

})