import { Application } from "./model/application.js"

var App = new Application()

function backDeal() {
  App.previousDeal()
  return false;
}

function fowardDeal() {
  App.nextDeal()
  return false;
}

function firstDeal() {
  App.chooseCurrent(0)
  return false
}

function lastDeal() {
  App.chooseCurrent(App.length-1)
  return false
}

function onReset() {
  $('#deal').hide()
  $('#preface').show()
}

function visibility(flag) {
  return flag ? 'visible' : 'hidden'
}

function setVisibility(selector,flag) {
  $(selector).css('visibility',visibility(flag))
}

function updatePreviousNext() {
  setVisibility('#backwards',App.allowPrevious)
  setVisibility('#forwards',App.allowNext)
}

function getTitle(dealInfo) {
  var title = dealInfo.edition + " Edition"
  if (dealInfo.scrambled) {
    title = "Scrambled "+ title
  }
  return title
}

function englishHolding(holding) {
  if (holding.length == 0) {
    return 'void'
  }
  var cards = holding.ranks.map((rank) => rank.name)
  if (holding.spots > 0) {
    cards.push(holding.spots.toString() + ' small spots')
  }
  if (cards.length == 1) {
    return cards[0]
  }

  cards[cards.length-1] = ' and ' + cards[cards.length-1]
  return cards.join(', ')
}

function updateDeal(deal) {
  $('#preface').hide()
  deal.eachHand((seat,hand) => {
    var handDiv = $('.diagram .'+seat.name)
    hand.eachSuit((holding,suit) => {
      var hString = holding.toString()
      var language = suit.singular + ' ' + englishHolding(holding)
      if (hString=='-')  { hString = '\u2014' } // emdash 
      var suitSpan = '.'+ suit.name+ ' span.holding'
      handDiv.find(suitSpan).text(hString)
      handDiv.find(suitSpan).attr('title',language)
    })
  })
}
function updateCurrentDeal(dealInfo) {
  
  var dealLoc = $('#deal')

  $('#dealIndex').text(dealInfo.index+1)
  var title = getTitle(dealInfo)
  dealLoc.find('.bookTitle').text(title)
  $('#error').hide()
  dealLoc.find('.pageNumber').text(dealInfo.pageNo)
  updatePreviousNext()
  updateDeal(dealInfo.deal)
  // var hands = dealInfo.deal.hands.map((hand) => hand.toString()).join("\n")
  dealLoc.show()
  
}

function updateDealCount(count) {
  $('#dealCount').text(count)
  updatePreviousNext()
}

function reset() {
  App.reset()
}

function initialize() {
  App.listenCurrentDeal(updateCurrentDeal)
  App.listenDealCount(updateDealCount)
  App.listenReset(onReset)

  const form = $('#lookup')
  form.submit(() => {
    submit_pages(form)
    return false;
  }) 
  $('#reset').on('click',() => reset())
  $('#firstDeal').on('click',() => firstDeal())
  $('#lastDeal').on('click',() => lastDeal())
  $('a.powersOf10').on('click', powersOf(10))
  $('a.powersOf2').on('click', powersOf(2))
  $('a.multiplesOf1E27').on('click', multiplesOf1E27)

  $('#back').on('click',() => backDeal())
  $('#forward').on('click',() => fowardDeal())
  
  App.reset()
}

function determineEdition(form) {
  /*
   * Returns object: {name:string, scrambled:boolean}
   */
  form = form || $('form#lookup')
  var scramble = form.find('select[name="scramble"]').val()
  var edition = form.find('select[name="edition"]').val()
  return {name: edition, scrambled: scramble=='Scrambled'}
}

function submitPages(pageNumbers,form) {
  var edition = determineEdition(form)
  App.findDeals(edition.name,edition.scrambled,pageNumbers)
}

function submit_pages(form) {
  try {
    var pageEntry = form.find('input[name="pageNumbers"]')
    var pageText = $(pageEntry).val()
    var pages = pageText.split(',').map((page)=> BigInt(page))
    submitPages(pages,form)
    $(pageEntry).val('')
    $('#error').hide() 
  } catch (e) {
      console.error(e)
      $('#error').text(e)
      $('#error').show()
      return false
  }
}

function powersOf(n) {
  return function() {
    n = BigInt(n)
    var power = BigInt(1)
    var result = []
    while (power<=App.lastPage) {
      result.push(power)
      power *= n
    }
    submitPages(result)
    return false
  }
}
  
function multiplesOf1E27() {
  var e27 = BigInt('1000000000000000000000000000')
  var result = []
  var page = e27
  while (page<= App.lastPage) {
    result.push(page)
    page += e27
  }
  submitPages(result)
  return false
}

$(document).ready(() => initialize())


export {initialize, App}
