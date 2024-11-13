import { writable } from "svelte/store"
import type { RequestedFilesStatsType } from "../lib/types"

interface RequestedFilesContextType extends RequestedFilesStatsType {
  _onDownloadComplete: ((buf: Blob) => void)[]
}


const createContext = () => {
  const State = writable<{
    [fileName: string]: RequestedFilesContextType
  }>({
  })

  const addOnDownloadComplete = (fileName: string, cb: (buf: Blob) => void) => {
    State.update((state) => {
      if(!state[fileName]) return state
      state[fileName]._onDownloadComplete.push(cb)
      return state
    })
  }

  const updateRequestedFileStats = (fileName: string, data: RequestedFilesStatsType) => {
    State.update((state) => {
      state[fileName] = {
        ...data,
        _onDownloadComplete: [],
      }
      return state
    })
  }  

  const removeRequestedFileStats = (fileName: string) => {
    State.update((state) => {
      delete state[fileName]
      return state
    })
  }


  return {
    subscribe: State.subscribe,
    updateRequestedFileStats,
    removeRequestedFileStats,
  }
}

export const RequestedFilesContext = createContext()
 