import { CTYPE, ProtoType, STYPE } from './Enum'
import { createDataView, headerSize, readHeaderInDataView, readStrInDataView, writeHeaderInDataView, writeStrInDataView } from './protoTools'

//Buffer加密
export function encryptBuffer(buf: ArrayBuffer): ArrayBuffer {
    return buf
}
//Buffer解密
export function decryptBuffer(buf: ArrayBuffer): ArrayBuffer {
    return buf
}


//从0到1编解码消息
export function encodeBuffer(stype: number, ctype: number, utag: number, protpType: ProtoType, payLoad: any): ArrayBuffer {
    console.log('encodeBuffer =====> 从0到1编码消息')
    //原消息体 → 对象 → Json
    let payLoadObj: {} = {}
    payLoadObj[0] = payLoad
    let payLoadJson: string = JSON.stringify(payLoadObj)

    //获取消息体长度
    let byteLen: number = new Blob([payLoadJson]).size
    //消息长度 = 消息头长度12字节 + 消息体长度
    let totalLen: number = headerSize + byteLen
    //创建消息长度的DataView对象
    let dataview: DataView = createDataView(totalLen)


    //向DataView写入消息头   12字节
    writeHeaderInDataView(dataview, stype, ctype, utag, protpType, byteLen)

    //向DataView写入消息体字符串
    writeStrInDataView(dataview, payLoadJson)

    //从DataView获取Buffer
    let buf: ArrayBuffer = dataview.buffer

    //加密
    buf = encryptBuffer(buf)

    if (buf) {
        console.log('从0到1编码成功')
        return buf
    } else {
        console.warn('从0到1编码失败')
        return null
    }

}
export function decodeBuffer(buf: ArrayBuffer): {} {
    console.log('decodeBuffer =====> 从0到1解码消息')
    //解密
    decryptBuffer(buf)

    //创建DataView
    let dataview = new DataView(buf)

    //若消息总长度小于消息头长度，则退出
    if (!dataview) {
        console.warn('没有消息')
        return null
    } else if (dataview.byteLength < headerSize) {
        console.warn('消息比消息头还小')
        return null
    }

    //解码消息头
    let headerObj = readHeaderInDataView(dataview)
    let messageObj = {}
    for (let i = 0; i < 5; i++) {
        messageObj[i] = headerObj[i]
    }

    //解码消息体
    let payLoadJson = readStrInDataView(dataview)
    try {
        let payLoadObj = JSON.parse(payLoadJson)
        messageObj[5] = payLoadObj[0]
    }
    catch (err) {
        console.warn('从0到1编码失败，Json解析失败')
        return null
    }

    if (!messageObj ||
        typeof (messageObj[0]) == "undefined" ||
        typeof (messageObj[1]) == "undefined" ||
        typeof (messageObj[2]) == "undefined" ||
        typeof (messageObj[3]) == "undefined" ||
        typeof (messageObj[4]) == "undefined" ||
        typeof (messageObj[5]) == "undefined") {
        console.warn('从0到1解码失败，messageObj里有undefined')
        return null
    } else {
        console.log('从0到1解码成功')
        return messageObj
    }
}
