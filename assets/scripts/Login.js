let net = require('Net');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        edt_acct: cc.EditBox,
        edt_pass: cc.EditBox,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        net.register(function (msg) {
            this.on_msg(msg);
        }.bind(this), function (flag) {
            this.on_evt(flag);
        }.bind(this));

        net.connect();
    },

    // update(dt) {},

    // ------------------------------------------------------------------------
    // local

    btn_enter_game() {

        let acct = this.edt_acct.string.trim();
        let pass = this.edt_pass.string;

        if (acct == '') {
            return;
        }

        console.log("btn_enter_game:", acct, pass);

        net.send({
            op: 'login',
            acct: acct,
            pass: pass,
        });
    },

    on_evt(flag) {
        if (flag == 'open') {
            console.log('连接服务器OK')
        }
    },

    on_msg(msg) {
        if (msg.op == 'login') {
            if (msg.ret == 0) {
                cc.director.loadScene('game');
            } else {
                console.log('login failed:', msg.msg);
            }
        }
    },

});
