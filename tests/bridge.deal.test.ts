import * as d from "../src/bridge/deal"
import { Deck, Seats} from "../src/basics/src/bridge/constants"

test("Holding void", () => {
   const holding = new d.Holding(new Array(0))
   expect(holding.length).toBe(0)
   expect(holding.isVoid()).toBeTruthy()
   expect(holding.toString()).toBe('-')
   expect(holding.asString(',')).toBe('-')
   expect(holding.bits).toBe(0)
   Deck.ranks.each((rank) => {
      expect(holding.has(rank)).toBeFalsy()
   })
})

test("AK2 Holding", () => {
   const holding = new d.Holding([Deck.ranks.ace, Deck.ranks.king, Deck.ranks.two])
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
   const cards = Deck.cards.byNames(
      "SQ", "S10", "S9", "HA",
      "H8", "H7", "H6", "H5",
      "H4", "H3", "H2", "DK", "DJ")
   const hand = new d.Hand(cards)
   expect(hand.has(Deck.c('HA'))).toBeTruthy()
   expect(hand.has(Deck.c('SA'))).toBeFalsy()

   expect(hand.spades.toString()).toBe('Q 10 9')
   expect(hand.hearts.toString()).toBe("A 8 7 6 5 4 3 2")
   expect(hand.diamonds.toString()).toBe("K J")
   expect(hand.clubs.toString()).toBe("-")
   expect(hand.toString()).toBe('Q109 A8765432 KJ -')
})

test('Holding.forString()', ()=>{
   const r = Deck.ranks
   expect(d.Holding.forString('AJT32').ranks).toEqual([r.ace,r.jack, r.ten, r.three, r.two])
   expect(d.Holding.forString('AJ1032').ranks).toEqual([r.ace,r.jack, r.ten, r.three, r.two])
   expect(d.Holding.forString('A J 10  3 2').ranks).toEqual([r.ace,r.jack, r.ten, r.three, r.two])
   
})

test("Hand eachSuit method", () => {
   const cards = Deck.cards.byNames(
      "SQ", "S10", "S9", "HA",
      "H8", "H7", "H6", "H5",
      "H4", "H3", "H2", "DK", "DJ")
   const hand = new d.Hand(cards)
   const suitMap = new Map()
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
   const toWhom = Array.from({ length: 52 }, (v, i) => Seats.all[Math.floor(i / 13)])
   const deal = new d.Deal(toWhom)
   const expected = new Map([
      ["north", "AKQJ1098765432 - - -"],
      ["east", "- AKQJ1098765432 - -"],
      ['south', '- - AKQJ1098765432 -'],
      ['west', '- - - AKQJ1098765432']
   ])
   deal.eachHand((seat, hand) => {
      expect(hand.toString()).toBe(expected.get(seat.name))
   })
})

test("Hand.forHoldings", ()=> {
   const holdings = ['AKQJ','1098','765432','-'].map(d.Holding.forString)
   const hand = d.Hand.forHoldings(holdings)
   expect(hand.spades.asString()).toBe('AKQJ')
   expect(hand.hearts.asString()).toBe('1098')
   expect(hand.diamonds.asString()).toBe('765432')
   expect(hand.clubs.asString()).toBe('-')

})

test("Hand.forHoldings without the right number of suits", ()=> {
   const holdings = ['AKQJ','1098','765432'].map(d.Holding.forString)
   expect(() => d.Hand.forHoldings(holdings)).toThrow()
})

test("Hand.forHoldings without the right number of suits", ()=> {
   const holdings = ['AKQJ','1098','765432','-','-'].map(d.Holding.forString)
   expect(() => d.Hand.forHoldings(holdings)).toThrow()
})

test('Hand.forString()', ()=> {
   const hand = d.Hand.forString('SAK h:qjt D98765432 C')
   expect(hand.spades.toString()).toBe('A K')
   expect(hand.hearts.toString()).toBe('Q J 10')
   expect(hand.diamonds.toString()).toBe('9 8 7 6 5 4 3 2')
   expect(hand.clubs.toString()).toBe('-')
})

test('Hand.forString()', ()=> {
   expect(() => d.Hand.forString('')).toThrow()
})

test("fromBits constructor", ()=> {
   const voidH = d.Holding.fromBits(0)
   expect(voidH.length).toBe(0)
   const holding = d.Holding.fromBits((1<<12)|(1<<11)|(1<<9))
   expect(holding.asString()).toBe('AKJ')
})
