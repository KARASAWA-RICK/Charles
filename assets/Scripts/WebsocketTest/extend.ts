// 扩展DataView 读/写字符串 -->utf8的
DataView.prototype['writeUtf8'] = function (offset: number, str: string): void {
    let encoder = new TextEncoder()
    let utf8Array = encoder.encode(str)
    for (let i = 0; i < utf8Array.length; i++) {
        this.setUint8(offset + i, utf8Array[i])
    }
}

DataView.prototype['readUtf8'] = function (offset: number, byte_length: number): string {
    let array = new Uint8Array(this.buffer, offset, byte_length)
    let decoder = new TextDecoder()
    return decoder.decode(array)
}

// 字符串 你好, 长度是2，不代表字节数,buf协议，写入字符串的字节数，String扩充一个接口 
String.prototype['utf8ByteLen'] = function (): number {
    return new Blob([this]).size
}
