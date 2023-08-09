import { _decorator, Component, Node, Vec2, Vec3, SpriteFrame, Collider2D, Contact2DType, IPhysics2DContact, Sprite, UITransform, BoxCollider2D, size, math } from 'cc';
import { BULLET_TYPE, ITEM_TYPE } from './Global';
import { GameMgr } from './GameMgr';
import { PoolMgr } from './manager/PoolMgr';
import { Tools } from './Tools';
const { ccclass, property } = _decorator;

@ccclass('BulletCtrl')
export class BulletCtrl extends Component {
    //子弹方向
    dir: Vec2
    //子弹速度
    bulletSpeed: number = 0
    //子弹类型
    bulletType: number = -1
    //子弹皮肤数组
    @property([SpriteFrame])
    bulletSkinArry: SpriteFrame[] = []

    
    //根据子弹类型、角度初始化子弹
    Init(bulletType:number, angle:number) {
        //设置子弹类型
        this.bulletType = bulletType
        //设置子弹角度
        this.node.angle = angle
        //设置子弹发射方向
        let radian = math.toRadian(angle + 90)
        this.dir = Tools.convertToDir(radian)

        //设置子弹皮肤
        this.getComponent(Sprite).spriteFrame = this.bulletSkinArry[bulletType]
        
        //设置子弹Collider2D与UITransform大小同步（UITransform大小与SpriteFrame大小自动同步）
        let contentSize = this.getComponent(UITransform).contentSize
        this.getComponent(BoxCollider2D).size = size(contentSize.width, contentSize.height)

        //设置子弹速度
        if (this.bulletType == BULLET_TYPE.Big) {
            this.bulletSpeed = 600
        }
        else if (this.bulletType == BULLET_TYPE.Fire) {
            this.bulletSpeed = 800
        }
        else if (this.bulletType == BULLET_TYPE.Gun) {
            this.bulletSpeed = 1500
        }
    }

    //子弹移动
    bulletMove(deltaTime: number) {
        let newPos = new Vec3(this.node.position.x + this.dir.x * deltaTime * this.bulletSpeed, this.node.position.y + this.dir.y * deltaTime * this.bulletSpeed, 0);
        this.node.setPosition(newPos)
    }

    update(deltaTime: number) {
        this.bulletMove(deltaTime)
        //超出边界销毁
        if (this.node.position.x >= (GameMgr.ins.WIDTH -100) / 2 || this.node.position.x <= (-GameMgr.ins.WIDTH + 100)/ 2 || this.node.position.y >= (GameMgr.ins.HEIGHT - 400)/ 2 || this.node.position.y <= (-GameMgr.ins.HEIGHT + 400)/ 2) {
            PoolMgr.ins.putNode(this.node)
        }
    }
    
}

