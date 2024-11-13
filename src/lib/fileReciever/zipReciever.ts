import type JSZip from "jszip"
import type { JSZipStreamHelper } from "jszip"
import { ClientStatisticsContext } from "../../context/statisticsContext"


class ZipReciever {
  protected zip: JSZipStreamHelper<ArrayBuffer>

  protected byteCounts: number[] = []
  protected timestamps: number[] = []
  protected lastStatsUpdate: number = 0
  protected recievedBytes: number = 0
  protected dirPath: string


  constructor(zip: JSZip, dirPath: string) {
    ClientStatisticsContext.startRequestedFileStats(
      dirPath,
      () => this.cancelDownload(),
      () => '',
      () => {},
    )
    
    this.dirPath = dirPath
    this.zip = zip.generateInternalStream({ 
      type: 'arraybuffer',
      streamFiles: true,
    }).resume()
  }

  protected cancelDownload() {
    this.zip.pause()
    ClientStatisticsContext.removeRequestedFileStats(this.dirPath)
  }

  protected updateDownloadStats(sendedBytes: number, percentDone: number) {
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
    const remainingBytes = Math.abs(percentDone - 100) / 100 * this.recievedBytes
    
    ClientStatisticsContext.updateRequestedFileStats(
      this.dirPath, 
      percentDone,
      bytesPerSec,
      remainingBytes,
    )
  }
}

export class ZipRecieverOnMemory extends ZipReciever {
  private buffer: ArrayBuffer[] = []

  constructor(zip: JSZip, dirPath: string) {
    super(zip, dirPath)

    this.zip.on('data', (d,m) => this.onData(d,m))
    this.zip.on('end', () => this.onEnd(true))
    this.zip.on('error', (_e) => this.onEnd(false))
  }

  private onData(data: ArrayBuffer, md: JSZip.JSZipMetadata) {
    this.buffer.push(data)
    this.recievedBytes += data.byteLength

    this.updateDownloadStats(data.byteLength, Math.round(md.percent * 100) / 100)
  }

  private onEnd(succes: boolean) {
    ClientStatisticsContext.removeRequestedFileStats(this.dirPath)
    if (!succes) return

    const blob = new Blob(this.buffer, { type: 'application/zip' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = this.dirPath.replace('/', '_') + '.zip'
    a.click()
  }
}


export class ZipRecieverOnDisk extends ZipReciever {
  private writable: FileSystemWritableFileStream

  constructor(zip: JSZip, writable: FileSystemWritableFileStream, dirPath: string) {
    super(zip, dirPath) 

    this.writable = writable

    this.zip.on('data', (d) => this.onData(d))
    this.zip.on('end', () => this.onEnd())
    this.zip.on('error', (_e) => this.onEnd())
  }

  private async onData(data: ArrayBuffer) {
    this.recievedBytes += data.byteLength
    this.updateDownloadStats(data.byteLength, 0)

    await this.writable.write(data)
  }

  private async onEnd() {
    ClientStatisticsContext.removeRequestedFileStats(this.dirPath)
    await this.writable.close()
  }
}

