"use strict"

import { Configuration, FILTER_AVAILABLE, FILTER_UNAVAILABLE } from "./constant"
import { ConfigStorage } from "./storage"

function restoreToggleSwitch() {
  ConfigStorage.get((config: Configuration) => {
    if (typeof config === "undefined") {
      config = <Configuration>{
        available: false,
        filters: [],
      }
      ConfigStorage.set(config, () => undefined)
    }
    setupToggleSwitch(config)
  })
}

function setupToggleSwitch(config: Configuration) {
  const toggle_filter = <HTMLButtonElement>document.createElement("button")
  toggle_filter.id = "youtube-search-filter-toggle"
  toggle_filter.innerHTML = config.available
    ? FILTER_AVAILABLE
    : FILTER_UNAVAILABLE

  toggle_filter.onclick = () => {
    config.available = !config.available
    ConfigStorage.set(config, () => undefined)
    setupToggleSwitch(config)
  }

  writeToggleSwitch(toggle_filter)
}

chrome.storage.onChanged.addListener(function (changes, area) {
  if (area === "local" && changes.yt_search_filter) {
    const __config: Configuration = changes.yt_search_filter.newValue
    setupToggleSwitch(__config)
  }
})

function writeToggleSwitch(button: HTMLButtonElement) {
  const search_input = <HTMLInputElement>document.getElementById("center")

  if (
    <HTMLInputElement>document.getElementById("youtube-search-filter-toggle")
  ) {
    search_input.replaceChild(
      button,
      <HTMLInputElement>document.getElementById("youtube-search-filter-toggle")
    )
  } else search_input.appendChild(button)
}

restoreToggleSwitch()
