import * as d from "../dest/bridge/deal.js"
import { Deck, Seats} from "../dest/bridge/constants.js"

test("Holding void", () => {
   var holding = new d.Holding(new Array(0))
   expect(holding.length).toBe(0)
   expect(holding.isVoid()).toBeTruthy()
   expect(holding.toString()).toBe('-')
   expect(holding.asString(',')).toBe('-')
   expect(holding.bits).toBe(0)
   Deck.ranks.all.forEach((rank) => {
      expect(holding.has(rank)).toBeFalsy()
   })
})

test("AK2 Holding", () => {
   var holding = new d.Holding([Deck.ranks.ace, Deck.ranks.king, Deck.ranks.two])
   expect(holding.length).toBe(3)
   expect(holding.isVoid()).toBeFalsy()
   expect(holding.toString()).toBe("A K 2")
   expect(holding.asString('')).toBe("AK2")
   expect(holding.bits).toBe((3 << 11) + 1)
   expect(holding.has(Deck.ranks.ace)).toBeTruthy()
   expect(holding.has(Deck.ranks.queen)).toBeFalsy()
   expect(holding.has(Deck.ranks.three)).toBeFalsy()
   expect(holding.has(Deck.ranks.two)).toBeTruthy()
})

test("Hand construction and holdings", () => {
   var cards = [
      "SQ", "S10", "S9", "HA",
      "H8", "H7", "H6", "H5",
      "H4", "H3", "H2", "DK", "DJ"].map((s) => Deck.cardByName.get(s))
   var hand = new d.Hand(cards)
   expect(hand.has(Deck.cardByName.get('HA'))).toBeTruthy()
   expect(hand.has(Deck.cardByName.get('SA'))).toBeFalsy()

   expect(hand.spades.toString()).toBe('Q 10 9')
   expect(hand.hearts.toString()).toBe("A 8 7 6 5 4 3 2")
   expect(hand.diamonds.toString()).toBe("K J")
   expect(hand.clubs.toString()).toBe("-")
   expect(hand.toString()).toBe('Q109 A8765432 KJ -')
})

test("Hand eachSuit method", () => {
   var cards = [
      "SQ", "S10", "S9", "HA",
      "H8", "H7", "H6", "H5",
      "H4", "H3", "H2", "DK", "DJ"].map((s) => Deck.cardByName.get(s))
   var hand = new d.Hand(cards)
   var suitMap = new Map()
   hand.eachSuit((suit, holding) => {
      suitMap.set(suit.name, holding.toString())
   })
   expect(suitMap.get('spades'))
   expect(suitMap.get('spades')).toBe('Q 10 9')
   expect(suitMap.get('hearts')).toBe("A 8 7 6 5 4 3 2")
   expect(suitMap.get('diamonds')).toBe("K J")
   expect(suitMap.get('clubs')).toBe("-")

})

test("Deal eachHand", () => {
   var toWhom = Array.from({ length: 52 }, (v, i) => Seats.all[Math.floor(i / 13)])
   var deal = new d.Deal(toWhom)
   var expected = new Map([
      ["north", "AKQJ1098765432 - - -"],
      ["east", "- AKQJ1098765432 - -"],
      ['south', '- - AKQJ1098765432 -'],
      ['west', '- - - AKQJ1098765432']
   ])
   deal.eachHand((seat, hand) => {
      expect(hand.toString()).toBe(expected.get(seat.name))
   })
})