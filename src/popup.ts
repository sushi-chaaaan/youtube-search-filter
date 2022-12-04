"use strict"

import "./popup.css"
import { FILTER_AVAILABLE, FILTER_UNAVAILABLE, Configuration } from "./constant"
import { ConfigStorage } from "./storage"
;(function () {
  function setupToggleSwitch(config: Configuration) {
    const toggleSwitch = <HTMLInputElement>(
      document.getElementById("toggle-switch")
    )
    // set toggle switch to the current value
    toggleSwitch.checked = config.available
    writeToggleMessage(config.available)

    // Popup上での切り替えを検知
    toggleSwitch.onchange = () => {
      config.available = toggleSwitch.checked
      ConfigStorage.set(config, () => undefined)

      writeToggleMessage(config.available)
    }
  }

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

  function writeToggleMessage(available: boolean) {
    const ToggleMessage = <HTMLInputElement>(
      document.getElementById("toggle-message")
    )
    ToggleMessage.innerText = available ? FILTER_AVAILABLE : FILTER_UNAVAILABLE
  }

  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === "local" && changes.yt_search_filter) {
      const __config: Configuration = changes.yt_search_filter.newValue
      setupToggleSwitch(__config)
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
