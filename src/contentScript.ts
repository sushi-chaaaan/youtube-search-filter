"use strict"

import { AvailableStorage } from "./storage"

function setupToggleSwitch(available: boolean) {
  const toggle_filter = <HTMLButtonElement>document.createElement("button")
  toggle_filter.id = "youtube-search-filter-toggle"
  toggle_filter.innerHTML = `Filter is ${available ? "ON" : "OFF"}`

  toggle_filter.onclick = () => {
    available = !available
    AvailableStorage.set(available, () => undefined)
    setupToggleSwitch(available)
  }

  writeToggleSwitch(toggle_filter)
}

function restoreToggleSwitch() {
  AvailableStorage.get((available: boolean) => {
    if (typeof available === "undefined") {
      available = false
      AvailableStorage.set(available, () => undefined)
    }
    setupToggleSwitch(available)
  })
}

chrome.storage.onChanged.addListener(function (changes, area) {
  if (area === "sync" && changes.available) {
    const available: boolean = changes.available.newValue
    setupToggleSwitch(available)
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
