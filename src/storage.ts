import { Configuration } from "./constant"

export const ConfigStorage = {
  get: (callback: (arg0: Configuration) => void) => {
    chrome.storage.local.get(["yt_search_filter"], (result) => {
      callback(result.yt_search_filter)
    })
  },
  set: (value: Configuration, callback: () => void) => {
    chrome.storage.local.set(
      {
        yt_search_filter: value,
      },
      () => {
        callback()
      }
    )
  },
}
