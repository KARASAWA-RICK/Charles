//

import {
  _decorator,
  Component,
  EditBox,
  ScrollView,
  Prefab,
  instantiate,
  Label,
} from "cc";
import { Utils } from "./utils";
import { eventTarget, userInfoChat } from "./Global_WebSocket";
import { CTYPE, ProtoType, Respones, STYPE } from "./Enum";
import { registService } from "./serviceMgr";
import { chatroomService } from "./chatroomService";
import { session } from "./sessionMgr";

const { ccclass, property } = _decorator;

//聊天室类
@ccclass("ChatroomView")
export class ChatroomView extends Component {
  //聊天室消息二进制类型
  binaryType: BinaryType = "arraybuffer";
  //聊天室消息体中转类型
  protoType: ProtoType = ProtoType.PROTO_JSON;
  //聊天室服务号
  stype: STYPE = STYPE.Chatroom;
  //服务器url
  chatroomUrl: string = "ws://10.0.12.138:6085/ws";

  //滚动视图
  @property(ScrollView)
  scrollView: ScrollView = null!;

  //prefab资源
  @property(Prefab)
  tipPrefab: Prefab = null!;
  @property(Prefab)
  selfChatPrefab: Prefab = null!;
  @property(Prefab)
  otherChatPrefab: Prefab = null!;

  //输入框
  @property(EditBox)
  input: EditBox = null!;

  //显示提示
  showTipMsg(str: string) {
    console.log("_showTipMsg =====> 显示提示");
    console.log("温馨提示：" + str);

    let node = instantiate(this.tipPrefab);
    let label = node.getComponent(Label);
    label.string = str;
    this.scrollView.content.addChild(node);
  }
  //显示自己发言
  showSelfChat(uname: string, msg: string) {
    console.log("_showSelfChat =====> 显示自己说话");
    console.log(uname + "（我）");
    console.log(msg);

    let node = instantiate(this.selfChatPrefab);
    let label = node.getChildByName("uname").getComponent(Label);
    label.string = uname;

    let msgLabel = node.getChildByName("msg").getComponent(Label);
    msgLabel.string = msg;

    this.scrollView.content.addChild(node);
    this.scrollView.scrollToBottom(0.1);
  }
  //显示他人发言
  showOtherChat(uname: string, msg: string) {
    console.log("_showOtherChat =====> 显示他人说话");
    console.log(uname);
    console.log(msg);

    let node = instantiate(this.otherChatPrefab);
    let label = node.getChildByName("uname").getComponent(Label);
    label.string = uname;

    let msgLabel = node.getChildByName("msg").getComponent(Label);
    msgLabel.string = msg;

    this.scrollView.content.addChild(node);
    this.scrollView.scrollToBottom(0.1);
  }

  //按键回调

  //进入
  onEnterBtn() {
    console.log("onEnterBtn =====> 开始进入聊天室");
    //初始化WebSocket连接
    if (!session.connect(this.chatroomUrl, this.binaryType)) {
      console.warn("连接已存在");
      return;
    } else {
      //注册服务
      registService(this.stype, chatroomService);
      //生成用户名
      userInfoChat.uname = "游客" + Utils.randomIntStr(4);
      //生成用户性别
      userInfoChat.usex = Utils.randomInt(1, 2);
      //生成用户识别码
      userInfoChat.utag = Utils.randomInt(1, 10000);
      console.log("utag=>" + userInfoChat.utag);
      //监听连接成功事件，向服务端发送用户名
      eventTarget.on("onConnect", () => {
        session.sendMsg(
          this.stype,
          CTYPE.Enter,
          userInfoChat.utag,
          ProtoType.PROTO_JSON,
          userInfoChat.uname
        );
        eventTarget.off("onConnect");
        console.log("进入聊天室成功");
        //开始心跳
        session.startHeartBeat(
          this.stype,
          userInfoChat.utag,
          ProtoType.PROTO_JSON,
          "心跳"
        );
      });
    }
  }

  //退出
  onDisconnectBtn() {
    console.log("onDisconnectBtn =====> 退出聊天室");
    session.sendMsg(
      this.stype,
      CTYPE.Exit,
      userInfoChat.utag,
      ProtoType.PROTO_JSON,
      "退出"
    );
  }

  //发送
  onSendMsgBtn() {
    console.log("onSendMsgBtn =====> 发言");
    //若未输入文字
    if (!this.input.string || this.input.string.length <= 0) {
      console.warn("请输入文字！");
      return;
    } else {
      //发送消息
      session.sendMsg(
        this.stype,
        CTYPE.SendMsg,
        userInfoChat.utag,
        ProtoType.PROTO_JSON,
        this.input.string
      );
      //清空输入框
      this.input.string = "";
    }
  }

  onLoad() {
    eventTarget.on("showSelfChat", this.showSelfChat, this);
    eventTarget.on("showOtherChat", this.showOtherChat, this);
    eventTarget.on("showTipMsg", this.showTipMsg, this);
  }

  protected onDisable(): void {
    eventTarget.off("showSelfChat", this.showSelfChat, this);
    eventTarget.off("showOtherChat", this.showOtherChat, this);
    eventTarget.off("showTipMsg", this.showTipMsg, this);
  }
}
