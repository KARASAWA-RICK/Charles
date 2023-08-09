import { _decorator, Collider2D, Component, Contact2DType, find, IPhysics2DContact, Node, v3, Vec3 } from 'cc';
import { Tools } from './Tools';
import { COLLIDER2D_TYPE, Global } from './Global';
import { GameMgr } from './GameMgr';
import { PoolMgr } from './manager/PoolMgr';
import { HeroCtrl } from './HeroCtrl';
const { ccclass, property } = _decorator;

@ccclass('PackmanCtrl')
export class PackmanCtrl extends Component {
    hero:Node
    enemys: Node
    targetEnemy: Node
    dir: Vec3 = Tools.ZERO
    @property
    moveSpeed: number = 400

    //初始化
    Init() {
        this.enemys = find('Canvas/Enemys')
        this.enemys.children
        //出现时先选择一次目标
        this.setTarget()
        //之后只有碰撞一次敌人后才再次选择目标
        this.node.getChildByName('packman_2').getComponent(Collider2D).on(Contact2DType.BEGIN_CONTACT, this.onChange, this)
    }

    //设置目标
    setTarget() {
        
        let targetEnemy: Node = null
        let children = this.enemys.children
        //如果没有敌人，则直接入池
        if(children.length == 0){
            PoolMgr.ins.putNode(this.node)
        }
        let minDis: number = Infinity
        //遍历敌人
        for (let i = children.length-1; i >= 0; i--) {
            if (children[i].active && children[i].isValid && children[i].name != 'DeadDot' &&
                children[i].position.x <= (GameMgr.ins.WIDTH -100) / 2 && children[i].position.x >= (-GameMgr.ins.WIDTH +100) / 2 && children[i].position.y <= (GameMgr.ins.HEIGHT - 400)/ 2 && children[i].position.y >= (-GameMgr.ins.HEIGHT + 400)/ 2) {
                //获取敌人位置
                let enemypos = children[i].getPosition()
                //计算距离
                let dis = Tools.calculateDistance(Tools.convertTo2D(this.node.position), Tools.convertTo2D(enemypos))
                //取得距离最短的敌人，设为目标
                if (dis < minDis && dis >= 10) {
                    minDis = dis
                    targetEnemy = children[i]
                }
            }
        }
        this.targetEnemy = targetEnemy
    }

    //切换目标
    onChange(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        //如果碰撞了敌人，则重置目标敌人，否则返回
        if (otherCollider.tag == COLLIDER2D_TYPE.Dot) {
            //console.log('换人！')
            this.setTarget()
        } else {
            return
        }
    }

    //移动
    packmanMove(deltaTime) {
        //移动方向向量
        this.dir = Tools.convertTo3D(Tools.calculateDir(Tools.convertTo2D(this.node.position), Tools.convertTo2D(this.targetEnemy.position)))
        //console.log(this.dir)
        //转动角度
        this.node.angle = Tools.convertToAngle(this.dir)

        let newPos = v3(this.node.position.x + this.dir.x * this.moveSpeed * deltaTime, this.node.position.y + this.dir.y * this.moveSpeed * deltaTime, 0)
        this.node.position = newPos
    }

    update(deltaTime: number) {
        //如果玩家死亡，则不刷新
        if (GameMgr.ins.isDead) {
            this.unscheduleAllCallbacks()
            return
        }
        //每帧检测目标敌人是否正常，正常则正常移动，不正常则重新设置目标敌人
        if (this.targetEnemy.active && this.targetEnemy.isValid && this.targetEnemy.name != 'DeadDot' &&
        this.targetEnemy.position.x <= (GameMgr.ins.WIDTH -100) / 2 && this.targetEnemy.position.x >= (-GameMgr.ins.WIDTH +100) / 2 && this.targetEnemy.position.y <= (GameMgr.ins.HEIGHT - 400)/ 2 && this.targetEnemy.position.y >= (-GameMgr.ins.HEIGHT + 400)/ 2) {
            this.packmanMove(deltaTime)
        } else {
            this.setTarget()
        }
    }

    protected onDisable(): void {
        this.node.getChildByName('packman_2').getComponent(Collider2D).off(Contact2DType.BEGIN_CONTACT, this.onChange, this)
    }
}


