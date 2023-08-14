import {
  _decorator,
  Component,
  Node,
  EventTarget,
  Prefab,
  instantiate,
  find,
  Vec3,
  view,
  Vec2,
  v2,
  Collider2D,
  IPhysics2DContact,
  PhysicsSystem2D,
  Contact2DType,
  math,
  v3,
  director,
  Canvas,
} from "cc";
import { Tools } from "./Tools";
import {
  BOSS_TYPE,
  BULLET_TYPE,
  COLLIDER2D_TYPE,
  Events,
  Global,
  ITEM_TYPE,
  ui,
} from "./Global";
import { ItemCtrl } from "./ItemCtrl";
import { BulletCtrl } from "./BulletCtrl";
import { HeroCtrl } from "./HeroCtrl";
import { BossCtrl } from "./BossCtrl";
import ResMgr from "./manager/ResMgr";
import { PoolMgr } from "./manager/PoolMgr";
import { EnemyCtrl } from "./EnemyCtrl";
import { HomeView } from "./view/HomeView";
import { GameView } from "./view/GameView";
import { DotCtrl } from "./DotCtrl";
import { BossBulletCtrl } from "./BossBulletCtrl";
import { ResultView } from "./view/ResultView";
import { PauseView } from "./view/PauseView";
import { RankView } from "./view/RankView";
import { EventMgr } from "./manager/EventMgr";
const { ccclass, property } = _decorator;

@ccclass("GameMgr")
export class GameMgr extends Component {
  //是否开玩
  isStartPlay: boolean = false;
  //是否死亡
  isDead = false;
  //是否暂停
  isPause = false;
  //本次分数
  score = 0;
  //本次金币
  coin = 0;

  //节点
  enemys: Node = null!;
  items: Node = null!;
  bullets: Node = null!;
  hero: Node = null!;
  itemKills: Node = null!;

  //敌人速度缩放
  enemySpeedScale: number = 1;

  //生成最小距离
  @property
  radius: number = 175;

  //屏幕宽高
  WIDTH: number = view.getVisibleSize().x;
  HEIGHT: number = view.getVisibleSize().y;

  //生成最大尝试次数
  maxAttempts: number = 10;

  //饿汉式单例
  private static _ins: GameMgr = null!;
  public static get ins() {
    return this._ins;
  }

  //游戏逻辑

  //随机生成敌人
  CreateEnemy() {
    //定义敌人位置
    let pos: Vec3 = v3(0, 0, 0);
    //定义敌人与玩家的距离
    let distance: number = 0;
    //尝试次数
    let attempts: number = 0;

    //在最大尝试次数内循环
    while (attempts < this.maxAttempts) {
      //随机生成敌人位置x，y（为了避免敌人被边缘遮住而-）
      pos.x = ((Math.random() - 0.5) * 2 * (this.WIDTH - 100)) / 2;
      pos.y = ((Math.random() - 0.5) * 2 * (this.HEIGHT - 400)) / 2;
      //计算敌人与玩家的距离
      distance = Tools.calculateDistance(
        Tools.convertTo2D(pos),
        Tools.convertTo2D(this.hero.position)
      );
      //如果敌人位置大于敌人生成最小距离，则赋值敌人位置，成功生成敌人，退出函数
      if (distance > this.radius) {
        //Enemy出池
        let enemy: Node = PoolMgr.ins.getNode("Enemy", this.enemys, pos);
        enemy.getComponent(EnemyCtrl).Init();
        return;
      } else {
        //否则当前尝试次数+1
        attempts++;
        //如果最大尝试次数后依旧没有生成符合要求的敌人位置，则打印信息提示
        console.log("运气不好，生成敌人失败");
      }
    }
  }

