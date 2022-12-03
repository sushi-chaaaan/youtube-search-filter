"use strict"

import "./popup.css"
;(function () {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  const AvailableStorage = {
    get: (callback: (arg0: boolean) => void) => {
      // TODO: 型推論したので、あとから精査
      chrome.storage.sync.get(["available"], (result) => {
        callback(result.available)
      })
    },
    set: (value: boolean, callback: () => void) => {
      // TODO: 型推論したので、あとから精査
      chrome.storage.sync.set(
        {
          available: value,
        },
        () => {
          callback()
        }
      )
    },
  }

  function setupToggleSwitch() {
    const toggleSwitch = <HTMLInputElement>(
      document.getElementById("toggle-switch")
    )

    // Get the current value of `available` from storage
    AvailableStorage.get((available: boolean) => {
      toggleSwitch.checked = available

      updateToggleMessage(available)
    })

    toggleSwitch.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement
      const isChecked = target.checked

      // Set the message of toggle switch
      updateToggleMessage(isChecked)

      // send message to background script
      chrome.runtime.sendMessage({
        type: "TOGGLE_SWITCH",
        payload: {
          isChecked,
        },
      })

      // Store the value of `available` in storage
      AvailableStorage.set(isChecked, () => {})
    })
  }

  function updateToggleMessage(available: boolean) {
    const ToggleMessage = <HTMLInputElement>(
      document.getElementById("toggle-message")
    )
    ToggleMessage.innerText = available ? "ON" : "OFF"
  }

  function restoreToggleSwitch() {
    // Restore count value
    AvailableStorage.get((available: boolean) => {
      if (typeof available === "undefined") {
        // Set counter value as 0
        AvailableStorage.set(false, () => {})
      }
      setupToggleSwitch()
    })
  }

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
