//全局数据存储类型接口

import { ProtoType, STYPE } from "./Enum"


export interface userInfo {
    utag: number
    uname: string
    usex: number
}

export interface Isession {
    socket: WebSocket
    isConnected: boolean
    heartBeat:number
    lastHeartBeat:number

    connect: Function
    sendMsg: Function
    close: Function
    startHeartBeat: Function
    stopHeartBeat: Function
}

export interface Iservice {
    sname: string
    stype: STYPE

    onRecvMsg: Function
    onDisconnect: Function
}


export interface IheaderPartLength {
    stype: number
    ctype: number
    utag: number
    protoType: number
    byteLen: number
}

export interface ImessageObjPos {
    stype: number
    ctype: number
    utag: number
    proto_type: number
    byteLen: number
    payLoad: number
}