import { _decorator, Component, Node, Vec3, Vec2, find, Sprite, SpriteFrame, math, tween, v3 } from 'cc'
import { Global, ITEM_TYPE } from './Global'
import { Tools } from './Tools'
import { HeroCtrl } from './HeroCtrl'
const { ccclass, property } = _decorator

@ccclass('ItemCtrl')
export class ItemCtrl extends Component {
    //道具种类
    itemType: number = -1

    //道具皮肤数组
    @property([SpriteFrame])
    skinSpriteArr: SpriteFrame[] = []

    Init() {
        //this.itemType = ITEM_TYPE.Packman//测试道具用
        //随机生成道具类型
        this.ItemRandom()
        //根据道具皮肤索引，获取并替换道具皮肤
        this.node.getComponent(Sprite).spriteFrame = this.skinSpriteArr[this.itemType]
        //淡入效果
        Tools.fadeIn(this.node)
    }

    //随机生成道具类型
    ItemRandom() {
        //如果随机的道具和上次一样，或者场上有同样的道具，则重新随机
        let itemType = 0
        let children = this.node.parent.children
        let itemTypeArry = []
        for (let i in children) {
            itemTypeArry.push(children[i].getComponent(ItemCtrl).itemType)
        }
        do {
            itemType = math.randomRangeInt(0, this.skinSpriteArr.length)
        }
        while (itemType == find('Canvas/Layer1/Hero').getComponent(HeroCtrl).itemTypeNow || itemTypeArry.indexOf(itemType) !== -1)
        this.itemType = itemType
    }
}

