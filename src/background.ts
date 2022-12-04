"use strict"

import { FILTER_AVAILABLE, FILTER_UNAVAILABLE, Configuration } from "./constant"
import { ConfigStorage } from "./storage"

function setupConfig() {
  ConfigStorage.get((cf: Configuration) => {
    if (typeof cf === "undefined") {
      cf = <Configuration>{ available: false, filters: [] }
      ConfigStorage.set(cf, () => undefined)
    }
  })
}

chrome.storage.onChanged.addListener(function (changes, area) {
  if (area === "local" && changes.yt_search_filter) {
    changes.yt_search_filter.newValue.available
      ? console.log(FILTER_AVAILABLE)
      : console.log(FILTER_UNAVAILABLE)
  }
})

// apply filter
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    console.log(`got url: ${tab.url}`)
    const current: boolean = await is_available()
    console.log(`got current: ${current}`)

    if (
      tab.url &&
      tab.url.match(/https?:\/\/www.youtube.com\/results?/) &&
      !tab.url.includes(generate_filter(true)) &&
      current
    ) {
      console.log("url matched. adding filter")
      const filter = generate_filter()
      const new_url = tab.url + "+" + filter
      chrome.tabs.update(tabId, { url: new_url })
    }
  }
  return true
})

async function is_available(): Promise<boolean> {
  return new Promise((resolve) => {
    ConfigStorage.get((cf: Configuration) => {
      if (typeof cf === "undefined") {
        cf = <Configuration>{ available: false, filters: [] }
        ConfigStorage.set(cf, () => undefined)
        resolve(false)
      } else {
        resolve(cf.available)
      }
    })
  })
}

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

chrome.runtime.onInstalled.addListener(() => {
  setupConfig()
})

chrome.runtime.onStartup.addListener(() => {
  setupConfig()
})
