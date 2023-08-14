//1.用“键”替代“全局通用的具体数据值”，方便全局调用
//2.用Global类封装全局静态属性、方法
import {
  _decorator,
  AudioClip,
  Component,
  EventTarget,
  director,
  JsonAsset,
  Node,
  Prefab,
  SpriteAtlas,
} from "cc";
import { PauseView } from "./view/PauseView";
import { EventMgr } from "./manager/EventMgr";
const { ccclass, property } = _decorator;
//遥感相关

//遥感方向类型
export const DIRECTION_TYPE = {
  //四向
  FOUR: 4,
  //八向
  EIGHT: 8,
  //全向
  ALL: 0,
};

//触摸类型
export const TOUCH_TYPE = {
  DEFAULT: 0, //按钮和背景距离不变，背景位置与触碰点一致，不可改变按钮背景位置，按钮背景随着按钮移动而移动，松手后无法恢复到初始位置
  FOLLOW: 1, //按钮和背景距离不变，背景位置与触碰点一致，不可改变按钮背景位置，按钮背景随着按钮移动而移动，松手后恢复到初始位置
  FOLLOW_ALWAYS: 2, //按钮和背景距离不变，背景位置与触碰点一致，可改变按钮背景位置，按钮背景随着按钮移动而移动，松手后恢复到初始位置
  FOLLOW_DOT: 3, //按钮和背景距离可改变，按钮位置与触碰点可不一致，不可改变按钮背景位置，按钮背景不随着按钮移动而移动，松手后恢复到初始位置
};

//Charles相关

//道具类型，与道具皮肤数组对应
export const ITEM_TYPE = {
  None: -1,
  Big: 0, //冲击波
  Bomb: 1, //炸弹
  Fire: 2, //火
  Wheel: 3, //电锯
  Spider: 4, //蜘蛛网
  Shield: 5, //盾
  PushScreen: 6, //推推
  Gun: 7, //大炮
  Packman: 8, //吃豆人
  FollowFire: 9, //跟踪火
  Money: 10,
};

//子弹类型，与子弹皮肤数组对应
export const BULLET_TYPE = {
  None: -1,
  Big: 0,
  Fire: 1,
  Gun: 2,
};
//碰撞体类型
export const COLLIDER2D_TYPE = {
  None: -1,
  Dot: 0,
  Hero: 1,
  Item: 2,
  Bullet: 3,
  KillItem: 4,
};
//BOSS类型
export const BOSS_TYPE = {
  None: -1,
  Circle: 0,
  Emmiter: 1,
  Spray: 2,
};

//通用

//资源类型
export const AssetType = {
  Prefab: { type: Prefab, path: "Prefabs/" },
  Sound: { type: AudioClip, path: "Clips/" },
  Atlas: { type: SpriteAtlas, path: "Atlas/" },
  Json: { type: JsonAsset, path: "Jsons/" },
};

//音效
export const Sound = {
  bgm: "bgm",
  touch: "touch",
  btn: "btn",
  lose: "lose",
  get: "get",
  hit: "hit",
  win: "win",
};

//UI预制体
export const ui = {
  GameView: { name: "GameView", layer: 2, clear: false },
  HomeView: { name: "HomeView", layer: 3, clear: false },
  RankView: { name: "RankView", layer: 4, clear: false },
  ResultView: { name: "ResultView", layer: 4, clear: false },
  PauseView: { name: "PauseView", layer: 4, clear: false },
  SettingView: { name: "SettingView", layer: 5, clear: false },
  AdView: { name: "AdView", layer: 6, clear: false },
  TipView: { name: "TipView", layer: 7, clear: true },
};

//弹窗
export const Props = {
  View: "View",
  Ad: "Advertisement",
  ShareConfig: "ShareConfig",
};

//本地存储数据的键
export const SAVE_KEY = {
  BESTSCORE: "BESTSCORE",
  COIN: "COIN",
};

//事件
export const Events = {
  StartPlay: "StartPlay",
  Die: "Die",
  GameInit: "GameInit",
  Pause: "Pause",
  Resume: "Resume",
  Rank: "Rank",
};

@ccclass("Global")
export class Global extends Component {
  //banner广告位ID
  static bannerId = "xxxxxxx";
  //激励视频广告位ID
  static videoId = "xxxxxxx";
  //插屏广告位ID
  static interstitialID = "xxxxxxx";

  //音乐开关
  static canMusic = true;
  //音效开关
  static canEffect = true;

  //全局加载历史信息
  static strLoadInfo = "88888888888888888";

  //全局开关conslog,log
  static Debug = true;

  //游戏是否进行
  static start = false;

  //加载进度比例
  static radio = 1;

  //FILLED类型的Sprite组件的填充比例
  static LoadingRate = 0;

  //层级节点数组
  static layer: Node[] = [];
}
