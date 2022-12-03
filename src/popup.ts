"use strict"

import "./popup.css"
import { FILTER_AVAILABLE, FILTER_UNAVAILABLE } from "./constant"
import { AvailableStorage } from "./storage"
;(function () {
  function setupToggleSwitch(available: boolean) {
    const toggleSwitch = <HTMLInputElement>(
      document.getElementById("toggle-switch")
    )
    // set toggle switch to the current value
    toggleSwitch.checked = available
    writeToggleMessage(available)

    // Popup上での切り替えを検知
    toggleSwitch.onchange = () => {
      available = toggleSwitch.checked
      AvailableStorage.set(available, () => undefined)

      writeToggleMessage(available)
    }
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

  function writeToggleMessage(available: boolean) {
    const ToggleMessage = <HTMLInputElement>(
      document.getElementById("toggle-message")
    )
    ToggleMessage.innerText = available ? FILTER_AVAILABLE : FILTER_UNAVAILABLE
  }

  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === "sync" && changes.available) {
      const available: boolean = changes.available.newValue
      setupToggleSwitch(available)
    }
  })

  document.addEventListener("DOMContentLoaded", restoreToggleSwitch)

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: "GREETINGS",
      payload: {
        message: "Hello, my name is Pop. I am from Popup.",
      },
    },
    (response) => {
      console.log(response.message)
    }
  )
})()
