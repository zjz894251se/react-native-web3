/**
 * Cross事件类型
 * @type {{PROVIDER: number}}
 */
export const CrossEventType = {
    PROVIDER:1,
    OPEN_DAPP:2,//打开dapp
}

/**
 * web 和 native通讯的事件
 * @property {{PROVIDER: number}} type
 * @property {Object} data
 * @property {number} id
 */
export class CrossEvent{
    /**
     * @param {number} type
     * @param {{resolve:any,reason:any} || Object ||?} data
     * @param {number?} id 消息id
     */
    constructor(type,id,data) {
        this.type = type;
        this.data = data;
        this.id = id;
    }
}
/**
 * 事件管理
 */
export class CrossEventMgr {
    msgId = 0;
    // 存储消息的map
    msgMap = {};
    constructor() {
        // 模拟接收native发过来的消息
        window.onload = ()=>{
            /**
             * @param {{nativeEvent:{data:string}}} evt
             */
            document.addEventListener('message',evt=>{
                console.log("onMessage",evt);
                /**
                 * @type {CrossEvent}
                 */
                let crossEvent = JSON.parse(evt.data);
                if (crossEvent.type === CrossEventType.PROVIDER){
                    this.callback(crossEvent);
                }
            })
        }
    }
    /**
     * @param {number} type
     * @param {any} data
     * @param {Object} callback
     */
    newEvent(type,data,callback){
        let mId = this.msgId;
        this.msgMap[mId] = callback;
        this.msgId++;
        return new CrossEvent(type,mId,data);
    }

    /**
     * @param {CrossEvent} evt
     */
    callback(evt){
        if (evt.type === CrossEventType.PROVIDER){
            let callback = this.msgMap[evt.id];
            if (callback){
                // 成功的话会有值
                callback.resolve = evt.data.resolve;
                // 失败的话会有值
                callback.reason = evt.data.reason;
                // 结束等待
                callback.end = true;
                this.delEvent(evt.id);
            }
        }
    }

    /**
     * 删除事件
     * @param id
     */
    delEvent(id){
        delete this.msgMap[id];
    }
}
