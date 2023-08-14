import {
  _decorator,
  Component,
  Node,
  Vec2,
  Vec3,
  view,
  Size,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  instantiate,
  Prefab,
  Sprite,
  BoxCollider2D,
  SpriteFrame,
  UITransform,
  size,
  PhysicsSystem2D,
  v3,
  tween,
  quat,
  Quat,
  find,
  input,
  EventTouch,
  Input,
  v2,
  lerp,
  math,
  director,
  game,
} from "cc";
import { Tools } from "./Tools";
import {
  Global,
  ITEM_TYPE,
  COLLIDER2D_TYPE,
  BULLET_TYPE,
  Events,
} from "./Global";
import { BulletCtrl } from "./BulletCtrl";
import { ItemCtrl } from "./ItemCtrl";
import { EnemyCtrl } from "./EnemyCtrl";
import { GameMgr } from "./GameMgr";
import { PoolMgr } from "./manager/PoolMgr";
import { PackmanCtrl } from "./PackmanCtrl";
import { ResultView } from "./view/ResultView";
import { GameView } from "./view/GameView";
import { BossBulletCtrl } from "./BossBulletCtrl";
import { BossCtrl } from "./BossCtrl";
import { DotCtrl } from "./DotCtrl";
import { EventMgr } from "./manager/EventMgr";
const { ccclass, property } = _decorator;

@ccclass("HeroCtrl")
export class HeroCtrl extends Component {
  //玩家移动速度
  @property
  speedMove: number = 430;
  //玩家移动方向
  dirMove: Vec2 = v2(0, 0);
  //玩家初始位置
  posStart: Vec3 = v3(0, 0, 0);
  //玩家初始角度
  angleStart: number = 90;
  //游戏开始位移阈值
  startDistance: number = 50;
  //获取屏幕尺寸
  borderSize = view.getVisibleSize();

  //道具节点
  gun: Node;
  wheel: Node;
  shield: Node;
  spider: Node;
  enemys: Node;
  items: Node;
  bullets: Node;
  itemKills: Node;

  //画板节点
  canvas: Node;

  //上一次拾取道具的类型
  itemTypeNow: number = ITEM_TYPE.None;

  //全局碰撞回调函数
  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    //玩家碰Dot
    if (
      (selfCollider.tag == COLLIDER2D_TYPE.Dot &&
        otherCollider.tag == COLLIDER2D_TYPE.Hero) ||
      (selfCollider.tag == COLLIDER2D_TYPE.Hero &&
        otherCollider.tag == COLLIDER2D_TYPE.Dot)
    ) {
      //玩家立即死亡
      this.Die();
    }

