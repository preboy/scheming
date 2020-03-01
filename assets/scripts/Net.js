let socket;
let fn_msgcb;     // 消息回调函数
let fn_evtcb;     // socket事件函数





// ----------------------------------------------------------------------------
// exports

exports.connect = function () {
    if (socket) {
        console.error('网络连接');
        return;
    }

    let ws = new WebSocket('ws://118.24.48.149:31001');

    ws.onopen = function (event) {
        console.log("网络连接建立成功");
        if (fn_evtcb) {
            fn_evtcb('open');
        }
    };

    ws.onmessage = function (event) {
        let msg;
        try {
            msg = JSON.parse(event.data);
        } catch (e) {
            console.error("解析消息失败: " + event.data);
        }

        if (fn_msgcb) {
            fn_msgcb(msg);
        }
    };

    ws.onerror = function (event) {
        console.error("网络连接错误: ", event);
    };

    ws.onclose = function (event) {
        if (fn_evtcb) {
            fn_evtcb('close');
        }

        socket = null;
        console.log("网络连接已经断开");
    };

    socket = ws;
}

exports.disconnect = function () {
    socket.close();
}

exports.send = function (msg) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
    } else {
        console.error("网络连接未连接!!!");
    }
}

exports.register = function (fn_msg, fn_evt) {
    fn_msgcb = fn_msg;
    fn_evtcb = fn_evt;
}
