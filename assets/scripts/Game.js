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

        this.data = Array(17);
        this.members = Array(17);

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
            this.on_join(msg.data);
        } else if (msg.op == 'leave') {
            this.showTip('leave ok');
        } else if (msg.op == 'look') {
            this.data[this.my_pos].cards = msg.cards;
            this.draw_seat(this.my_pos);
            // this.showTip('look ok');
        } else if (msg.op == 'attack') {
            // this.showTip('attack ok');
        } else if (msg.op == 'quit') {
            // this.showTip('quit ok');
        } else if (msg.op == 'waiver') {
            // this.showTip('waiver ok');
        } else if (msg.op == 'value') {
            this.showTip('value ok');
        } else if (msg.op == 'add_coin') {
            this.showTip('add_coin ok');
        }
        // 广播类消息(通知)
        else if (msg.op == 'join_n') {
            if (msg.data.pid != ModelPlayer.pid) {
                this.data[msg.pos] = msg.data;
                this.draw_seat(msg.pos);
                this.showTip(`${msg.data.name}加入了桌子`);
            }
        } else if (msg.op == 'leave_n') {

        } else if (msg.op == 'look_n') {
            this.data[msg.pos].look = true;
            this.draw_seat(msg.pos);
        } else if (msg.op == 'attack_n') {
            if (msg.win) {
                this.data[msg.pos] = msg.data_win;
                this.data[msg.target] = msg.data_lost;
                this.draw_seat(msg.pos);
                this.draw_seat(msg.target);
            } else {
                this.data[msg.pos] = msg.data_lost;
                this.data[msg.target] = msg.data_win;
                this.draw_seat(msg.pos);
                this.draw_seat(msg.target);
            }
        } else if (msg.op == 'value_n') {
            this.data[msg.pos].value = msg.value;
            this.data[msg.pos].balance = msg.balance;
            this.draw_seat(msg.pos);
        } else if (msg.op == 'deal_n') {
            for (let i = 0; i < 17; i++) {
                this.data[i] = msg.info.seats[i];
                this.draw_seat(i);
            }
        } else if (msg.op == 'turn_n') {
            this.showTip(`该 ${msg.turn} 出手了`);
        } else if (msg.op == 'bout_result_n') {
            for (let i = 0; i < 17; i++) {
                this.data[i].cards = msg.cards[i];
                this.draw_seat(i);
            }
        }
        // 其他消息
        else if (msg.op == 'property') {
            if (msg.coin) {
                let diff = msg.coin - ModelPlayer.coin;
                this.showTip(`钻石变化量: ${diff}`);
                ModelPlayer.coin = msg.coin;
                this.coin.string = msg.coin;
            }
        } else if (msg.op = 'notify') {
            this.showTip(msg.str);
        } else {
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
            op: 'quit',
        });
    },

    btn_waiver() {
        net.send({
            op: 'waiver',
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

        // 找到自己
        for (let i = 0; i < 17; i++) {
            if (data.seats[i].pid == ModelPlayer.pid) {
                this.my_pos = data.seats[i].pos;
                ModelPlayer.pos = this.my_pos;
                break;
            }
        }

        for (let i = 0; i < 17; i++) {
            this.data[i] = data.seats[i];
            this.draw_seat(i);
        }
    },

    draw_seat(idx) {
        let s = this.members[idx].getComponent('Seat');
        s.draw(this.data[idx]);
    },

    draw_seats() {
        for (let i = 0; i < 17; i++) {
            this.draw_seat(i);
        }
    },

});
