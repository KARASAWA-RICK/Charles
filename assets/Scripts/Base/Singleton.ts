/**
 *懒汉单例基类
 *
 * @export
 * @class Singlton
 */
export class Singlton {
  private static _ins: any = null;

  // 可选的初始化方法
  protected init?(): void;

  public static GetInstance<T extends Singlton>(): T {
    if (!this._ins) {
      this._ins = new this();
      // 若有初始化方法则直接调用
      if (typeof this._ins.init === "function") {
        this._ins.init();
      }
    }
    return this._ins;
  }
}
