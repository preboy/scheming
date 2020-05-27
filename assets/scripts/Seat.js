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

        card_root: cc.Node,
        card_prefab: cc.Prefab,

        nickname: cc.Label,
        wager: cc.Label,
        desc: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cards = [
            cc.instantiate(this.card_prefab),
            cc.instantiate(this.card_prefab),
            cc.instantiate(this.card_prefab),
        ];

        this.card_root.addChild(this.cards[0], 0, '0');
        this.card_root.addChild(this.cards[1], 1, '1');
        this.card_root.addChild(this.cards[2], 2, '2');

        this.cards[0].setPosition(-20, 0);
        this.cards[1].setPosition(0, 0);
        this.cards[2].setPosition(20, 0);

        this.show = false;
        this.data = {};

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (ModelPlayer.pos == this.pos) {
                return;
            }

            net.send({
                op: 'attack',
                target: this.pos,
            });
        }, this);
    },

    start() {
    },

    // ------------------------------------------------------------------------

    init(pos) {
        this.pos = pos;
    },

    set_cards(arr) {
        this.cards[0].getComponent('Card').set_card_point(arr[0].type, arr[0].point);
        this.cards[1].getComponent('Card').set_card_point(arr[1].type, arr[1].point);
        this.cards[2].getComponent('Card').set_card_point(arr[2].type, arr[2].point);
    },

    exhibit(flag) {
        this.cards[0].getComponent('Card').exhibit(flag);
        this.cards[1].getComponent('Card').exhibit(flag);
        this.cards[2].getComponent('Card').exhibit(flag);
    },

    set_desc(str) {
        this.desc.string = str;
    },

    draw(data) {
        /*
          let obj = {
            pos: this.pos,
            pid: this.pid,
            robot: this.robot,
            look: this.look,
            quit: this.quit,
            value: this.value,
            balance: this.balance,
            winner: this.winner,
            cards:null,
            name : "",
        }
        */

        this.nickname.string = data.name;
        this.wager.string = `${data.value}倍: ${data.balance}`;

        if (data.cards) {
            this.set_cards(data.cards);
            this.exhibit(true);
        } else {
            this.exhibit(false);
        }

        let str = '';

        if (data.look) {
            str += ' 看';
        }

        if (data.quit) {
            str += ' 离';
        }

        if (data.winner != null) {
            str += ' 败';
        }

        if (str.length > 0 && str[0] == ' ') {
            str = str.substr(1);
        }

        this.set_desc(str);
    }

    // update (dt) {},
});
