import JSZip from "jszip"
import { get, writable } from "svelte/store"
import { ClientConnection } from "../lib/connectionClient"
import { fetchNewSignaling } from "../lib/fetching"
import { OnDisk } from "../lib/fileReciever/common"
import { FileRecieverOnMemory } from "../lib/fileReciever/fileReciever"
import { ZipRecieverOnDisk, ZipRecieverOnMemory } from "../lib/fileReciever/zipReciever"
import type { FileProps, UnexpectedErrorProps } from "../lib/types"
import { ClientStatisticsContext } from "./statisticsContext"

export const enum ConnectionState {
  Connecting = 'Connecting...',
  Connected = 'Connected',
  WaitingPassword = 'Waiting for password...',
}


const createContext = () => {
  let conn: ClientConnection | null = null

  const State = writable<{
    connState: ConnectionState
  }>({
    connState: ConnectionState.WaitingPassword,
  })
  
  const setConnected = (newValue: ConnectionState) => {
    State.update((state) => {
      state.connState = newValue
      return state
    })
  }

  const connect = async (url: string, passwordUser: string, setError: (err: UnexpectedErrorProps | null) => void) => {
    if(conn?.url === url) {
      console.log('Already connected to this url')
      return
    }

    try {
      const { id } = await fetchNewSignaling({ url, passwordUser })
  
      conn = new ClientConnection(id, url)
      setError(null)
    } catch (error) {
      setError(error as UnexpectedErrorProps)
    }
  }

  const downloadFile = async (file: FileProps) => {
    const { connState } = get(State)
    if (!conn || !connState) return
    
    const requestedFile = ClientStatisticsContext.getFileStats(file.name)
    if(requestedFile) {
      requestedFile.addDownloadComplete((_) => true)
      return
    }

    conn.downloadFile(file)
  }
 
  const downloadFilesAsZip = async (zipName: string, files: FileProps[], compressionLevel: number) => {
    if(files.length === 0) return

    const { connState } = get(State)
    if (!conn || !connState) return

    const onDiskEnabled = OnDisk.enabled

    const writable = onDiskEnabled
      ? await OnDisk.getWritable(`${zipName}.zip`)
      : null

    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const requestedFile = ClientStatisticsContext.getFileStats(file.name)
        if(requestedFile) {
          requestedFile.addDownloadComplete((buf) => {
            resolve({ props: file, buf })
            return true // true == download also the file
          })
        }

        else {
          const dc = conn!.createDataChannel(file.name)
          const onDownloadComplete = (buf: Blob) => {
            resolve({ props: file, buf })
            return false // false == don't download the file (only the zip)
          }
          
          const fr = new FileRecieverOnMemory(file, dc)
          fr.addDownloadCompleteCb(onDownloadComplete)
        }
      })      
    }) as Promise<{ 
      buf: Blob,
      props: FileProps
    }>[]

    const zip = new JSZip()

    for (const result of await Promise.allSettled(promises)) {
      if (result.status !== 'fulfilled') continue

      const file = result.value
      zip.file(file.props.name, file.buf, {
        binary: true,
        date: new Date(file.props.lastModified),
        compression: 'DEFLATE',
        compressionOptions: {
          level: compressionLevel
        }
      })
    }

    if(onDiskEnabled) {
      new ZipRecieverOnDisk(zip, writable!, zipName)
    } else {
      new ZipRecieverOnMemory(zip, zipName)
    }
  }

  const cancelDownload = (fileName: string) => {
    const state = get(State)
    const requestedFile = ClientStatisticsContext.getFileStats(fileName)
    if (!conn || !state.connState || !requestedFile) return

    requestedFile.cancelDownload()
  }


  return {
    subscribe: State.subscribe,
    connect,
    downloadFilesAsZip,
    downloadFile,
    cancelDownload,
    setConnected,
  }
}

export const ClientConnContext = createContext()
 