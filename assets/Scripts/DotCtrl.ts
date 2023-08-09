import { _decorator, Component, find, Node, Sprite, SpriteFrame } from 'cc';
import { PoolMgr } from './manager/PoolMgr';
import { DeadDotCtrl } from './DeadDotCtrl';

const { ccclass, property } = _decorator;



@ccclass('DotCtrl')
export class DotCtrl extends Component {
    //节点
    enemys: Node = find('Canvas/Enemys')
    hero: Node = find('Canvas/Layer1/Hero')
    //敌人prebaf属性页面皮肤数组
    @property([SpriteFrame])
    skinSpriteArr: SpriteFrame[] = []

    

    //敌人死亡
    Die() {
        //死亡图片出池
        let deadDot = PoolMgr.ins.getNode('DeadDot',this.enemys,this.node.getPosition())
        //根据Dot皮肤名称初始化死亡图片
        deadDot.getComponent(DeadDotCtrl).Init(this.getComponent(Sprite).spriteFrame.name)
        PoolMgr.ins.putNode(this.node)
    }


}

