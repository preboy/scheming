// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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

        point: cc.Label,
        bigBg: cc.Node,
        smlBg: cc.Node,

        // 顺序：梅花、红桃、黑桃、方块

        // const CARD_TYPE_CLUB = 1;
        // const CARD_TYPE_HEARTS = 2;
        // const CARD_TYPE_SPADES = 3;
        // const CARD_TYPE_DIAMONDS = 4;

        bigBgs: [cc.SpriteFrame],
        smlBgs: [cc.SpriteFrame],

        rear: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.set_card = false;
    },

    // update (dt) {},

    set_card_point(point, type) {
        this.set_card = true;

        if (point == 1) {
            this.point.string = 'A';
        } else if (point = 11) {
            this.point.string = 'J';
        } else if (point = 12) {
            this.point.string = 'Q';
        } else if (point = 13) {
            this.point.string = 'K';
        } else {
            this.point.string = point.toString();
        }

        this.bigBg.setSprintFrame(this.bigBgs[type - 1]);
        this.smlBg.setSprintFrame(this.smlBgs[type - 1]);
    },

    exhibit(b) {
        if (b) {
            this.rear.active = false;
        } else {
            this.rear.active = true;
        }
    },
});
