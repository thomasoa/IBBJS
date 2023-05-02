
import { Application } from "../model/application.js"
var App = new Application()

function backDeal() {
  App.previousDeal()
  return false;
}

function fowardDeal() {
  App.nextDeal()
  return false;
}

function visibility(flag) {
  return flag ? 'visible' : 'hidden'
}

function setVisibility(selector,flag) {
  $(selector).css('visibility',visibility(flag))
}

function updatePreviousNext() {
  setVisibility('#back',App.allowPrevious)
  setVisibility('#forward',App.allowNext)
}

function updateCurrentDeal(dealInfo) {

    var dealLoc = $('#deal')
    if (dealInfo == undefined) {
      dealLoc.hide()
      return
    } else {
      $('#dealIndex').text(dealInfo.index+1)
      var title = dealInfo.edition + " Edition"
      if (dealInfo.scrambled) {
        title = "Scrambled "+ title
      }
      $('#bookTitle').text(title)
      $('#error').hide()
      $('#pageNumber').text(dealInfo.pageNo)
      updatePreviousNext()
      dealInfo.deal.eachHand((seat,hand) => {
        var handDiv = $('.diagram .'+seat.name)
        hand.eachSuit((suit,holding) => {
          var hString = holding.toString()
          if (hString=='-')  { hString = '\u2014' }
          handDiv.find('.'+suit.name+ ' span.holding').text(hString)
        })
      })
      // var hands = dealInfo.deal.hands.map((hand) => hand.toString()).join("\n")
      dealLoc.show()
    }
}

function updateDealCount(count) {
  $('#dealCount').text(count)
  updatePreviousNext()
}
      
function reset() {
  App.reset()
    $('#lookup').find('input[name="pageNumbers"]').val('')

}
function initialize() {
    App.listenCurrentDeal(updateCurrentDeal)
    App.listenDealCount(updateDealCount)
    const form = $('#lookup')
    form.submit(() => {
        submit_pages(form)
        return false;
    }) 
    $('#reset').on('click',() => reset())
    $('#back').on('click',() => backDeal())
    $('#forward').on('click',() => fowardDeal())
    App.reset()
}

function submitPages(form,pageNumbers) {
  var scramble = form.find('select[name="scramble"]').val()
    var edition = form.find('select[name="edition"]').val()
    App.findDeals(edition,scramble=='Scrambled',pageNumbers)
}

function submit_pages(form) {
  try {
    var pageEntry = form.find('input[name="pageNumbers"]')
    var pageText = $(pageEntry).val()
    var pages = pageText.split(',').map((page)=> BigInt(page))
    submitPages(form,pages)
    $(pageEntry).val('')
    $('#error').hide() } catch (e) {
    console.error(e)
    $('#error').text(e)
    $('#error').show()
    return false
  }
}

export {initialize, App}
