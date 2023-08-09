import { _decorator, Component, Node, Enum, EventTouch, UITransformComponent, Vec3, view, debug, Sprite, color, Vec2 } from "cc"
const { ccclass, property } = _decorator
import { TOUCH_TYPE, DIRECTION_TYPE, Global } from './Global'
import { HeroCtrl } from "./HeroCtrl"
import { Tools } from "./Tools"


@ccclass("Joystick")
export class Joystick extends Component {
    //Joystick属性页面配置
    @property({ type: Node, displayName: '摇杆背景节点' })
    public ndRing: Node = null!

    @property({ type: Node, displayName: '摇杆节点' })
    public ndDot: Node = null!

    @property({ type: TOUCH_TYPE, displayName: '触摸类型' })
    public touchType = TOUCH_TYPE.DEFAULT

    @property({ type: DIRECTION_TYPE, displayName: '方向类型' })
    public directionType = DIRECTION_TYPE.ALL

    @property({ displayName: '启动半透明' })
    public isEnableTransparent: boolean = false

    @property({ displayName: '死区' })
    public innerSize: number = 10

    @property(Node)
    public hero: Node = null!

  /*   public onClickCb: Function = null!
    public onEndCb: Function = null!
    public clearFECb: Function = null!
    public onBeginFECb: Function = null!
    public onSuccessFECb: Function = null! */

    public get distanceRate() {
        return this._distanceRate
    }
    public set distanceRate(v: number) {
        this._distanceRate = v
    }

    public get angle() {
        return this._angle
    }
    public set angle(v: number) {
        this._angle = v
    }

    private _angle: number = 0//当前角度
    private _stickPos: Vec3 = new Vec3()
    private _oriDotPos: Vec3 = new Vec3()//遥感初始位置
    private _oriRingPos: Vec3 = new Vec3()//圆圈背景初始位置
    private _targetRingPos: Vec3 = new Vec3()//圆圈背景实时位置
    private _touchStartLocation: Vec3 = new Vec3()//开始触碰世界坐标
    private _touchMoveLocation: Vec3 = new Vec3()//移动触碰世界坐标
    private _touchEndLocation: Vec3 = new Vec3()//结束触碰世界坐标
    private _isOutInnerSize: Boolean = false//遥感是否突破死区
    private _distanceRate: number = 0 //遥感移动距离比
    private _checkInterval: number = 0.04//每40ms刷新一次
    private _oldAngle: number = 0//实时角度
    private _currentTime: number = 0//当前累积时间

    private _movePos: Vec3 = new Vec3()//移动坐标

    private stayTime: number

    //重置
    public reset() {
        Global.isMove = false
        this.ndDot.setPosition(this._oriDotPos)

        if (this.touchType != TOUCH_TYPE.DEFAULT) {
            this._targetRingPos = null!
            this.ndRing.setPosition(this._oriRingPos)
        }
    }

    //更新玩家角度
    private _updateAngle(dir: Vec3) {
        this._angle = Tools.convertToAngle(dir)//向量转角度
        return this._angle
    }

    //开始触摸事件回调函数
    private _touchStartEvent(event: EventTouch) {
        // 记录触摸的世界坐标，给touch move使用
        // this.dot.opacity = 255
        this._targetRingPos = null!
        Global.isMove = true

        //获取开始触摸事件世界坐标
        let touch = event.getUILocation()
        this._touchStartLocation.set(Tools.convertTo3D(touch))
        //开始触摸事件的世界坐标转化为对应节点下的相对坐标
        let touchPos = this.node.getComponent(UITransformComponent)?.convertToNodeSpaceAR(this._touchStartLocation) as Vec3

        if (this._oriRingPos.length() === 0) {
            this._oriRingPos = this.ndRing.getPosition()
        }

        // 记录摇杆位置，给touch move使用
        this._stickPos.set(touchPos)

        this._isOutInnerSize = false


        //设置遥感可移动范围
        // if (this.touchType === TOUCH_TYPE.FOLLOW) {
        //     touchPos.y = touchPos.y >= -screenHeight/6 ? -screenHeight/6 : touchPos.y
        // } 

        this.ndRing.setPosition(touchPos)

    }

