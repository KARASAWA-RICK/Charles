import { _decorator, Component, find, instantiate, math, Node, Prefab, Sprite, SpriteFrame, v2 } from 'cc';
import { Tools } from './Tools';
import { BOSS_TYPE, BULLET_TYPE } from './Global';
import { BossBulletCtrl } from './BossBulletCtrl';
import { PoolMgr } from './manager/PoolMgr';
import { EnemyCtrl } from './EnemyCtrl';
import { HeroCtrl } from './HeroCtrl';
import { DotCtrl } from './DotCtrl';
import { GameMgr } from './GameMgr';
const { ccclass, property } = _decorator;

@ccclass('BossCtrl')
export class BossCtrl extends DotCtrl {
    //Boss类型
    bossType: number = -1

    //Boss旋转速度
    @property
    bossRotateSpeed: number = 0

    //根据Boss种类与朝向初始化Boss
    Init(bossType: number, angle: number) {
        this.bossType = bossType
        this.node.angle = angle
        //从皮肤数组里随机选择皮肤
        this.node.getComponent(Sprite).spriteFrame = this.skinSpriteArr[math.randomRangeInt(0, this.skinSpriteArr.length)]
        //淡入效果
        Tools.fadeIn(this.node, 0.5)
        //开火
        this.BossShoot(this.bossType)
    }

    BossShoot(bossType) {
        switch (bossType) {
            //如果是环绕
            case BOSS_TYPE.Circle:
                //每0.35S发射一次
                this.schedule(this.CircleShoot, 0.75)
                break
            //如果是转圈
            case BOSS_TYPE.Emmiter:
                //每0.2S发射一次
                this.schedule(this.EmmiterShoot, 0.1)
                break
            //如果是散弹
            case BOSS_TYPE.Spray:
                //每0.2S发射一次
                this.schedule(this.SprayShoot, 0.4)
                break
            //如果出错
            default:
                console.log('Boss类型不明，开火失败')
                break
        }
    }

    //360度环绕开火
    CircleShoot() {
        
        //每30度发射一枚子弹
        //console.log('环绕')
        for (let bulletAngle = this.node.angle; bulletAngle <= this.node.angle + 360; bulletAngle += 15) {
            //BossBullet出池
            let bullet: Node = PoolMgr.ins.getNode('BossBullet', this.enemys, this.node.position)
            bullet.getComponent(BossBulletCtrl).Init(Tools.convertToDir(math.toRadian(bulletAngle)))
        }
    }

    //旋转开火
    EmmiterShoot() {
        
        //console.log('旋转')
        //BossBullet出池
        let bullet: Node = PoolMgr.ins.getNode('BossBullet', this.enemys, this.node.position)
        bullet.getComponent(BossBulletCtrl).Init(Tools.convertToDir(math.toRadian(this.node.angle)))
    }

    //散弹开火
    SprayShoot() {
        
        //console.log('散弹')
        for (let bulletAngle = this.node.angle - 20; bulletAngle <= this.node.angle + 20; bulletAngle += 5) {
            //BossBullet出池
            let bullet: Node = PoolMgr.ins.getNode('BossBullet', this.enemys, this.node.position)
            bullet.getComponent(BossBulletCtrl).Init(Tools.convertToDir(math.toRadian(bulletAngle)))
        }
    }

    //Boss旋转
    BossRotate(dlt: number) {
        if(this.bossType == BOSS_TYPE.Circle){
            this.bossRotateSpeed = 40
        }else if(this.bossType == BOSS_TYPE.Emmiter){
            this.bossRotateSpeed = 300
        }
        this.node.angle += this.bossRotateSpeed * dlt
    }

    update(deltaTime: number) {
        //如果玩家死亡，则不刷新
        if (GameMgr.ins.isDead) {
            this.unscheduleAllCallbacks()
            return
        }
        //只要Boss类型不是散弹，就旋转
        if (this.bossType != BOSS_TYPE.Spray) {
            this.BossRotate(deltaTime)
        }
    }
    

    onDisable() {
        this.unscheduleAllCallbacks()
    }
}


