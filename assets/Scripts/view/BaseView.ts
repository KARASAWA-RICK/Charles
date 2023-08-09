import { _decorator, Component, director, Node } from 'cc'

import { AudioMgr } from '../manager/AudioMgr'
import { PoolMgr } from '../manager/PoolMgr'
import { Props, Sound, Global, Events } from '../Global'
import { Tools } from '../Tools'
import { GameMgr } from '../GameMgr'
const { ccclass, property } = _decorator

@ccclass('BaseView')
export class BaseView extends Component {
    //配置View属性面板

    //是否开启缓动
    @property({
        displayOrder: 0,
        group: Props.View
    })
    tweenView = true

    //缓动效果的根节点
    @property({
        type: Node,
        visible() {
            return this.tweenView
        },
        displayOrder: 0,
        group: Props.View
    })
    root: Node = null

    //缓动效果的时间
    @property({
        visible() {
            return this.tweenView
        },
        displayOrder: 0,
        group: Props.View
    })
    tweenTime = 0.25;

    //是否播放按钮音效
    @property({
        displayOrder: 0,
        group: Props.View
    })
    playBtnClip = true;


    

    //关闭界面
    close() {
        PoolMgr.ins.putNode(this.node)
    }


    onEnable() {
        //如果开启缓动效果
        if (this.tweenView) {
            //如果没有指定根节点,整个界面作为缓动根节点
            if (!this.root) this.root = this.node
        }
    }

   


}

