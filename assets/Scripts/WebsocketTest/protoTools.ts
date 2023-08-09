//DataView操作

import { CTYPE, ProtoType, STYPE } from "./Enum";

//消息头长度
//12字节 = 2字节服务号 + 2字节命令号 + 4字节utag + 2字节消息体中转类型 + 2字节消息体长度
export const headerSize: number = 12;

//创建DataView对象
//创建一个totalLen字节的DataView对象
export function createDataView(totalLen: number): DataView {
  let buf = new ArrayBuffer(totalLen);
  let dataView = new DataView(buf);
  return dataView;
}

//读写数字
//以小尾的形式，1字节整数的规格，向DataView对象的offset字节写入一个整数
export function readInt8(dataview: DataView, offset: number): number {
  return dataview.getInt8(offset);
}
export function writeInt8(
  dataview: DataView,
  offset: number,
  value: number
): void {
  dataview.setInt8(offset, value);
}
export function readInt16(dataview: DataView, offset: number): number {
  return dataview.getInt16(offset, true);
}
export function writeInt16(
  dataview: DataView,
  offset: number,
  value: number
): void {
  dataview.setInt16(offset, value, true);
}
export function readInt32(dataview: DataView, offset: number): number {
  return dataview.getInt32(offset, true);
}
export function writeInt32(
  dataview: DataView,
  offset: number,
  value: number
): void {
  dataview.setInt32(offset, value, true);
}
export function readUint32(dataview: DataView, offset: number): number {
  return dataview.getUint32(offset, true);
}
export function writeUint32(
  dataview: DataView,
  offset: number,
  value: number
): void {
  dataview.setUint32(offset, value, true);
}
export function readFloat(dataview: DataView, offset: number): number {
  return dataview.getFloat32(offset, true);
}
export function writeFloat(
  dataview: DataView,
  offset: number,
  value: number
): void {
  dataview.setFloat32(offset, value, true);
}

//读写字符串
export function readStr(
  dataview: DataView,
  offset: number,
  byteLen: number
): string {
  let array = new Uint8Array(dataview.buffer, offset, byteLen);
  let decoder = new TextDecoder();
  return decoder.decode(array);
}
export function writeStr(
  dataview: DataView,
  offset: number,
  str: string
): void {
  let encoder = new TextEncoder();
  let utf8Array = encoder.encode(str);
  for (let i = 0; i < utf8Array.length; i++) {
    dataview.setUint8(offset + i, utf8Array[i]);
  }
}

//读写消息头   12字节
export function readHeaderInDataView(dataview: DataView): {} {
  let stype: STYPE = readInt16(dataview, 0);
  let ctype: CTYPE = readInt16(dataview, 2);
  let utag: number = readUint32(dataview, 4);
  let protoType: ProtoType = readInt16(dataview, 8);
  let byteLen: number = readInt16(dataview, 10);
  return {
    0: stype,
    1: ctype,
    2: utag,
    3: protoType,
    4: byteLen,
  };
}
export function writeHeaderInDataView(
  dataview: DataView,
  stype: number,
  ctype: number,
  utag: number,
  protoType: ProtoType,
  byteLen: number
) {
  writeInt16(dataview, 0, stype);
  writeInt16(dataview, 2, ctype);
  //固定写入当前客户端utag
  writeUint32(dataview, 4, utag);
  writeInt16(dataview, 8, protoType);
  writeInt16(dataview, 10, byteLen);
}

//单独写入消息体中转类型   2字节
export function writePrototypeInDataView(
  dataview: DataView,
  protoType: ProtoType
): void {
  writeInt16(dataview, 8, protoType);
}

//读写消息体字符串
export function readStrInDataView(dataview: DataView): string {
  let ByteLen = readInt16(dataview, 10);
  let payLoadJson = readStr(dataview, 12, ByteLen);
  return payLoadJson;
}
export function writeStrInDataView(dataview: DataView, payLoadJson: string) {
  writeStr(dataview, 12, payLoadJson);
}