  //随机生成Boss
  CreateBoss() {
    //定义Boss位置
    let pos: Vec3 = v3(0, 0, 0);
    //定义Boss与玩家的距离
    let distance: number = 0;
    let attempts: number = 0;

    //在最大尝试次数内循环
    while (attempts < this.maxAttempts) {
      //随机生成Boss位置x，y（为了避免Boss被边缘遮住而-）
      pos.x = ((Math.random() - 0.5) * 2 * (this.WIDTH - 100)) / 2;
      pos.y = ((Math.random() - 0.5) * 2 * (this.HEIGHT - 400)) / 2;
      //计算Boss与玩家的距离
      distance = Tools.calculateDistance(
        Tools.convertTo2D(pos),
        Tools.convertTo2D(this.hero.position)
      );
      //如果Boss位置大于敌人生成最小距离，则赋值Boss位置，成功生成Boss，退出函数
      if (distance > this.radius) {
        //Boss出池
        let boss: Node = PoolMgr.ins.getNode("Boss", this.enemys, pos);
        //随机Boss种类
        let bossType = math.randomRangeInt(0, 3);

        //根据Boss种类与朝向初始化Boss
        //Boss初始角度朝向玩家
        let angle = Tools.convertToAngle(
          Tools.calculateDir(
            Tools.convertTo2D(boss.position),
            Tools.convertTo2D(this.hero.position)
          )
        );
        boss.getComponent(BossCtrl).Init(bossType, angle);

        //4S后入池
        this.scheduleOnce(() => {
          PoolMgr.ins.putNode(boss);
        }, 4);
        return;
      } else {
        //否则当前尝试次数+1
        attempts++;
        //如果最大尝试次数后依旧没有生成符合要求的敌人位置，则打印信息提示
        console.log("运气不好，生成Boss失败");
      }
    }
  }

  //随机生成道具
  CreateItem() {
    //定义道具位置
    let pos: Vec3 = v3(0, 0, 0);
    //定义道具与玩家的距离
    let distance: number = 0;
    //尝试次数
    let attempts: number = 0;

    //在最大尝试次数内循环
    while (attempts < this.maxAttempts) {
      //随机生成道具位置x，y（为了避免道具被边缘遮住而-150）
      pos.x = ((Math.random() - 0.5) * 2 * (this.WIDTH - 100)) / 2;
      pos.y = ((Math.random() - 0.5) * 2 * (this.HEIGHT - 400)) / 2;
      //计算道具与玩家的距离
      distance = Tools.calculateDistance(
        Tools.convertTo2D(pos),
        Tools.convertTo2D(this.hero.position)
      );
      //如果道具位置大于生成最小距离，则赋值道具位置，成功生成道具，退出函数
      if (distance > this.radius) {
        //Item出池
        let item: Node = PoolMgr.ins.getNode("Item", this.items, pos);
        item.getComponent(ItemCtrl).Init();
        return;
      } else {
        //否则当前尝试次数+1
        attempts++;
        //如果最大尝试次数后依旧没有生成符合要求的敌人位置，则打印信息提示
        console.log("运气不好，生成敌人失败");
      }
    }
  }

  //Dot死亡
  DotDie(dot: Node) {
    if (dot.name == "Enemy") {
      dot.getComponent(EnemyCtrl).Die();
    } else if (dot.name == "Boss") {
      dot.getComponent(BossCtrl).Die();
    } else if (dot.name == "BossBullet") {
      dot.getComponent(BossBulletCtrl).Die();
    }
  }

  //流程控制

  //初始化
  Init() {
    //清空
    this.clear(1);
    this.isDead = false;
    console.log("isDead = false");
    //玩家出池
    this.hero = PoolMgr.ins.getNode("Hero", find("Canvas/Layer1"), v3(0, 0, 0));
    this.hero.getComponent(HeroCtrl).Init();
    //主界面
    this.initHomeView();
  }

  //开玩
  startPlay() {
    console.log("开玩");
    this.isStartPlay = true;

    //界面切换
    this.clearViews();
    this.initGameView();

    //计时器，0.5S生成一个敌人
    this.schedule(this.CreateEnemy, 0.5);

    //计时器，4S生成一个道具
    this.schedule(() => {
      //如果场上有3个道具，则不再生成
      if (this.items.children.length >= 3) {
        return;
      }
      this.CreateItem();
    }, 4);

    //计时器，10S生成一个Boss
    this.schedule(this.CreateBoss, 10);
  }

  //死亡处理
  afterDeath() {
    this.isDead = true;
    this.isStartPlay = false;
    console.log("isDead = true");
    console.log("isStartPlay = false");

    //取消回调，清空道具、子弹、杀伤性道具
    this.unscheduleAllCallbacks();
    this.clearItems();
    this.clearBullets();
    this.clearItemKills();

    //延迟1S带死亡效果的清空Dots（调用Die方法）,再延迟1S切换界面
    this.scheduleOnce(() => {
      this.clearDotsOnDead();
      this.scheduleOnce(() => {
        this.clearViews();
        this.initResultView();
      }, 1);
    }, 1);
  }

