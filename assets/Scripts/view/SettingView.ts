import { _decorator, Node } from 'cc'
import { BaseView } from './BaseView'
import { Global, Sound } from '../Global'
import { AudioMgr } from '../manager/AudioMgr'
const { ccclass, property } = _decorator

@ccclass('SettingView')
export class SettingView extends BaseView {
    @property({ type: Node })
    btn_music_on = null

    @property({ type: Node })
    btn_music_off = null

    @property({ type: Node })
    btn_effect_on = null

    @property({ type: Node })
    btn_effect_off = null

    init() {
        this.refreshBtn()
    }

    refreshBtn() {
        this.btn_music_on.active = Global.canMusic
        this.btn_music_off.active = !Global.canMusic

        this.btn_effect_on.active = Global.canEffect
        this.btn_effect_off.active = !Global.canEffect

        if (Global.canMusic) {
            if (!AudioMgr.ins.isMusicPlaying()) {
                AudioMgr.ins.playMusic(Sound.bgm)
            }
        } else {
            AudioMgr.ins.stopMusic()
        }
    }

    callBackBtn(event: Event, str: string) {
        if (str == 'btn_music_on' || str == 'btn_music_off') {
            Global.canMusic = !Global.canMusic
            this.refreshBtn()
        } else if (str == 'btn_effect_on' || str == 'btn_effect_off') {
            Global.canEffect = !Global.canEffect
            this.refreshBtn()
        }

        if (Global.canEffect) {
            AudioMgr.ins.playSound(Sound.btn, 0.5)
        }
    }

    update(deltaTime: number) {

    }
}

