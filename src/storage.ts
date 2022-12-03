export const AvailableStorage = {
  get: (callback: (arg0: boolean) => void) => {
    chrome.storage.sync.get(["available"], (result) => {
      callback(result.available)
    })
  },
  set: (value: boolean, callback: () => void) => {
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
