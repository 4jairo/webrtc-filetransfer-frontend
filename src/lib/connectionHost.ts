import { FilesContext } from "../context/filesContext"
import { HostStatisticsContext } from "../context/statisticsContext"
import { MessageType, STUN_SERVERS, type Message } from "./connectionCommon"
import { API_WS_URL } from "./fetching"

export class HostConnection {
  private ws: WebSocket
  private pcs: { [key: string]: RTCPeerConnection } = {}
  passwordFiles: string
  url: string
  passwordUser: string
  
  constructor(url: string, passwordFiles: string, password: string) { 
    this.url = url
    this.passwordFiles = passwordFiles
    this.passwordUser = password

    setInterval(() => {
      for (const [key, pc] of Object.entries(this.pcs)) {
        if(pc.connectionState === "disconnected" || pc.iceConnectionState === "disconnected") {
          delete this.pcs[key]
        }
      }
    }, 5_000);

    this.ws = new WebSocket(`${API_WS_URL}/host/${url}`)
    this.ws.onmessage = (e) => this.onMessage(e)
    this.ws.onopen = () => this.onOpen()
  }

  private async onMessage (e: MessageEvent) {
    const msg: Message = JSON.parse(e.data)
    
    switch (msg.type) {
      case MessageType.MsgOfferIceCandidate: {
        return await this.onIceCandidate(msg)
      }
      case MessageType.MsgNewOffer: {
        return await this.onNewOffer(msg)
      }
      case MessageType.MsgError: {
        return console.error(msg.data.msg)
      }
    }
  }

  private createPeerConnection(signalingId: string) {
    const pc = new RTCPeerConnection(STUN_SERVERS)

    pc.onicecandidate = (e) => {
      if (!e.candidate) return

      const returnMsg: Message = {
        type: MessageType.MsgAnswerIceCandidate,
        signalingId,
        data: {
          ice: JSON.stringify(e.candidate),
        },
      }

      this.ws.send(JSON.stringify(returnMsg))
    }
    
    pc.ondatachannel = ({ channel }) => {
      const file = FilesContext.getFile(channel.label)
      if(!file) return //TODO

      new FileSender(file, channel, signalingId)
    }
    return pc
  }

  private async onNewOffer(msg: Message) {
    if (!msg.signalingId) return


    const pc = this.createPeerConnection(msg.signalingId)
    this.pcs[msg.signalingId] = pc

    const offer = new RTCSessionDescription({
      type: 'offer',
      sdp: msg.data.sdp
    })
    await pc.setRemoteDescription(offer)

    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    const returnMsg: Message = {
      type: MessageType.MsgNewAnswer,
      signalingId: msg.signalingId,
      data: { sdp: answer.sdp },
    }

    this.ws.send(JSON.stringify(returnMsg))
  }

  private async onIceCandidate(msg: Message) {
    if (!msg.signalingId) return

    const candidate = new RTCIceCandidate(JSON.parse(msg.data.ice))
    const pc = this.pcs[msg.signalingId]
    pc && await pc.addIceCandidate(candidate)
  }

  private async onOpen() {
    this.ws.send(JSON.stringify({
      type: MessageType.MsgListenOffersHost,
      data: {
        passwordFiles: this.passwordFiles,
        url: this.url
      }
    }))
  }
}

// 16729000

const UDP_DATAGRAM_SIZE = 65_000
const BUFFERED_CHUNK_SIZE = UDP_DATAGRAM_SIZE * 10

class FileSender {
  private signalingId: string
  private sendedBytes: number = 0
  private channel: RTCDataChannel
  private file: File
  private loadingFileChunk: boolean = false
  private fileReader: FileReader = new FileReader()

  private connLostInterval: number

  private byteCounts: number[] = []
  private timestamps: number[] = []
  private maxBytesPerSec: number = 0
  private lastStatsUpdate: number = 0

  constructor(file: File, channel: RTCDataChannel, signalingId: string) {
    this.file = file
    this.signalingId = signalingId

    this.channel = channel
    this.channel.binaryType = 'arraybuffer'
    this.channel.onopen = () => this.setFileReader()
    this.channel.bufferedAmountLowThreshold = BUFFERED_CHUNK_SIZE
    this.channel.onbufferedamountlow = () => this.sendChunk()
    this.channel.onclose = () => this.onClose()

    this.connLostInterval = setInterval(() => {

      // If 5 seconds have passed without any data being sent, close the connection
      if(this.timestamps.length && Date.now() - 5_000 - this.timestamps[this.timestamps.length - 1] >= 0) {
        console.log('Connection lost')
        this.channel.close()
        this.onClose()
      }
    }, 1000)
  }

  private setFileReader() {
    this.fileReader.onload = () => {
      if(this.channel.readyState !== 'open') {
        return this.channel.close()
      }

      const buffer = this.fileReader.result as ArrayBuffer
      this.channel.send(buffer)
      this.sendedBytes += buffer.byteLength

      this.updateDownloadStats(buffer.byteLength)

      if (this.sendedBytes < this.file.size) {
        this.loadingFileChunk = false
        this.sendChunk()
      }
    }

    this.fileReader.onerror = (err) => {
      console.error(err)
    }

    this.sendChunk()
  }

  private sendChunk() {
    // If the buffer is too full, wait for it to drain
    if (this.channel.bufferedAmount > BUFFERED_CHUNK_SIZE || this.loadingFileChunk) {
      return
    }

    this.loadingFileChunk = true
    const chunk = this.file.slice(this.sendedBytes, this.sendedBytes + UDP_DATAGRAM_SIZE)
    this.fileReader.readAsArrayBuffer(chunk)
  }

  private onClose() {
    console.log('File transfer closed')
    clearInterval(this.connLostInterval)
    HostStatisticsContext.removeRequestedFileStats(this.file.name, this.signalingId)
  }

  private updateDownloadStats(sendedBytes: number) {
    const currentTime = Date.now()
    this.timestamps.push(currentTime)
    this.byteCounts.push(sendedBytes)

    while (this.timestamps.length > 0 && this.timestamps[0] < currentTime - 1000) {
      this.timestamps.shift()
      this.byteCounts.shift()
    }

    const bytesPerSec = this.byteCounts.reduce((acc, curr) => acc + curr, 0) * this.byteCounts.length / 1000
    this.maxBytesPerSec = Math.max(this.maxBytesPerSec, bytesPerSec)

    // Update stats every 500ms
    if (currentTime - this.lastStatsUpdate < 500) return
    this.lastStatsUpdate = currentTime

    const percentDone = Math.floor((this.sendedBytes / this.file.size) * 100)

    HostStatisticsContext.updateRequestedFileStats(this.file.name, this.signalingId, {
      bytesPerSec,
      percent: percentDone,
      remainingBytes: this.file.size - this.sendedBytes,
      cancelDownload: () => this.channel.close(),
      addDownloadComplete: () => '', //TODO onDownloadComplete listener
      removeDownloadComplete: () => {}, //TODO
    })
  }
} 