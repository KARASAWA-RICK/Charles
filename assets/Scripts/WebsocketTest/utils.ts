export class Utils {
    static randomString(len: number): string {
        const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        let str = '';
        for (let i = 0; i < len; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    }

    static randomIntStr(len: number): string {
        const chars = '0123456789';
        let str = '';
        for (let i = 0; i < len; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    }

    static randomInt(begin: number, end: number): number {
        const num = Math.floor(begin + Math.random() * (end - begin + 1));
        return num > end ? end : num;
    }
}
