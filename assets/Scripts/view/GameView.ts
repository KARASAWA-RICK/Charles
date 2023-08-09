import { _decorator, Component, director, game, Label, Node } from 'cc';
import { BaseView } from './BaseView';
import { Events } from '../Global';
import { GameMgr } from '../GameMgr';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends BaseView {
    async callBackBtn(event: Event, eventName: string) {
        console.log('按键回调')
        switch (eventName) {
            case Events.Pause:
                if (GameMgr.ins.isPause || GameMgr.ins.isDead || !GameMgr.ins.isStartPlay) {
                    return
                }
                console.log('暂停界面')
                GameMgr.ins.isPause = true
                GameMgr.ins.initPauseView()
                director.pause()
                break
        }
    }

    onEnable(): void {
        let time = 1
        this.schedule(() => {
            if (GameMgr.ins.isDead || !GameMgr.ins.isStartPlay) {
                return
            } else {
                this.node.getChildByName('Score').getChildByName('Label').getComponent(Label).string = time.toString()
                time++
            }

        }, 1)
    }

    protected update(dt: number): void {
        this.node.getChildByName('Coin').getChildByName('Label').getComponent(Label).string = GameMgr.ins.coin.toString()
    }

    protected onDisable(): void {
        this.unscheduleAllCallbacks()
        GameMgr.ins.score = Number(this.node.getChildByName('Score').getChildByName('Label').getComponent(Label).string)
        this.node.getChildByName('Score').getChildByName('Label').getComponent(Label).string = '0'
        this.node.getChildByName('Coin').getChildByName('Label').getComponent(Label).string = '0'

    }
}


