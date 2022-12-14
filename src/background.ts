"use strict"

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

let available = false

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GREETINGS") {
    const message = `Hi ${
      sender.tab ? "Con" : "Pop"
    }, my name is Bac. I am from Background. It's great to hear from you.`

    // Log message coming from the `request` parameter
    console.log(request.payload.message)
    // Send a response message
    sendResponse({
      message,
    })
  }
  return true
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    console.log(`got url: ${tab.url}`)
    // 処理
    if (
      tab.url &&
      tab.url.match(/https?:\/\/www.youtube.com\/results?/) &&
      !tab.url.includes(generate_filter(true)) &&
      available
    ) {
      console.log("url matched. adding filter")
      const filter = generate_filter()
      const new_url = tab.url + "+" + filter
      chrome.tabs.update(tabId, { url: new_url })
    }
  }
  return true
})

function generate_filter(regex = false) {
  const filter_array = ["somen", "からしな"]
  let filter = null
  if (regex) {
    filter = filter_array.map((item) => encodeURIComponent(item)).join("+")
  } else {
    filter = filter_array.join("+")
  }
  console.log(`filter: ${filter}, regex: ${regex}`)
  return filter
}

// eslint-disable-next-line no-unused-vars
chrome.action.onClicked.addListener((tab) => {
  available = !available

  if (available) {
    chrome.action.setIcon({
      path: "icons/search_on.png",
    })
  } else {
    chrome.action.setIcon({
      path: "icons/search_off.png",
    })
  }
})
