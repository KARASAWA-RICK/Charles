import { _decorator, Component, Node, Label, director } from 'cc'
import { BaseView } from './BaseView'
import { Events, Global, SAVE_KEY, Sound, ui } from '../Global'
import { GameMgr } from '../GameMgr'
import { userInfo } from '../httpTest/Global_http'


const { ccclass } = _decorator

@ccclass('HomeView')
export class HomeView extends BaseView {
    init() {
        this.node.getChildByName('BEST').getChildByName('Label').getComponent(Label).string = 'BEST' + '  ' + userInfo.score
    }

    async callBackBtn(event: Event, eventName: string) {
        console.log('按键回调')
        switch (eventName) {
            case Events.Rank:
                if (GameMgr.ins.isPause || GameMgr.ins.isDead || GameMgr.ins.isStartPlay) {
                    return
                }
                console.log('排行界面')
                GameMgr.ins.isPause = true
                GameMgr.ins.initRankView()
                director.pause()
                break
        }
    }

    onEnable(): void {
        this.init()
    }
    update(deltaTime: number) {

    }
}