    //玩家碰道具
    else if (
      (selfCollider.tag == COLLIDER2D_TYPE.Item &&
        otherCollider.tag == COLLIDER2D_TYPE.Hero) ||
      (selfCollider.tag == COLLIDER2D_TYPE.Hero &&
        otherCollider.tag == COLLIDER2D_TYPE.Item)
    ) {
      //改变拾取道具状态，道具销毁
      if (selfCollider.tag == COLLIDER2D_TYPE.Item) {
        this.itemTypeNow = selfCollider.node.getComponent(ItemCtrl).itemType;
        PoolMgr.ins.putNode(selfCollider.node);
      } else {
        this.itemTypeNow = otherCollider.node.getComponent(ItemCtrl).itemType;
        PoolMgr.ins.putNode(otherCollider.node);
      }

      ///如果拾取道具是冲击波
      if (this.itemTypeNow == ITEM_TYPE.Big) {
        //冲击波发射，延迟1S
        this.scheduleOnce(this.bigInit, 1);
      }
      //如果拾取道具是大炮
      else if (this.itemTypeNow == ITEM_TYPE.Gun) {
        //取消上一个重置
        this.unschedule(this.resetGun);
        //计时器，8s后重置大炮
        this.scheduleOnce(this.resetGun, 6);
        //激活大炮
        this.gun.active = true;
        //计时器，每0.2S发射子弹
        this.schedule(this.gunInit, 0.2);
      }
      //如果拾取道具是火
      else if (this.itemTypeNow == ITEM_TYPE.Fire) {
        //火焰发射
        this.fireInit();
      }
      //如果拾取道具是电锯
      else if (this.itemTypeNow == ITEM_TYPE.Wheel) {
        //取消上一个重置
        this.unschedule(this.resetWheel);
        //计时器，8s后重置电锯
        this.scheduleOnce(this.resetWheel, 6);
        //电锯激活
        this.wheel.active = true;
      }

      //如果拾取道具是炸弹
      else if (this.itemTypeNow == ITEM_TYPE.Bomb) {
        //console.log('吃到炸弹')
        this.bombInit();
      }

      //如果拾取道具是盾
      else if (this.itemTypeNow == ITEM_TYPE.Shield) {
        //console.log('吃到盾')
        //激活盾
        this.shield.active = true;
        if (this.shield.active == true) {
          //console.log('激活盾')
        }
      }

      //如果拾取道具是推推
      else if (this.itemTypeNow == ITEM_TYPE.PushScreen) {
        //console.log('吃到推推')
        this.pushScreenInit();
      }

      //如果拾取道具是蜘蛛网
      else if (this.itemTypeNow == ITEM_TYPE.Spider) {
        //console.log('吃到蜘蛛网')

        //取消上一个重置
        this.unschedule(this.resetSpider);
        //5秒后恢复
        this.scheduleOnce(this.resetSpider, 5);
        //激活蜘蛛网
        this.spider.active = true;
        //设置蜘蛛网初始位置为玩家位置
        this.spider.position = this.node.position;
        //渐入效果，0.4秒内放大到原本尺寸的两倍
        Tools.fadeIn(this.spider, 0.4, v3(2, 2, 0));
        //敌人速度缩放至0.3
        GameMgr.ins.enemySpeedScale = 0.3;
      }

      //如果拾取道具是吃豆人
      else if (this.itemTypeNow == ITEM_TYPE.Packman) {
        //console.log('吃到吃豆人')
        this.packManInit();
      }

      //如果拾取道具是跟踪火
      else if (this.itemTypeNow == ITEM_TYPE.FollowFire) {
        //console.log('吃到跟踪火')
        //取消上一个重置
        this.unschedule(this.resetFollowFire);
        //计时器，8s后重置跟踪火
        this.scheduleOnce(this.resetFollowFire, 8);
        //0.1S放一团火
        this.schedule(this.followFireInit, 0.1);
      }
    }

    //Dot碰子弹
    else if (
      (selfCollider.tag == COLLIDER2D_TYPE.Bullet &&
        otherCollider.tag == COLLIDER2D_TYPE.Dot) ||
      (selfCollider.tag == COLLIDER2D_TYPE.Dot &&
        otherCollider.tag == COLLIDER2D_TYPE.Bullet)
    ) {
      //敌人死亡
      //如果子弹是大炮子弹，子弹销毁
      if (selfCollider.tag == COLLIDER2D_TYPE.Dot) {
        GameMgr.ins.DotDie(selfCollider.node);
        GameMgr.ins.coin = GameMgr.ins.coin + 1;
        if (
          otherCollider.node.getComponent(BulletCtrl).bulletType ==
          BULLET_TYPE.Gun
        ) {
          PoolMgr.ins.putNode(otherCollider.node);
        }
      } else {
        GameMgr.ins.DotDie(otherCollider.node);
        GameMgr.ins.coin = GameMgr.ins.coin + 1;
        if (
          selfCollider.node.getComponent(BulletCtrl).bulletType ==
          BULLET_TYPE.Gun
        ) {
          PoolMgr.ins.putNode(selfCollider.node);
        }
      }
    }

