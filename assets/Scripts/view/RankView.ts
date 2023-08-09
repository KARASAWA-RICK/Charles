import { _decorator, Component, director, find, game, Label, Node } from 'cc'
import { BaseView } from './BaseView'
import { Events } from '../Global'
import { GameMgr } from '../GameMgr'
import { PoolMgr } from '../manager/PoolMgr'
import { httpGet } from '../httpTest/Tool_http'
import { userInfo } from '../httpTest/Global_http'
const { ccclass, property } = _decorator

@ccclass('RankView')
export class RankView extends BaseView {
    async callBackBtn(event: Event, eventName: string) {
        console.log('按键回调')
        switch (eventName) {
            case Events.Resume:
                console.log('继续游戏')
                director.resume()
                this.close()
                GameMgr.ins.isPause = false
                break
        }
    }

    init() {
        this.rankScore()
    }

    //得分排名方法
    async rankScore() {
        let url = "http://127.0.0.1:6080/rank_score"
        httpGet(url, (responseObj) => {
            console.log(responseObj.status)
            //前8名
            for (let i = 0; i < Math.min(8, responseObj.data.length); i++) {
                find('Canvas/Layer4/RankView/RankPanel/Uname/Uname' + (i + 1)).getComponent(Label).string = responseObj.data[i].uname
                find('Canvas/Layer4/RankView/RankPanel/Score/Score' + (i + 1)).getComponent(Label).string = responseObj.data[i].score
            }

            //当前玩家
            find('Canvas/Layer4/RankView/RankPanel/Rank/Urank').getComponent(Label).string = responseObj.data.findIndex((elementObj) => { return elementObj.uname == userInfo.uname }) + 1
            find('Canvas/Layer4/RankView/RankPanel/Uname/Uname').getComponent(Label).string = userInfo.uname
            find('Canvas/Layer4/RankView/RankPanel/Score/Uscore').getComponent(Label).string = userInfo.score.toString()

        })
    }

    onEnable(): void {
        this.init()
    }
}




