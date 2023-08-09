import { Isession } from '.'
import { CTYPE, ProtoType, STYPE } from './Enum'
import { eventTarget } from './Global_WebSocket'
import { encodeBuffer } from './protoMgr'
import { serviceMatch, serviceModules } from './serviceMgr'


//优化、封装WebSocket操作
export const session: Isession = {
    //WebSocket连接
    socket: null!,
    //连接状态
    isConnected: false,



    //初始化连接
    //传入一个字符串（url），一个二进制类型（BinaryType），一个消息体中转类型
    connect(url: string, binaryType: BinaryType) {
        console.log('connect =====> 开始建立socket')
        if (session.isConnected) {
            console.warn('不能重复连接')
            return false
        } else {
            //创建socket
            session.socket = new WebSocket(url)
            //定义二进制类型
            session.socket.binaryType = binaryType


            //socket事件绑定
            session.socket.onopen = _onOpen.bind(session)
            session.socket.onmessage = _onRecv.bind(session)
            session.socket.onclose = _onClose.bind(session)
            session.socket.onerror = _onErr.bind(session)

            return true
        }
    },

    //向服务端发送消息
    //传入一个服务号，一个命令号，一个消息体
    sendMsg(stype: STYPE, ctype: CTYPE, utag: number, protoType: ProtoType, payLoad: any) {
        console.log('sendMsg =====> 客户端发送消息')
        console.log('服务号：' + stype + '       ' + '命令号：' + ctype + 'utag：' + utag)
        if (!session.socket || !session.isConnected) {
            console.log('socet尚未建立，发送消息失败')
            return
        }

        //从0到1编码消息
        let buf = encodeBuffer(stype, ctype, utag, protoType, payLoad)
        if (buf) {
            session.socket.send(buf)
            console.log('发送成功')
        } else {
            console.log('发送失败')
        }
    },

    //关闭连接
    close() {
        console.log('close =====> socket关闭')
        //停止心跳
        session.stopHeartBeat()
        if (!session.socket) {
            console.warn('socket不存在，关闭失败')

        } else if (!session.isConnected) {
            console.warn('socket已关闭，关闭失败')
        }
        else {
            session.socket.close()
            console.log('socket关闭成功')
        }
    },


    //心跳ID
    heartBeat: null,
    //上次心跳响应时间
    lastHeartBeat: null,
    //开始心跳
    startHeartBeat(stype: STYPE, utag: number, protoType: number, payLoad: any) {
        console.log('startHeartBeat =====> 开始心跳')
        session.lastHeartBeat = Date.now()
        //每隔3S发送心跳包
        session.heartBeat = setInterval(() => {
            //若5S未收到心跳响应，则关闭session
            if (Date.now() - session.lastHeartBeat > 10000) {
                console.warn("网络可能已断开")
                session.close()
            }
            session.sendMsg(stype, CTYPE.HeartCheck, utag, protoType, payLoad)
        }, 3000)
    },
    //停止心跳
    stopHeartBeat() {
        console.log('stopHeartBeat =====> 停止心跳')
        if (session.heartBeat) {
            clearInterval(session.heartBeat)
        }

    }
}

//连接成功的回调
function _onOpen(event: Event) {
    console.log('_onOpen =====> socket建立成功')
    session.isConnected = true
    eventTarget.emit('onConnect')
}

//接收消息的回调
function _onRecv(event: MessageEvent) {
    console.log('_onRecv =====> 客户端收到消息')

    //获取消息Buffer
    let buf: ArrayBuffer = event.data
    //若消息不是Buffer，则关闭session
    if (!buf) {
        console.warn('消息不存在')
        console.warn('socket关闭')
        session.close()
    }
    //否则，匹配对应服务
    else if (!serviceMatch(session, buf)) {
        console.warn('socket关闭')
        session.close()
    }
}

//断连的回调
function _onClose(event: CloseEvent) {
    console.log('_onClose =====> socket已关闭')
    //标记session未连接
    session.isConnected = false
    session.socket = null
    //调用所有service的断连处理方法
    for (let stype in serviceModules) {
        serviceModules[stype].onDisconnect(stype, session)
    }
}

//error的回调
function _onErr(event: Event) {
    console.log('_onErr =====> socket出错')
    session.close()
}