    //Dot碰杀伤性道具
    else if (
      (selfCollider.tag == COLLIDER2D_TYPE.Dot &&
        otherCollider.tag == COLLIDER2D_TYPE.KillItem) ||
      (selfCollider.tag == COLLIDER2D_TYPE.KillItem &&
        otherCollider.tag == COLLIDER2D_TYPE.Dot)
    ) {
      //敌人死亡
      //如果道具是盾，盾失效，生成盾爆
      console.log("敌人碰杀伤性道具");
      if (selfCollider.tag == COLLIDER2D_TYPE.Dot) {
        GameMgr.ins.DotDie(selfCollider.node);
        GameMgr.ins.coin = GameMgr.ins.coin + 1;
        if (otherCollider.node.name == "shield_1") {
          this.shield.active = false;
          this.shieldBombInit();
        }
      } else {
        GameMgr.ins.DotDie(otherCollider.node);
        GameMgr.ins.coin = GameMgr.ins.coin + 1;
        if (selfCollider.node.name == "shield_1") {
          this.shield.active = false;
          this.shieldBombInit();
        }
      }
    }
  }

  //生成冲击波
  bigInit() {
    //子弹类型
    let bulletType = BULLET_TYPE.Big;
    //子弹角度偏移量
    let angleArr = [0];
    //设置子弹
    for (let i = 0; i < angleArr.length; i++) {
      //Bullet出池
      let bullet: Node = PoolMgr.ins.getNode(
        "Bullet",
        this.bullets,
        this.node.position
      );
      //设置子弹角度
      let angle = angleArr[i] + this.node.angle - 90;
      //根据子弹类型、角度初始化子弹
      bullet.getComponent(BulletCtrl).Init(bulletType, angle);
    }
  }

  //生成大炮
  gunInit() {
    //子弹类型
    let bulletType = BULLET_TYPE.Gun;
    //子弹角度偏移量
    let angleArr = [-20, 0, 20];
    //设置子弹
    for (let i = 0; i < angleArr.length; i++) {
      //Bullet出池
      let bullet: Node = PoolMgr.ins.getNode(
        "Bullet",
        this.bullets,
        this.node.position
      );
      //设置子弹角度
      let angle = angleArr[i] + this.node.angle - 90;
      //根据子弹类型、角度初始化子弹
      bullet.getComponent(BulletCtrl).Init(bulletType, angle);
    }
  }

  //生成三火
  fireInit() {
    //子弹类型
    let bulletType = BULLET_TYPE.Fire;
    //子弹角度偏移量
    let angleArr = [-120, 0, 120];
    //设置子弹
    for (let i = 0; i < angleArr.length; i++) {
      //Bullet出池
      let bullet: Node = PoolMgr.ins.getNode(
        "Bullet",
        this.bullets,
        this.node.position
      );
      //设置子弹角度
      let angle = angleArr[i] + this.node.angle - 90;
      //根据子弹类型、角度初始化子弹
      bullet.getComponent(BulletCtrl).Init(bulletType, angle);
    }
  }

  //生成炸弹
  bombInit() {
    //Bomb出池
    let bomb = PoolMgr.ins.getNode("Bomb", this.itemKills, this.node.position);
    //渐入效果，0.2秒内恢复原本尺寸
    Tools.fadeIn(bomb, 0.2);
    //console.log('炸弹生成')
    this.scheduleOnce(() => {
      //console.log('炸弹销毁')
      PoolMgr.ins.putNode(bomb);
    }, 1.5);
  }

  //生成盾爆
  shieldBombInit() {
    //ShieldBomb出池
    let bomb = PoolMgr.ins.getNode(
      "ShieldBomb",
      this.itemKills,
      this.node.position
    );
    //渐入效果，0.2秒内恢复原本尺寸
    Tools.fadeIn(bomb, 0.2);
    //console.log('盾爆生成')
    this.scheduleOnce(() => {
      //console.log('盾爆销毁')
      PoolMgr.ins.putNode(bomb);
    }, 1.5);
  }

  //生成推推
  pushScreenInit() {
    //实例化推推
    let pushScreen = PoolMgr.ins.getNode(
      "PushScreen",
      this.itemKills,
      v3(-GameMgr.ins.WIDTH / 2, 0, 0)
    );
    //console.log('推推生成')
    tween(pushScreen)
      .by(3, { position: v3(3000, 0, 0) })
      .call(() => {
        PoolMgr.ins.putNode(pushScreen);
      })
      .start();
  }

  //生成吃豆人
  packManInit() {
    //实例化吃豆人
    let packMan = PoolMgr.ins.getNode(
      "Packman",
      this.itemKills,
      this.node.position
    );
    packMan.getComponent(PackmanCtrl).Init();

    //5S后销毁
    this.scheduleOnce(() => {
      PoolMgr.ins.putNode(packMan);
    }, 5);
  }

  //生成跟踪火
  followFireInit() {
    //实例化跟踪火
    let followFire = PoolMgr.ins.getNode(
      "FollowFire",
      this.itemKills,
      this.node.position
    );
    //5S后熄灭
    this.scheduleOnce(() => {
      PoolMgr.ins.putNode(followFire);
    }, 5);
  }

  //重置大炮
  resetGun() {
    this.gun.active = false;
    this.unschedule(this.gunInit);
  }
  //重置电锯
  resetWheel() {
    this.wheel.active = false;
  }
  //重置蜘蛛网
  resetSpider() {
    this.spider.active = false;
    this.spider.position = v3(0, 0, 0);
    GameMgr.ins.enemySpeedScale = 1;
  }
  //重置跟踪火
  resetFollowFire() {
    this.unschedule(this.followFireInit);
  }

  //触摸事件回调函数，角色移动
  onTouchMove(event: EventTouch) {
    //如果玩家死亡或游戏暂停，则无法移动或转向
    if (GameMgr.ins.isDead || GameMgr.ins.isPause) {
      return;
    }
    //获取鼠标移动方向+距离
    this.dirMove = event.getUIDelta();
    //大炮不激活，才更新玩家位置
    if (!this.node.getChildByName("Gun").active) {
      //获取玩家新位置
      let newPos = new Vec3(
        this.node.position.x + this.dirMove.x,
        this.node.position.y + this.dirMove.y,
        0
      );
      //防止超出边界
      newPos.x = Math.min(
        Math.max(newPos.x, (-this.borderSize.x + 100) / 2),
        (this.borderSize.x - 100) / 2
      );
      newPos.y = Math.min(
        Math.max(newPos.y, (-this.borderSize.y + 400) / 2),
        (this.borderSize.y - 400) / 2
      );
      //更新玩家位置
      this.node.position = newPos;
    }

    //防误触
    if (this.dirMove.length() <= 1) {
      return;
    }
    //使角度差保持在 -180 到 180 度范围内
    let targetAngle = Tools.convertToAngle(this.dirMove.normalize());
    let currentAngle = this.node.angle;
    let deltaAngle = targetAngle - currentAngle;
    if (deltaAngle > 180) {
      deltaAngle -= 360;
    } else if (deltaAngle < -180) {
      deltaAngle += 360;
    }
    let newAngle = currentAngle + lerp(0, deltaAngle, 0.1);
    //更新玩家角度
    this.node.angle = newAngle;
  }

  //初始化玩家
  Init() {
    this.reset();
    //开启全局碰撞监听
    PhysicsSystem2D.instance?.on(
      Contact2DType.BEGIN_CONTACT,
      this.onBeginContact,
      this
    );
    //开启全局输入监听
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    console.log("初始化玩家成功");
  }

  //根据玩家位移判断是否开玩
  isStartPlay() {
    if (GameMgr.ins.isStartPlay) {
      //console.log('已经开始辣')
      return;
    } else if (
      Tools.calculateDistance(
        Tools.convertTo2D(this.node.position),
        Tools.convertTo2D(this.posStart)
      ) >= this.startDistance
    ) {
      EventMgr.ins.emit(Events.StartPlay);
      console.log("位移判断成功");
    }
  }

  //玩家死亡
  Die() {
    EventMgr.ins.emit(Events.Die);
    //玩家入池
    PoolMgr.ins.putNode(this.node);
  }

  //重置玩家
  reset() {
    console.log("hero reset");
    this.resetGun();
    this.resetWheel();
    this.resetSpider();
    this.resetFollowFire();
    this.node.setPosition(this.posStart);
    this.node.angle = this.angleStart;
  }

  protected onLoad(): void {
    //获取节点
    this.canvas = find("Canvas");
    this.gun = this.node.getChildByName("Gun");
    this.wheel = this.node.getChildByName("Wheel");
    this.shield = this.node.getChildByName("Shield");
    this.spider = this.canvas.getChildByName("Spider");
    this.enemys = this.canvas.getChildByName("Enemys");
    this.items = this.canvas.getChildByName("Items");
    this.bullets = this.canvas.getChildByName("Bullets");
    this.itemKills = this.canvas.getChildByName("ItemKills");
  }

  protected onEnable(): void {}

  update(deltaTime: number) {
    this.isStartPlay();
  }

  protected onDisable(): void {
    PhysicsSystem2D.instance?.off(
      Contact2DType.BEGIN_CONTACT,
      this.onBeginContact,
      this
    );
    input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.unscheduleAllCallbacks();
  }
}
