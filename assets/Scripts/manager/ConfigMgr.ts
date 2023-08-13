import { _decorator, Component, JsonAsset, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ConfigMgr')
export class ConfigMgr  {
    private static _ins: ConfigMgr = null!;

    public static get ins() {
        if (!this._ins) {
            this._ins = new ConfigMgr();

        }

        return this._ins;
    }

    private _dataTables:any = {};



    addTable (tableName:string, tableContent:any) {
        if (this._dataTables[tableName]) {
            return;
        }

        let dict={}
        let num=tableContent.data.length;
        for (let i = 0; i < num; i++) {
            let data=tableContent.data[i];
            dict[Number(data.id)]=data;//通过id保存

            // console.log("addTable==>"+data.id)
        }

        this._dataTables[tableName] = dict;


    }


    /**
     * 根据表名获取表的所有内容
     * @param {string} tableName  表名
     * @returns {object} 表内容
     */
    getTable (tableName:string) {
        return this._dataTables[tableName];
    }

    /**
     * 查询一条表内容
     * @param {string} tableName 表名
     * @param {number} key 唯一ID
     * @returns {Object} 一条表内容
     */
    queryOne (tableName:string, key:number) {
        var table = this.getTable(tableName);
        if (!table) {
            return null;
        }

        console.log("queryOne==>>"+tableName+","+key)
        
        return table[key];
        
    }

    /**
     * 根据ID查询一条表内容
     * @param {string}tableName 表名
     * @param {string}ID
     * @returns {Object} 一条表内容
     */
    queryByID (tableName:string, ID:string) {
        //@ts-ignore
        return this.queryOne(tableName, ID);
    }
}

