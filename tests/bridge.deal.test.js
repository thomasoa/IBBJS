import * as d from "../dest/bridge/deal.js"
import {Ranks, Card, Cards, Suits, CardsByName,Seats} from "../dest/bridge/constants.js"

test("Holding void",() => {
   var holding = new d.Holding(new Array(0))
   expect(holding.length).toBe(0)
   expect(holding.toString()).toBe('-')
   expect(holding.asString(',')).toBe('-')
   expect(holding.bits).toBe(0)
   Ranks.all.forEach((rank)=> {
      expect(holding.has(rank)).toBeFalsy()
   })
})

test("AK2 Holding", () => {
   var holding = new d.Holding([Ranks.ace,Ranks.king,Ranks.two])
   expect(holding.length).toBe(3)
   expect(holding.toString()).toBe("A K 2")
   expect(holding.asString('')).toBe("AK2")
   expect(holding.bits).toBe((3<<11)+1)
   expect(holding.has(Ranks.ace)).toBeTruthy()
   expect(holding.has(Ranks.queen)).toBeFalsy()
   expect(holding.has(Ranks.three)).toBeFalsy()
   expect(holding.has(Ranks.two)).toBeTruthy()
})

test("Hand construction and holdings", () => {
   var cards = [
      "SQ","S10","S9","HA",
      "H8","H7","H6","H5",
      "H4","H3","H2","DK","DJ"].map((s) => CardsByName.get(s))
   var hand = new d.Hand(cards)
   expect(hand.spades().toString()).toBe('Q 10 9')
   expect(hand.hearts().toString()).toBe("A 8 7 6 5 4 3 2")
   expect(hand.diamonds().toString()).toBe("K J")
   expect(hand.clubs().toString()).toBe("-")
   expect(hand.toString()).toBe('Q109 A8765432 KJ -')
})

test("Hand eachSuit method", ()=>{
   var cards = [
      "SQ","S10","S9","HA",
      "H8","H7","H6","H5",
      "H4","H3","H2","DK","DJ"].map((s) => CardsByName.get(s))
   var hand = new d.Hand(cards)
   var suitMap = new Map()
   hand.eachSuit((suit,holding)=>{
      suitMap.set(suit.name,holding.toString())
   })
   expect(suitMap.get('spades'))
   expect(suitMap.get('spades')).toBe('Q 10 9')
   expect(suitMap.get('hearts')).toBe("A 8 7 6 5 4 3 2")
   expect(suitMap.get('diamonds')).toBe("K J")
   expect(suitMap.get('clubs')).toBe("-")

})