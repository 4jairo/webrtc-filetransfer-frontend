import { ClientStatisticsContext } from "../../context/statisticsContext"
import { formatFileName } from "../format"
import type { FileProps, OnDownloadCompleteType } from "../types"

class FileReciever {
  protected file: FileProps
  protected recievedBytes: number = 0
  protected channel: RTCDataChannel

  protected downloadCompleteCbList: {
    cb: OnDownloadCompleteType
    id: string
  }[] = []

  protected byteCounts: number[] = []
  protected timestamps: number[] = []
  protected lastStatsUpdate: number = 0

  constructor(file: FileProps, channel: RTCDataChannel) {
    ClientStatisticsContext.startRequestedFileStats(
      file.name,
      () => channel.close(),
      (cb) => this.addDownloadCompleteCb(cb),
      (id) => this.removeDownloadComplete(id)
    )

    this.file = file
    this.channel = channel
    this.channel.binaryType = 'arraybuffer'

    this.channel.onclose = () => this.onClose() // download was completed
    // in the subclass, we will set the onmessage listener
  }

  public addDownloadCompleteCb(cb: OnDownloadCompleteType) {
    const id = crypto.randomUUID()
    this.downloadCompleteCbList.push({ cb, id })

    return id
  }

  public removeDownloadComplete(id: string) {
    this.downloadCompleteCbList = this.downloadCompleteCbList
      .filter((e) => e.id !== id)
  }

  protected onClose() {
    console.log('File transfer closed')
    ClientStatisticsContext.removeRequestedFileStats(this.file.name)
  }

  protected updateDownloadStats(sendedBytes: number) {
    const currentTime = Date.now()
    this.timestamps.push(currentTime)
    this.byteCounts.push(sendedBytes)

    while (this.timestamps.length > 0 && this.timestamps[0] < currentTime - 1000) {
      this.timestamps.shift()
      this.byteCounts.shift()
    }


    // Update stats every 500ms
    if (currentTime - this.lastStatsUpdate < 500) return
    this.lastStatsUpdate = currentTime

    const bytesPerSec = this.byteCounts.reduce((acc, curr) => acc + curr, 0) * this.byteCounts.length / 1000
    const percentDone = Math.floor((this.recievedBytes / this.file.length) * 100)
    
    ClientStatisticsContext.updateRequestedFileStats(
      this.file.name, 
      percentDone,
      bytesPerSec,
      this.file.length - this.recievedBytes
    )
  }
}

export class FileRecieverOnDisk extends FileReciever {
  private writable: FileSystemWritableFileStream
  private writableClosed: boolean = false

  constructor(
    file: FileProps,
    channel: RTCDataChannel, 
    writable: FileSystemWritableFileStream
  ) {
    super(file, channel)

    this.writable = writable

    this.channel.onclose = () => {
      this.onClose() // download was completed
      if (!this.writableClosed) this.writable.close()
    }

    this.channel.onmessage = (e) => this.onMessage(e)
  }

  private async onMessage(e: MessageEvent) {

    const data = e.data as ArrayBuffer
    this.recievedBytes += data.byteLength
    this.updateDownloadStats(data.byteLength)

    await this.writable.write(data)

    if (this.recievedBytes >= this.file.length) {
      this.channel.close()
      this.writableClosed = true
      await this.writable.close()
    }
  }
}


export class FileRecieverOnMemory extends FileReciever {
  private buffer: ArrayBuffer[] = []

  constructor(file: FileProps, channel: RTCDataChannel) {
    super(file, channel)
    
    this.channel.onmessage = (e) => this.onMessage(e)
  }

  private onDownloadComplete() {
    const blob = new Blob(this.buffer)
    const downloadNow = this.downloadCompleteCbList
      .map(({ cb }) => cb(blob))
      .some(result => result)

    if (this.downloadCompleteCbList.length === 0 || downloadNow) {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = formatFileName(this.file.name)
      a.click()
    }
  }

  private onMessage(e: MessageEvent) {
    const data = e.data as ArrayBuffer
    this.buffer.push(data)

    this.recievedBytes += data.byteLength
    this.updateDownloadStats(data.byteLength)

    if (this.recievedBytes >= this.file.length) {
      this.onDownloadComplete()
      this.channel.close()
    }
  }
}
