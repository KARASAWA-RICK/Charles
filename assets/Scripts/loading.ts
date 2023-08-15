//挂在loading场景下
import {
  _decorator,
  Component,
  Node,
  director,
  assetManager,
  AudioClip,
  Sprite,
  Vec3,
  Label,
} from "cc";
import ResMgr from "./manager/ResMgr";
import { AssetType, Global } from "./Global";
const { ccclass } = _decorator;

@ccclass("loading")
export class loading extends Component {
  async start() {
    await this.loadRes();
  }

  //加载资源
  async loadRes() {
    //加载Bundle1，进度+0.1
    await ResMgr.ins.loadBundle(1, 0.1);
    //加载Bundle1中的prefab，进度+0.4
    await ResMgr.ins.loadRes(1, AssetType.Prefab, 0.4);
    //加载Bundle1中的clip，进度+0.32
    await ResMgr.ins.loadRes(1, AssetType.Sound, 0.32);
    //加载Bundle1中的json，进度+0.2
    await ResMgr.ins.loadRes(1, AssetType.Json, 0.2);
  }

  update(deltaTime: number) {
    //如果进度完成，则加载进度清0，切换游戏场景
    if (Global.LoadingRate >= 1.01) {
      Global.LoadingRate = 0;
      director.loadScene("game");
    }
  }
}
