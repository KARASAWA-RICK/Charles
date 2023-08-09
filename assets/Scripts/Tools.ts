//全局通用函数
//用Tools类封装全局静态方法
import { _decorator, Sprite, SpriteFrame, Texture2D, ImageAsset, Node, tween, UIMeshRenderer, Layers, Vec3, sys, UITransform, Widget, size, view, Vec2, v3, v2, director, instantiate, Canvas } from 'cc';
import ResMgr from './manager/ResMgr';
import { Global } from './Global';

//定义名为rez的对象类型，有index和number两个属性
export interface rez  {
    index?: number,
    amount?: number
}

//数据本地存储方法
//传入键名key，对应值val
//将val对应的值本地保存到key中，用于本地存储数据，例如分数
export function save(key: string, val: string | number) {
    if (typeof val === "number") {
        val = "" + val as string;
    }
    sys.localStorage.setItem(key, val || '')
}

//读取本地数据方法
//传入键名key，数字type（用于表示将key对应值转化成什么类型）
//读取本地存储key对应的值，并根据传入的type将其转化为各种类型
//不写则默认为1，转化成数字
export function load(key: string, type = 1) {
    let res: any = sys.localStorage.getItem(key);
    if (res) {
        switch (type) {
            case 1:
                res = Number(res);
                break;
        }
        return res;
    }
}



//封装常用的全局静态方法
export class Tools {
    //定义xyz都为1的向量
    static ONE = new Vec3(1, 1, 1);
    //定义0向量
    static ZERO = new Vec3(0, 0, 0);

    //获取从1970年1月1日至今的总天数
    static getDay() {
        return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    }

    //创建覆盖全屏的空节点
    static createUI(): Node {
        // 获取可见区域的大小
        const size = view.getVisibleSize();
        // 创建节点
        const node = new Node()
        // 添加UITransform组件，并设置内容大小为可见区域的大小
        const transfrom = node.addComponent(UITransform);
        transfrom.setContentSize(size);
        // 添加Widget组件，并设置对齐方式和边距
        const widget = node.addComponent(Widget);
        widget.isAlignLeft = widget.isAlignTop = widget.isAlignTop = widget.isAlignBottom = true;
        widget.right = widget.left = widget.top = widget.bottom = 0;
        // 设置节点层级为UI_2D
        node.layer = Layers.Enum.UI_2D;
        return node;
    }

    //是英语环境返回true，否则false
    static isEn(): boolean {
        return (navigator.language.indexOf("zh") != -1) ? false : true;
    }

    //传入rez类型的对象数组
    //从中随机取一个对象元素，将其amount-1，如果归零了就将其移除数组，并返回该对象元素的index
    static randFromArray(a: rez[]) {

        const L = a.length;

        const i = Math.floor(Math.random() * L);

        const r = a[i];

        r.amount--;

        if (r.amount <= 0) {
            a.splice(i, 1);
        };

        return r.index;
    }

    //依据节点从数组中移除元素：
    //传入一个节点，和一个由含有节点属性的元素构成的数组
    //从数组中移除第一个含有该节点的元素
    static clearFromArrayNode(key, array) {
        const l = array.length;
        for (var i = 0; i < l; i++) {
            if (array[i].node == key) {
                array.splice(i, 1);
                break;
            }
        }
    }

    //从数组中移除元素：
    //传入一个元素，和一个数组
    //从该数组中移除第一个该元素
    static clearFromArray(key, array) {
        const l = array.length;
        for (var i = 0; i < l; i++) {
            if (array[i] == key) {
                array.splice(i, 1);
                break;
            }
        }
    }

    //传入两个数字min和max
    //生成min和max之间的一个随机数
    static randBetween(min: number, max: number) {
        return min + Math.random() * (max - min);
    }

    //传入一个节点，和一个布尔值，如果不写则默认true。
    //如果true则释放Sprite的内存
    static clearUI(node: Node, clear = true) {

        if (clear) {
            const sp = node.getComponent(Sprite);
            sp && Tools.clearSprite(sp);
            const sps = node.getComponentsInChildren(Sprite);
            if (sps.length > 0) {
                sps.forEach((v) => {
                    /* Release mem */
                    Tools.clearSprite(v);
                })
            }

        }
        node.destroy();
    }

