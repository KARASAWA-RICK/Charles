//挂在弹窗prefab上
//弹窗由一个有UIOpacity的背景和一个Label组成，分别拖拽给两个属性
import { _decorator, Component, Node, LabelComponent, director, AnimationComponent, UIOpacity, Tween } from 'cc';
import { events } from './Global';
const { ccclass, property } = _decorator;

@ccclass('TipCtrl')
export class TipCtrl extends Component {

    //定义Label组件text
    @property(LabelComponent)
    text: LabelComponent = null;

    //定义UIOpacity（UI透明度）组件toast
    @property(UIOpacity)
    toast: UIOpacity = null;

    //创建缓动动画
    private _tw = new Tween();
    //缓动延迟时间，即信息停留时间
    private time = 1;

    //每次组件激活时
    onEnable() {
        //全局监听events.Toast事件，如果监听到就回调showToast()运行缓动动画
        director.on(events.Toast, this.showToast, this);
        //将动画目标设置为this.toast
        this._tw.target(this.toast);
        //配置缓动动画运行效果（只是配置，还没运行）
        //设置初始状态，将提示信息的透明度设置为 0，即完全透明
        //在 0.4 秒的时间内，将提示信息的透明度渐变为 255，即完全不透明
        //延迟 this.time 秒，即提示信息停留的时间
        //在 0.2 秒的时间内，将提示信息的透明度渐变为 0，即再次变为完全透明
        this._tw.set({ opacity: 0 }).to(0.4, { opacity: 255 }).delay(this.time).to(0.2, { opacity: 0 });
    }

    //每次组件失效时
    onDisable() {
        //停止全局监听events.Toast事件
        director.off(events.Toast, this.showToast, this);
    }

    //传入一个字符串（表示要显示的文字），和一个数字（表示要显示的时间）
    showToast(text, time = 1.5) {

        this.time = time;

        this.text.string = text;
        //停止缓动动画
        this._tw.stop();
        //运行缓动动画
        this._tw.start();

    }
}