    private _touchMoveEvent(event: EventTouch) {
        //获取移动触摸的世界坐标
        let touch = event.getUILocation()

        this._touchMoveLocation.set(Tools.convertTo3D(touch))
        //遥感距离圆圈锚点（父节点）的距离
        let touchPos = this.ndRing.getComponent(UITransformComponent)?.convertToNodeSpaceAR(this._touchMoveLocation) as Vec3

        this.stayTime = 0

        // if (this.touchType === TOUCH_TYPE.FOLLOW) {
        //     let offsetPos = cc.v3(touchPos.x - this._stickPos.x, touchPos.y - this._stickPos.y, 0)
        //     touchPos = offsetPos
        // }

        let distance = touchPos.length()

        if (distance > this.innerSize) {
            Global.isMove = true
            this._isOutInnerSize = true
        } else {
            Global.isMove = false
            this._isOutInnerSize = false
        }

        //有拖动且有角度才视为开始游戏
        // if (!GameManager.isGameStart && this.isMoving) {
        //     GameManager.isGameStart = true
        //     AudioManager.instance.resumeAll()

        //     clientEvent.dispatchEvent(constant.EVENT_TYPE.MONSTER_MOVE)

        //     if (this.ndTip.active) {
        //         this.ndTip.active = false
        //     }

        this._currentTime = this._checkInterval
        // }

        let width = this.ndRing.getComponent(UITransformComponent)?.contentSize.width as number
        //圆圈半径
        let radius = width / 2
        let rate = 0
        // 由于摇杆的postion是以父节点为锚点，所以定位要加上ring和dot当前的位置(stickX,stickY)
        //如果在圈内移动
        if (radius > distance) {
            //遥感移动距离占圆圈半径的比例
            rate = Number((distance / radius).toFixed(3))
            //摇杆位置 = 触摸位置
            this.ndDot.setPosition(touchPos)
        }
        else if (this.touchType !== TOUCH_TYPE.FOLLOW_DOT) {
            rate = 1
            //控杆永远保持在圈内，并在圈内跟随触摸更新角度
            let radian = Math.atan2(touchPos.y, touchPos.x)

            let x = Math.cos(radian) * radius//传递弧度值
            let y = Math.sin(radian) * radius
            this._movePos.set(x, y, 0)
            this.ndDot.setPosition(this._movePos)
        }
        else {
            // 点跟随移动
            this.ndDot.setPosition(touchPos)
        }
        //更新角度
        this._updateAngle(touchPos)
        //更新遥感移动距离百分比
        this.distanceRate = rate
    }

    private _touchEndEvent(event: EventTouch) {
        this.reset()
    }

    onEnable() {
        //开启开始触摸事件监听
        this.node.on(Node.EventType.TOUCH_START, this._touchStartEvent, this)
        //开启触摸移动事件监听
        this.node.on(Node.EventType.TOUCH_MOVE, this._touchMoveEvent, this)

        //手指在圆圈内离开或在圆圈外离开后，摇杆归位，player速度为0
        //开启结束触摸事件监听
        this.node.on(Node.EventType.TOUCH_END, this._touchEndEvent, this)
        //开启取消触摸事件监听
        this.node.on(Node.EventType.TOUCH_CANCEL, this._touchEndEvent, this)
    }

    start() {
        //如果启用半透明，则改变Sprite透明度
        if (this.isEnableTransparent) {
            this.ndRing.getComponent(Sprite).color = color(255, 255, 255, 10)
        }
    }

    onDisable() {
        //关闭监听
        this.node.off(Node.EventType.TOUCH_START, this._touchStartEvent, this)
        this.node.off(Node.EventType.TOUCH_MOVE, this._touchMoveEvent, this)
        this.node.off(Node.EventType.TOUCH_END, this._touchEndEvent, this)
        this.node.off(Node.EventType.TOUCH_CANCEL, this._touchEndEvent, this)

        //重置
        this.reset()
    }

    update(deltaTime: number) {
        this._currentTime += deltaTime
        if (this._currentTime >= this._checkInterval) {
            this._currentTime = 0
            if (Global.isMove) {
                this.stayTime += deltaTime
                Global.isMove = this.stayTime <= 0.05
                if (this.angle !== this._oldAngle) {
                    this._oldAngle = this.angle
                    this.hero.angle = this.angle
                }
            } else {
                Global.isMove = false
            }
        }
    }
}
