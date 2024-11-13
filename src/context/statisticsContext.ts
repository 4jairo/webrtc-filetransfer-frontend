import { get, writable } from "svelte/store"
import type { RequestedFilesStatsType } from "../lib/types"

const clientCtx = () => {
  const State = writable<{
    [fileName: string]: RequestedFilesStatsType 
  }>({})

  const startRequestedFileStats = (
    fileName: string,
    cancelDownload: RequestedFilesStatsType['cancelDownload'],
    addDownloadComplete: RequestedFilesStatsType['addDownloadComplete'],
    removeDownloadComplete: RequestedFilesStatsType['removeDownloadComplete'],
  ) => {
    State.update((state) => {
      if(state[fileName]) return state

      state[fileName] = {
        percent: 0,
        bytesPerSec: 0,
        remainingBytes: 0,
        cancelDownload,        
        addDownloadComplete,
        removeDownloadComplete,
      }
      return state
    })
  }

  const updateRequestedFileStats = (
    fileName: string, 
    percent: number, 
    bytesPerSec: number, 
    remainingBytes: number
  ) => {
    State.update((state) => {
      if(!state[fileName]) return state
      
      state[fileName] = {
        ...state[fileName],
        percent,
        bytesPerSec,
        remainingBytes,
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

  const isFileRequested = (fileName: string) => {
    return Boolean(getFileStats(fileName))
  }

  const getFileStats = (fileName: string) => {
    return get(State)[fileName] as RequestedFilesStatsType | undefined
  }


  return {
    subscribe: State.subscribe,
    startRequestedFileStats,
    updateRequestedFileStats,
    removeRequestedFileStats,
    isFileRequested,
    getFileStats
  }
}

const hostCtx = () => {
  const State = writable<{
    [fileName: string]: {
      [signalingId: string]: RequestedFilesStatsType
    }
  }>({})

  const updateRequestedFileStats = (fileName: string, signalingId: string, data: RequestedFilesStatsType) => {
    State.update((state) => {
      if (!state[fileName]) {
        state[fileName] = {}
      }

      state[fileName][signalingId] = data
      return state
    })
  }

  const removeRequestedFileStats = (fileName: string, signalingId: string) => {
    State.update((state) => {
      if (!state[fileName]) return state

      delete state[fileName][signalingId]

      if (Object.keys(state[fileName]).length === 0) {
        delete state[fileName]
      }

      return state
    })
  }

  return {
    subscribe: State.subscribe,
    updateRequestedFileStats,
    removeRequestedFileStats
  }
}

export const HostStatisticsContext = hostCtx()
export const ClientStatisticsContext = clientCtx()

 