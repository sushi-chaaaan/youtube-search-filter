"use strict"

import { AvailableStorage } from "./storage"
import { FILTER_AVAILABLE, FILTER_UNAVAILABLE } from "./constant"

let available: boolean
function restoreMode() {
  AvailableStorage.get((av: boolean) => {
    if (typeof av === "undefined") {
      av = false
      AvailableStorage.set(av, () => undefined)
    }
    available = av
  })
}

chrome.storage.onChanged.addListener(function (changes, area) {
  if (area === "sync" && changes.available) {
    available = changes.available.newValue
    available ? console.log(FILTER_AVAILABLE) : console.log(FILTER_UNAVAILABLE)
  }
})

// apply filter
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    console.log(`got url: ${tab.url}`)

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
  const filter_array = ["somen", "からしな"] // TODO: あとからinteractiveな設定を可能にする
  let filter: string
  if (regex) {
    filter = filter_array.map((item) => encodeURIComponent(item)).join("+")
  } else {
    filter = filter_array.join("+")
  }
  console.log(`filter: ${filter}, regex: ${regex}`)
  return filter
}

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

restoreMode()
