//聊天室服务，服务号1

import { Label, Prefab, ScrollView, find, instantiate } from "cc";
import { Iservice, Isession } from ".";
import { CTYPE, ProtoType, Respones, STYPE } from "./Enum";
import { ChatroomView } from "./ChatroomView";
import { eventTarget } from "./Global_WebSocket";
import { session } from "./sessionMgr";

//自己进入
function onEnter(payLoad: any) {
  if (payLoad == Respones.OK) {
    eventTarget.emit("showTipMsg", "你成功进入聊天室");
  } else if (payLoad == Respones.IS_IN_CHATROOM) {
    eventTarget.emit("showTipMsg", "你已经在聊天室了");
  } else if (payLoad == Respones.INVALID_PARAMS) {
    eventTarget.emit("showTipMsg", "用户无效");
  }
}
//自己退出
function onExit(payLoad: any) {
  if (payLoad == Respones.OK) {
    eventTarget.emit("showTipMsg", "你已离开聊天室");
    session.close();
  } else if (payLoad == Respones.NOT_IN_CHATROOM) {
    eventTarget.emit("showTipMsg", "你不在聊天室");
  }
}
//他人进入
function onUserEnter(payLoad: any) {
  eventTarget.emit("showTipMsg", payLoad + "进入聊天室");
}
//他人退出
function onUserExit(payLoad: any) {
  eventTarget.emit("showTipMsg", payLoad + "离开聊天室");
}
//自己发言
function onSendMsg(payLoad: any) {
  if (payLoad[0] == Respones.OK) {
    eventTarget.emit("showSelfChat", payLoad[1], payLoad[2]);
  } else if (payLoad[0] == Respones.NOT_IN_CHATROOM) {
    eventTarget.emit("showTipMsg", "你还没进房间");
  }
}
//他人发言
function onUserMsg(payLoad: any) {
  if (payLoad[0] == Respones.OK) {
    eventTarget.emit("showOtherChat", payLoad[1], payLoad[2]);
  }
}

//收到心跳响应
function onHeartRespones(session: Isession, payLoad: string) {
  console.log("onHeartRespones =====> 收到命令号HeartCheck");
  if (payLoad == "心跳响应") {
    console.log("收到心跳响应!!!!!!!!");
    //更新最新心跳
    session.lastHeartBeat = Date.now();
  } else {
    console.warn("不是心跳响应");
  }
}

export const chatroomService: Iservice = {
  //服务名
  sname: "Chatroom",
  //服务号
  stype: STYPE.Chatroom,

  //命令号匹配方法
  onRecvMsg(
    session: Isession,
    stype: STYPE,
    ctype: CTYPE,
    utag: number,
    protoType: ProtoType,
    payLoad: any,
    buf: ArrayBuffer
  ) {
    console.log("onRecvMsg =====> 聊天室命令号匹配");
    console.log("服务端消息：");
    console.log(
      "消息头：" + stype + "  " + ctype + "  " + utag + "  " + protoType
    );
    console.log("消息体：" + payLoad);
    switch (ctype) {
      case CTYPE.Enter:
        onEnter(payLoad);
        break;
      case CTYPE.Exit:
        onExit(payLoad);
        break;
      case CTYPE.UserEnter:
        onUserEnter(payLoad);
        break;
      case CTYPE.UserExit:
        onUserExit(payLoad);
        break;
      case CTYPE.SendMsg:
        onSendMsg(payLoad);
        break;
      case CTYPE.UserMsg:
        onUserMsg(payLoad);
        break;
      case CTYPE.HeartCheck:
        onHeartRespones(session, payLoad);
        break;
    }
  },

  //socket断连处理方法
  onDisconnect(stype: STYPE, session: Isession) {
    console.warn("服务" + stype + "断开连接");
  },
};
