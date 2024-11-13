export const STUN_SERVERS = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302'],
    },
    {
      urls: 'turn:turn.bistri.com:80',
      credential: 'homeo',
      username: 'homeo'
   },
  ],
}



export const enum MessageType {
  MsgListenOffersHost,
  MsgListenOffersConn,
  MsgOfferIceCandidate,
	MsgAnswerIceCandidate,
	MsgNewAnswer,
	MsgNewOffer,
  MsgError
}


export interface Message {
  type: MessageType
  data: any
  signalingId: string 
}