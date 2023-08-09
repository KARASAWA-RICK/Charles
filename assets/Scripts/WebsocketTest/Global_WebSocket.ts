//全局数据存储

import { IheaderPartLength, ImessageObjPos, userInfo } from "."
import { EventTarget } from 'cc'

import { CTYPE, STYPE } from "./Enum"

//聊天室玩家信息
export const userInfoChat: userInfo = {
    utag: 0,
    uname: '',
    usex: 0
}



//消息头各部分长度
export const headerPartLength: IheaderPartLength = {
    stype: 2,
    ctype: 2,
    utag: 4,
    protoType: 2,
    byteLen: 2
}

//消息对象各部分位置
export const messageObjPos: ImessageObjPos = {
    stype: 0,
    ctype: 1,
    utag: 2,
    proto_type: 3,
    byteLen: 4,
    payLoad: 5
}

//全局事件监听者
export const eventTarget: EventTarget = new EventTarget()