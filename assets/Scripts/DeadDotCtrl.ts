import { _decorator, Color, Component, math, Node, Sprite, SpriteFrame } from 'cc';
import { PoolMgr } from './manager/PoolMgr';
const { ccclass, property } = _decorator;

@ccclass('DeadDotCtrl')
export class DeadDotCtrl extends Component {
    @property([SpriteFrame])
    deathSpriteArr: SpriteFrame[] = []

    @property([SpriteFrame])
    swipeSpriteArr: SpriteFrame[] = []

    //根据死亡Dot的皮肤名称初始化
    Init(dotSpriteFrameName: string) {
        //随机生成死亡图片
        this.getComponent(Sprite).spriteFrame = this.deathSpriteArr[math.randomRangeInt(0,this.deathSpriteArr.length)]
        
        //设置颜色
        let r
        let g
        let b
        switch (dotSpriteFrameName) {
            case 'dot_1':
                r = 211
                g = 187
                b = 255
                break
            case 'dot_2':
                r = 195
                g = 131
                b = 188
                break
            case 'dot_3':
                r = 68
                g = 138
                b = 202
                break
            case 'dot_4':
                r = 153
                g = 211
                b = 79
                break
            case 'dot_5':
                r = 161
                g = 145
                b = 138
                break
            case 'dot_6':
                r = 234
                g = 95
                b = 216
                break
        }
        this.getComponent(Sprite).color = new Color(r, g, b)
        //1S后入池
        this.scheduleOnce(() => { PoolMgr.ins.putNode(this.node) }, 1)
    }

}