    //节点的淡入效果：
    //传入一个节点，和一个数字用于表示淡入时间
    static fadeIn(node: Node, dura = 0.2, scale = this.ONE) {
        //将节点尺寸缩小为0
        node.setScale(Vec3.ZERO);
        //在dura时间内逐渐恢复原来尺寸
        tween(node).to(dura, { scale: scale }).start();

    }

    //节点的淡出效果：
    //传入一个节点，和一个淡出结束后的回调函数
    //淡出后，节点不可见，且不参与物理效果，但还在场景中
    static fadeOut(node: Node, cb?) {
        //在0.15秒后将节点尺寸缩小为0
        tween(node).to(0.15, { scale: this.ZERO }, { easing: 'elasticOut' }).call(() => {
            cb && cb();
        }).start();
    }

    //传入一个Sprite，并清理（并非销毁该Sprite）
    static clearSprite(sp: Sprite) {
        const sf = sp.spriteFrame as SpriteFrame;
        if (sf) {
            sp.spriteFrame = null;
            if (sf && sf.refCount > 0) {
                sf.decRef();
                const tex = sf.texture as Texture2D;
                console.log("released")
                this.clearTex(tex)

            }
        }
    }

    //传入一个Texture2D，并清理（并非销毁该Texture2D）
    static clearTex(tex: Texture2D) {

        if (tex && tex.refCount > 0) {
            tex.decRef();
            const image = tex.image as ImageAsset;
            if (image && image.refCount > 0) {
                image.decRef();
            }
        }
    }

    //传入一个节点，和一个布尔值，默认为true
    //true则将该节点层级设置为UI_2D，并添加UIMeshRenderer组件；false则为DEFAULT，并移除UIMeshRenderer组件
    static convertUI(node: Node, is2D = true) {

        if (is2D) {
            node.addComponent(UIMeshRenderer);

            node.layer = Layers.Enum.UI_2D;

            node.setScale(42, 42, 42)

        } else {
            node.setScale(0.5, 0.5, 0.5)

            node.layer = Layers.Enum.DEFAULT;

            let ui = node.getComponent(UIMeshRenderer);

            ui && ui.destroy();

            let prefab = ResMgr.ins.getPrefab("")
        }
    }

    //向量三维转二维
    static convertTo2D(vector3: Vec3): Vec2 {
        // 选择将 z 轴投影到 x 轴上
        const x = vector3.x
        const y = vector3.y

        // 创建一个二维向量对象
        const vector2 = v2(x, y)
        //返回二维向量
        return vector2
    }

    //向量二维转三维
    static convertTo3D(vector2: Vec2): Vec3 {
        const x = vector2.x
        const y = vector2.y

        const vector3 = v3(x, y, 0)

        return vector3
    }

    //计算point1 → point2的距离
    static calculateDistance(point1: Vec2, point2: Vec2): number {
        const dx = point2.x - point1.x
        const dy = point2.y - point1.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance
    }

    //计算point1 → point2的方向向量
    static calculateDir(point1: Vec2, point2: Vec2):Vec2 {
        let dir= (point2.subtract(point1)).normalize()
        return dir
    }

    //角度转弧度
    static convertToRadian(angle: number) {
        const RADIAN = Math.PI / 180
        let radian = angle * RADIAN
        return radian
    }

    //弧度转方向向量
    static convertToDir(radian: number) {
        let dir = v2(Math.cos(radian), Math.sin(radian)).normalize()
        return dir
    }

    //向量转角度
    static convertToAngle(pos: Vec2 | Vec3) {
        let angle = Math.round(Math.atan2(pos.y, pos.x) * 180 / Math.PI)
        return angle
    }

    //生成6个空节点用于分层放置UI的prefab实例
    //泛用方法
    static initUILayerNodes(layerNumber:number) {
        const scene = director.getScene()
        for (let i = 0; i <= layerNumber; i++) {
            Global.layer[i] = Global.layer[i] ? instantiate(Global.layer[i]) : Tools.createUI()
            Global.layer[i].name = "Layer" + i
            Global.layer[i].parent = scene.getComponentInChildren(Canvas).node
        }
    }
}

