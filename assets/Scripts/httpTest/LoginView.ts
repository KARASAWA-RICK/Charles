//登陆界面

import {
  _decorator,
  Component,
  Label,
  EditBox,
  find,
  Node,
  director,
} from "cc";
import { httpGet } from "./Tool_http";
import { RESPONSE, userInfo } from "./Global_http";

const { ccclass, property } = _decorator;

@ccclass("LoginView")
export class LoginView extends Component {
  //用户名输入框
  unameEditBox: Node = null!;
  //密码输入框
  upwdEditBox: Node = null!;
  //按键
  btn: Node = null!;
  //标题
  title: Node = null!;

  //初始化登陆界面
  loginInit() {
    //切换按钮
    this.btn.getChildByName("LoginBtn").active = true;
    this.btn.getChildByName("RegisterBtn").active = true;
    this.btn.getChildByName("RegisterOKBtn").active = false;
    this.btn.getChildByName("BackBtn").active = false;
    //切换标题
    this.title.getChildByName("LoginTitle").active = true;
    this.title.getChildByName("RegisterTitle").active = false;
    //清空输入栏
    this.unameEditBox.getComponent(EditBox).string = "";
    this.upwdEditBox.getComponent(EditBox).string = "";
  }

  //初始化注册界面
  registerInit() {
    //切换按钮
    this.btn.getChildByName("LoginBtn").active = false;
    this.btn.getChildByName("RegisterBtn").active = false;
    this.btn.getChildByName("RegisterOKBtn").active = true;
    this.btn.getChildByName("BackBtn").active = true;
    //切换标题
    this.title.getChildByName("LoginTitle").active = false;
    this.title.getChildByName("RegisterTitle").active = true;
    //清空输入栏
    this.unameEditBox.getComponent(EditBox).string = "";
    this.upwdEditBox.getComponent(EditBox).string = "";
  }

  //登录按键回调函数
  onLogin() {
    //获取玩家输入的用户名、用户密码
    let uname = this.unameEditBox.getComponent(EditBox).string;
    let upwd = this.upwdEditBox.getComponent(EditBox).string;
    console.log("uname==>>" + uname + "," + "upwd==>>" + upwd);

    //若消除前后空格后仍然无内容，则跳出函数
    if (uname.trim().length == 0) {
      console.log("用户名为空");
      return;
    } else if (upwd.trim().length == 0) {
      console.log("密码为空");
      return;
    }
    //若用户名、用户密码都有内容
    else {
      //确定url
      let url =
        "http://127.0.0.1:6080/login?uname=" +
        uname.trim() +
        "&upwd=" +
        upwd.trim();
      //发起GET请求，用回调函数接收响应体对象
      httpGet(url, this.loginBack.bind(this));
    }
  }

  //接收登录GET请求的响应体对象的回调函数
  loginBack(responseObj) {
    //输出执行状态
    console.log("status==>>" + responseObj.status);

    //若执行状态（RESPONSE）不为OK
    if (responseObj.status != RESPONSE.OK) {
      //密码错误
      if (responseObj.status == RESPONSE.UNAME_OR_UPWD_ERR) {
        console.log("用户名或密码错误");
      }
      //用户不存在
      else {
        console.log("请先注册");
      }
    }
    //若执行状态（RESPONSE）为OK
    else {
      console.log("登陆成功");
      //初始化登陆界面
      this.loginInit();
      //输出玩家信息
      console.log(
        "loginBack==>>" +
          responseObj.id +
          "," +
          responseObj.uname +
          "," +
          responseObj.score +
          "," +
          responseObj.money
      );
      //当前玩家全局信息存储
      userInfo.id = responseObj.id;
      userInfo.uname = responseObj.uname;
      userInfo.score = responseObj.score;
      userInfo.money = responseObj.money;
      //切换加载场景
      director.loadScene("loading");
    }
  }

  //注册按键回调函数
  onRegister() {
    //初始化注册界面
    this.registerInit();
  }

  //注册确认按键回调函数
  onRegisterOK() {
    //获取玩家输入的用户名、用户密码
    let uname = this.unameEditBox.getComponent(EditBox).string;
    let upwd = this.upwdEditBox.getComponent(EditBox).string;
    console.log("nameEditBox==>>" + uname + "," + upwd);

    //若消除前后空格后仍然无内容，则跳出函数
    if (uname.trim().length == 0) {
      console.log("用户名为空");
      return;
    } else if (upwd.trim().length == 0) {
      console.log("密码为空");
      return;
    }
    //若用户名、用户密码都有内容
    else {
      //确定url
      let url =
        "http://127.0.0.1:6080/register?uname=" +
        uname.trim() +
        "&upwd=" +
        upwd.trim();
      //发起GET请求，用回调函数接收响应体对象
      httpGet(url, this.registerBack.bind(this));
    }
  }

  //接收注册GET请求的响应体对象的回调函数
  registerBack(responseObj) {
    //输出执行状态
    console.log("status==>>" + responseObj.status);

    //若执行状态（RESPONSE）为PHONE_IS_NOT_REG
    if (responseObj.status == RESPONSE.PHONE_IS_NOT_REG) {
      console.log("用户名重复");
    }
    //若执行状态（RESPONSE）不为OK
    else if (responseObj.status != RESPONSE.OK) {
      console.log("注册失败");
    }
    //若执行状态（RESPONSE）为OK
    else {
      console.log("注册成功");
      //初始化登陆界面
      this.loginInit();
      //输出玩家信息
      console.log(
        "registerBack==>>" +
          responseObj.id +
          "," +
          responseObj.uname +
          "," +
          responseObj.score +
          "," +
          responseObj.money
      );
    }
  }

  //返回按键回掉函数
  onBack() {
    //初始化登陆界面
    this.loginInit();
  }

  onLoad() {
    //定义节点
    this.unameEditBox = find("Canvas/LoginView/Input/uname/EditBox");
    this.upwdEditBox = find("Canvas/LoginView/Input/upwd/EditBox");
    this.title = find("Canvas/LoginView/Title");
    this.btn = find("Canvas/LoginView/Btn");
  }

  protected start(): void {
    //初始化登陆界面
    this.loginInit();
  }
}
