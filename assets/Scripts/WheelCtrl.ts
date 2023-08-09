import { _decorator, Component, find, Node } from 'cc';
import { HeroCtrl } from './HeroCtrl';
import { GameMgr } from './GameMgr';
const { ccclass, property } = _decorator;

@ccclass('WheelCtrl')
export class WheelCtrl extends Component {
    update(deltaTime: number) {
        //如果玩家死亡，则不刷新
        if (GameMgr.ins.isDead) {
            this.unscheduleAllCallbacks()
            return
        }
        //电锯旋转
        this.node.angle += 360 * deltaTime
    }
}


