// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let net = require('Net');

let ModelPlayer = require('ModelPlayer');

cc.Class({
    extends: cc.Component,

    properties: {

        tip: cc.Label,

        root: cc.Node,
        seat: cc.Prefab,

        seat_root: cc.Node,

        nick_name: cc.Label,
        coin: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.members = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 6; j++) {
                let x = (j - 2) * 120;
                let y = (i - 1) * 140;
                let idx = i * 6 + j;

                this.members[idx] = cc.instantiate(this.seat);
                this.members[idx].getComponent('Seat').init(idx);
                this.members[idx].setPosition(x, y);
                this.members[idx].setScale(cc.v2(0.6, 0.6));
                this.seat_root.addChild(this.members[idx]);

                if (idx == 16) {
                    break;
                }
            }
        }

        net.register(function (msg) {
            this.on_msg(msg);
        }.bind(this), function (flag) {
            this.on_evt(flag);
        }.bind(this));

    },

    start() {
        this.cards = cc.instantiate(this.seat);
        this.cards.setPosition(0, 0);
        this.root.addChild(this.cards);

        this.nick_name.string = ModelPlayer.name;
        this.coin.string = ModelPlayer.coin;
    },

    // update (dt) {},

    on_msg(msg) {
        console.log("on_msg:", msg);

        if (msg.ret != undefined && msg.ret != 0) {
            this.showTip(`MSG ERR: op = ${msg.op}, msg = ${msg.msg}`);
            return;
        }

        if (msg.op == 'join') {
            // this.showTip('join ok');
            this.on_join(msg.data);
        } else if (msg.op == 'leave') {
            this.showTip('leave ok');
        } else if (msg.op == 'look') {
            this.showTip('look ok');
        } else if (msg.op == 'action') {
            this.showTip('action ok');
        } else if (msg.op == 'value') {
            this.showTip('value ok');
        } else if (msg.op == 'add_coin') {
            this.showTip('add_coin ok');
        }
        // 广播类消息(通知)
        else if (msg.op == 'join_n') {
            // this.showTip('abandon ok');
        } else if (msg.op == 'leave_n') {

        } else if (msg.op == 'look_n') {

        } else if (msg.op == 'action_n') {

        } else if (msg.op == 'value_n') {

        } else if (msg.op == 'deal_n') {
            this.draw_seats(msg.info);
        } else if (msg.op == 'turn_n') {
            this.showTip(`该 ${msg.turn} 出手了`);
        }
        // 其他消息
        else if (msg.op == 'property') {
            if (msg.coin) {
                let diff = msg.coin - ModelPlayer.coin;
                this.showTip(`钻石变化量: ${diff}`);
                ModelPlayer.coin = msg.coin;
                this.coin.string = msg.coin;
            }
        }
        else {
            console.log(`未处理的消息: op = ${msg.op}`, msg);
        }
    },

    on_evt(flag) {
        console.log('on_evt: flag = %d', flag);
    },

    showTip(txt) {
        this.tip.string = txt;
    },

    btn_join() {
        net.send({
            op: 'join',
        });
    },

    btn_add_coin() {
        net.send({
            op: 'add_coin',
            amount: 1000,
        });
    },

    btn_look() {
        net.send({
            op: 'look',
        });
    },

    btn_value() {
        net.send({
            op: 'value',
        });
    },

    btn_quit() {
        net.send({
            op: 'action',
            subop: 'quit',
        });
    },

    btn_waiver() {
        net.send({
            op: 'action',
            subop: 'waiver',
        });
    },

    // ------------------------------------------------------------------------
    on_join(data) {
        /*
        let info = {
            host: this.host,
            seats: Array(MAX_SEATS_CNT),
            balance: this.bout_total_balance,
        };

        let obj = {
            pos: this.pos,
            pid: this.pid,
            robot: this.robot,
            look: this.look,
            quit: this.quit,
            value: this.value,
            balance: this.balance,
            winner: this.winner,
            name : "",
        }
        */
        this.draw_seats(data);
    },

    draw_seats(data) {
        for (let i = 0; i < 17; i++) {
            let s = this.members[i].getComponent('Seat');
            s.set_data(data.seats[i]);
            s.draw();
        }
    },

});
