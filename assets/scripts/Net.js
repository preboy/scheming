let socket;
let cb_msg;     // 消息回调函数
let cb_evt;     // socket事件函数


// ----------------------------------------------------------------------------
// exports

exports.connect = function () {
    if (socket) {
        console.error('网络连接');
        return;
    }

    let ws = new WebSocket('ws://localhost:31001');

    ws.onopen = function (event) {
        console.log("网络连接建立成功");
        if (cb_evt) {
            cb_evt('open');
        }
    };

    ws.onmessage = function (event) {
        let msg;
        try {
            msg = JSON.parse(event.data);
        } catch (e) {
            console.error("解析消息失败: " + event.data);
        }

        if (cb_msg) {
            cb_msg(msg);
        }
    };

    ws.onerror = function (event) {
        console.error("网络连接错误: ", event);
    };

    ws.onclose = function (event) {
        if (cb_evt) {
            cb_evt('close');
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
    cb_msg = fn_msg;
    cb_evt = fn_evt;
}
