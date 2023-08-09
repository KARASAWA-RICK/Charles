import { _decorator, Component, Node,Vec3,Vec2,find, Sprite,SpriteFrame,math,tween, v2 } from 'cc'
import { Tools } from './Tools'
import { Global, ITEM_TYPE } from './Global'
import { GameMgr } from './GameMgr'
import { HeroCtrl } from './HeroCtrl'
import { PoolMgr } from './manager/PoolMgr'
import { DotCtrl } from './DotCtrl'
const { ccclass, property } = _decorator

@ccclass('EnemyCtrl')
export class EnemyCtrl extends DotCtrl {
    //敌人移速
    @property
    moveSpeed:number = 160

    //敌人移动方向
    dir = v2(0,0)

    Init(){
        //从皮肤数组里随机选择皮肤
        this.getComponent(Sprite).spriteFrame = this.skinSpriteArr[math.randomRangeInt(0,this.skinSpriteArr.length)]
        //淡入效果
        Tools.fadeIn(this.node,0.5)
    }

    //敌人移动
    enemyMove(deltaTime){
        //目标位置
        let targetPos = this.hero.position
        //当前敌人前进方向
        this.dir = Tools.calculateDir(Tools.convertTo2D(this.node.position), Tools.convertTo2D(targetPos))
        let offsetX = this.dir.x * this.moveSpeed * deltaTime * GameMgr.ins.enemySpeedScale
        let offsetY = this.dir.y * this.moveSpeed * deltaTime * GameMgr.ins.enemySpeedScale
        if(this.hero.getChildByName('Wheel').active){
            offsetX = -offsetX
            offsetY = -offsetY
        }
        let newPos = new Vec3(this.node.position.x+offsetX,this.node.position.y+offsetY,0)
        this.node.setPosition(newPos)
    }

    update(deltaTime: number) {
        //如果玩家死亡，则不刷新
        if (GameMgr.ins.isDead) {
            return
        }
        this.enemyMove(deltaTime)
    }
}

