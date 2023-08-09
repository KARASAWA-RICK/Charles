//全局枚举
//服务号枚举
export enum STYPE {
    //聊天室
    Chatroom = 1,
}

//命令号枚举
export enum CTYPE {
    Enter = 1,
    Exit = 2,
    UserEnter = 3,
    UserExit = 4,
    SendMsg = 5,
    UserMsg = 6,
    HeartCheck = 7
}

//响应状态枚举
export enum Respones {
    OK = 1,
    IS_IN_CHATROOM = -100,
    NOT_IN_CHATROOM = -101,
    INVALD_OPT = -102,
    INVALID_PARAMS = -103,
}

//消息中转类型枚举
export enum ProtoType {
    PROTO_JSON = 1,
    PROTO_BUF = 2
}


