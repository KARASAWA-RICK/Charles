//service管理

import { Iservice, Isession } from "."
import { CTYPE, ProtoType, STYPE } from "./Enum"

import { decodeBuffer } from "./protoMgr"

//service全局存储对象
export const serviceModules = {} as Record<STYPE, Iservice>



//注册service
export function registService(stype: STYPE, service: Iservice) {
    console.log('registService =====> 注册服务：' + stype)
    if (serviceModules[stype]) {
        console.warn(serviceModules[stype].sname + '服务已被注册！')
    } else {
        serviceModules[stype] = service
        console.log(serviceModules[stype].sname + '服务注册成功！')
    }
}




//根据接收的消息匹配服务
//从0到1解码消息 + 执行对应服务的命令号匹配方法
//传入一个session对象，一个Buffer对象（消息）
export function serviceMatch(session: Isession, buf: ArrayBuffer) {
    console.log('serviceMatch =====> 匹配服务号')

    //从0到1解码消息
    let messageObj: {} = decodeBuffer(buf)
    let stype: STYPE, ctype: CTYPE, utag: number, protoType: ProtoType, byteLen: number, payLoad: any
    stype = messageObj[0]
    ctype = messageObj[1]
    utag = messageObj[2]
    protoType = messageObj[3]
    byteLen = messageObj[4]
    payLoad = messageObj[5]
    console.log('消息头：' + stype + '  ' + ctype + '  ' + utag + '  ' + protoType + '  ' + byteLen)
    console.log('消息体：' + payLoad)


    //根据消息头里的服务号检查：是否有匹配的服务
    if (!serviceModules[stype]) {
        console.warn('没有匹配的服务')
        return false
    } else {
        console.log('有匹配的服务')
        //执行对应服务的命令号匹配方法
        serviceModules[stype].onRecvMsg(session, stype, ctype, utag, protoType, payLoad, buf)
        return true
    }
}