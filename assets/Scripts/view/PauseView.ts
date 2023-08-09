import { _decorator, Component, director, find, game, Node } from 'cc';
import { BaseView } from './BaseView';
import { Events } from '../Global';
import { GameMgr } from '../GameMgr';
import { HeroCtrl } from '../HeroCtrl';
import { PoolMgr } from '../manager/PoolMgr';
const { ccclass, property } = _decorator;

@ccclass('PauseView')
export class PauseView extends BaseView {
    async callBackBtn(event: Event, eventName: string) {
        console.log('按键回调')
        switch (eventName) {
            case Events.Resume:
                console.log('继续游戏')
                director.resume()
                this.close()
                GameMgr.ins.isPause = false
                break
            case Events.GameInit:
                console.log('回到主界面')
                director.resume()
                this.close()
                GameMgr.ins.isPause = false
                GameMgr.ins.isStartPlay = false
                PoolMgr.ins.putNode(find('Canvas/Layer1/Hero'))
                GameMgr.ins.Init()
                break
        }
    }
}


