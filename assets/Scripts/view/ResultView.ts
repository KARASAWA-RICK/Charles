import { _decorator, Node, Label, Vec3, Game, director } from 'cc'
import { BaseView } from '../view/BaseView'
import { Global, Sound, Events, SAVE_KEY } from '../Global'
import { AudioMgr } from '../manager/AudioMgr'


import { save, load } from '../Tools'

import { WECHAT } from 'cc/env'
import { GameMgr } from '../GameMgr'
import { userInfo } from '../httpTest/Global_http'
import { httpGet } from '../httpTest/Tool_http'
const { ccclass, property } = _decorator

@ccclass('ResultView')
export class ResultView extends BaseView {

    @property({ type: Node })
    btnFH = null

    @property({ type: Node })
    btnCW = null

    @property({ type: Label })
    labelScoreCurr = null

    @property({ type: Label })
    labelScoreBest = null

    @property({ type: [Node] })
    arrTitle = [] //游戏结束，挑战失败，挑战成功


    init(score: number, coin: number) {
        //分数结算
        if (score >= userInfo.score || !userInfo.score) {
            userInfo.score = score
        }
        console.log('当前分数' + score)
        this.node.getChildByName('SCORE').getChildByName('Label').getComponent(Label).string = score.toString()
        this.node.getChildByName('BESTSCORE').getChildByName('Label').getComponent(Label).string = userInfo.score.toString()

        //金币结算
        if (!userInfo.money) {
            userInfo.money = 0
        }
        userInfo.money = userInfo.money + coin
        console.log('当前金币' + coin)
        this.node.getChildByName('Coin').getChildByName('Label').getComponent(Label).string = userInfo.money.toString()

        //上传服务器
        this.updateScoreAndMoney()
    }

    //更新服务器分数与金币
    async updateScoreAndMoney() {
        let url = "http://127.0.0.1:6080/update_score_and_money?id=" + userInfo.id + "&score=" + userInfo.score + "&money=" + userInfo.money
        httpGet(url, (responseObj) => {
            console.log(responseObj.status)
        })
    }

    async callBackBtn(event: Event, eventName: string) {
        console.log('按键回调')
        switch (eventName) {
            case Events.GameInit:
                GameMgr.ins.Init()
                break

        }

    }

    onEnable(): void {
        this.init(GameMgr.ins.score, GameMgr.ins.coin)
    }
}