  //Dots带死亡效果的清空（调用Die方法）
  clearDotsOnDead() {
    let enemysChildren = this.enemys.children;
    for (let i = enemysChildren.length - 1; i >= 0; i--) {
      if (enemysChildren[i].active && enemysChildren[i].isValid) {
        this.DotDie(enemysChildren[i]);
        //console.log(enemysChildren[i], '死亡')
      }
    }
  }

  //Dots直接入池
  clearDots() {
    let enemysChildren = this.enemys.children;
    for (let i = enemysChildren.length - 1; i >= 0; i--) {
      if (enemysChildren[i].active && enemysChildren[i].isValid) {
        PoolMgr.ins.putNode(enemysChildren[i]);
        //console.log(enemysChildren[i], '入池')
      }
    }
  }

  //道具直接入池
  clearItems() {
    let itemsChildren = this.items.children;
    for (let i = itemsChildren.length - 1; i >= 0; i--) {
      if (itemsChildren[i].active && itemsChildren[i].isValid) {
        PoolMgr.ins.putNode(itemsChildren[i]);
        //console.log(itemsChildren[i], '入池')
      }
    }
  }

  //子弹直接入池
  clearBullets() {
    let bulletsChildren = this.bullets.children;
    for (let i = bulletsChildren.length - 1; i >= 0; i--) {
      if (bulletsChildren[i].active && bulletsChildren[i].isValid) {
        PoolMgr.ins.putNode(bulletsChildren[i]);
        //console.log(bulletsChildren[i], '入池')
      }
    }
  }

  //杀伤性道具直接入池
  clearItemKills() {
    let itemKillsChildren = this.itemKills.children;
    for (let i = itemKillsChildren.length - 1; i >= 0; i--) {
      if (itemKillsChildren[i].active && itemKillsChildren[i].isValid) {
        PoolMgr.ins.putNode(itemKillsChildren[i]);
        //console.log(bulletsChildren[i], '入池')
      }
    }
  }

  //所有界面有动画的关闭（调用close方法）
  clearViews() {
    this.node
      .getChildByName("Layer2")
      .getComponentInChildren(GameView)
      ?.close();
    this.node
      .getChildByName("Layer3")
      .getComponentInChildren(HomeView)
      ?.close();
    this.node
      .getChildByName("Layer4")
      .getComponentInChildren(RankView)
      ?.close();
    this.node
      .getChildByName("Layer4")
      .getComponentInChildren(ResultView)
      ?.close();
    this.node
      .getChildByName("Layer4")
      .getComponentInChildren(PauseView)
      ?.close();
  }

  //清空
  clear(dotsClearType: number) {
    console.log("game clear");
    //取消回调
    this.unscheduleAllCallbacks();
    //清理场景
    this.clearItems();
    this.clearBullets();
    switch (dotsClearType) {
      case 1:
        this.clearDots();
        break;
      case 2:
        this.clearDotsOnDead();
        break;
      default:
        this.clearDots();
        break;
    }
    this.clearItemKills();
    //清理界面
    this.clearViews();
    //清理数据
    GameMgr.ins.score = 0;
    GameMgr.ins.coin = 0;
  }

  //界面出池
  initHomeView() {
    ResMgr.ins.getUI(ui.HomeView);
  }
  initGameView() {
    ResMgr.ins.getUI(ui.GameView);
  }
  initPauseView() {
    ResMgr.ins.getUI(ui.PauseView);
  }
  initResultView() {
    ResMgr.ins.getUI(ui.ResultView);
  }
  initRankView() {
    ResMgr.ins.getUI(ui.RankView);
  }

  onLoad() {
    //饿汉式单例
    GameMgr._ins = this;
  }

  start() {
    //节点确立
    this.enemys = this.node.getChildByName("Enemys");
    this.items = this.node.getChildByName("Items");
    this.bullets = this.node.getChildByName("Bullets");
    this.itemKills = this.node.getChildByName("ItemKills");
    Tools.initUILayerNodes(7);
    //初始化
    this.Init();
    //打开事件监听
    console.log("打开事件监听");
    EventMgr.ins.on(
      Events.StartPlay,
      () => {
        this.startPlay();
      },
      this
    );
    EventMgr.ins.on(
      Events.Die,
      () => {
        this.afterDeath();
      },
      this
    );
  }

  onDisable() {
    this.unscheduleAllCallbacks();
    EventMgr.ins.off(
      Events.StartPlay,
      () => {
        this.startPlay();
      },
      this
    );
    EventMgr.ins.off(
      Events.Die,
      () => {
        this.afterDeath();
      },
      this
    );
    //this.eventLitsener.off(Events.Reset, () => { this.reset() })
  }
}
