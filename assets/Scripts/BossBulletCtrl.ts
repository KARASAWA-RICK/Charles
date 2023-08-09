import {
  _decorator,
  Component,
  find,
  math,
  Node,
  Sprite,
  SpriteFrame,
  v2,
  v3,
  Vec2,
} from "cc";
import { Tools } from "./Tools";
import { GameMgr } from "./GameMgr";
import { PoolMgr } from "./manager/PoolMgr";
import { HeroCtrl } from "./HeroCtrl";
import { DotCtrl } from "./DotCtrl";
const { ccclass, property } = _decorator;

@ccclass("BossBulletCtrl")
export class BossBulletCtrl extends DotCtrl {
  //移动方向
  dir = v2(0, 0);

  //子弹速度
  @property
  speedMove: number = 350;

  //根据子弹方向子弹初始化
  Init(dir: Vec2) {
    this.dir = dir;
    //从皮肤数组里随机选择皮肤
    this.getComponent(Sprite).spriteFrame =
      this.skinSpriteArr[math.randomRangeInt(0, this.skinSpriteArr.length)];
  }

  //子弹移动
  bulletMove(deltaTime: number) {
    let newPos = v3(
      this.node.position.x +
        this.dir.x * this.speedMove * deltaTime * GameMgr.ins.enemySpeedScale,
      this.node.position.y +
        this.dir.y * this.speedMove * deltaTime * GameMgr.ins.enemySpeedScale,
      0
    );
    this.node.position = newPos;
  }

  update(deltaTime: number) {
    //如果玩家死亡，则不刷新
    if (GameMgr.ins.isDead) {
      this.unscheduleAllCallbacks();
      return;
    }
    this.bulletMove(deltaTime);

    //超出边界销毁
    if (
      this.node.position.x >= (GameMgr.ins.WIDTH - 100) / 2 ||
      this.node.position.x <= (-GameMgr.ins.WIDTH + 100) / 2 ||
      this.node.position.y >= (GameMgr.ins.HEIGHT - 400) / 2 ||
      this.node.position.y <= (-GameMgr.ins.HEIGHT + 400) / 2
    ) {
      PoolMgr.ins.putNode(this.node);
    }
  }
}
