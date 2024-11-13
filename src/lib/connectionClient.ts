import { ClientConnContext, ConnectionState } from "../context/clientConnContext"
import { MessageType, STUN_SERVERS, type Message } from "./connectionCommon"
import { API_WS_URL } from "./fetching"
import { OnDisk } from "./fileReciever/common"
import { FileRecieverOnDisk, FileRecieverOnMemory } from "./fileReciever/fileReciever"
import { formatFileName } from "./format"
import type { FileProps } from "./types"

export class ClientConnection {
  private ws: WebSocket
  private pc: RTCPeerConnection
  public url: string
  
  constructor(signalingId: string, url: string) { 
    this.url = url
    this.pc = new RTCPeerConnection(STUN_SERVERS)

    this.ws = new WebSocket(`${API_WS_URL}/conn/${signalingId}`)
    this.ws.onmessage = (e) => this.onMessage(e)
    this.ws.onopen = () => this.onOpen()
  }


  private async onOpen() {
    this.ws.send(JSON.stringify({
      type: MessageType.MsgListenOffersConn,
      data: {},
    }))

    // create temp channel for ice
    const tempConn = this.pc.createDataChannel('')
    tempConn.onopen = () => {
      tempConn.close()
      ClientConnContext.setConnected(ConnectionState.Connected)
    }
    
    // Listen for ice candidates
    this.pc.onicecandidate = (e) => {
      if (!e.candidate) return
      
      this.ws.send(JSON.stringify({
        type: MessageType.MsgOfferIceCandidate,
        data: {
          ice: JSON.stringify(e.candidate),
        },
      }))
    }

    // Create offer and send it
    const offer = await this.pc.createOffer()
    await this.pc.setLocalDescription(offer)

    this.ws.send(JSON.stringify({
      type: MessageType.MsgNewOffer,
      data: {
        sdp: offer.sdp,
      },
    }))
  }
  
  private async onMessage (e: MessageEvent) {
    const msg: Message = JSON.parse(e.data)

    switch (msg.type) {
      case MessageType.MsgNewAnswer: {
        return await this.onNewAnswer(msg)
      }        
      case MessageType.MsgAnswerIceCandidate: {
        return await this.onIceCandidate(msg)
      }
      case MessageType.MsgError: {
        return console.error(msg.data)
      }
    }
  }

  private async onNewAnswer(msg: Message) {
    const answer = new RTCSessionDescription({
      type: 'answer',
      sdp: msg.data.sdp,
    })
    await this.pc.setRemoteDescription(answer)
  }

  private async onIceCandidate(msg: Message) {
    const candidate = new RTCIceCandidate(JSON.parse(msg.data.ice))
    await this.pc.addIceCandidate(candidate)
  }

  public createDataChannel(filename: string) {
    return this.pc.createDataChannel(filename)
  }

  public async downloadFile(file: FileProps) {
    // some browsers don't have window.showSaveFilePicker
    if(OnDisk.enabled) {
      const fileName = formatFileName(file.name)
      const writable = await OnDisk.getWritable(fileName)

      const dc = this.pc.createDataChannel(file.name)
      new FileRecieverOnDisk(file, dc, writable)

    } else {
      const dc = this.pc.createDataChannel(file.name)
      new FileRecieverOnMemory(file, dc)
    }
  }
}