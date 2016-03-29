import jQuery from 'jquery';
import BubbleShoot from './game.js';


const Bubble = (function ($) {
    //Create the Bubble constructor which returns a sprite
    const Bubble = function (row, col, type, sprite) {

        const that = this;

        this.getSprite = function () {
            return sprite;
        };
        this.getType = function () {
            return type;
        };
        this.getCol = function () {
            return col;
        };
        this.getRow = function () {
            return row;
        };
        this.getCoords = function () {
            const coords = {
                left: that.getCol() * BubbleShoot.ui.BUBBLE_DIMS/2 + BubbleShoot.ui.BUBBLE_DIMS/2,
                top: that.getRow() * BubbleShoot.ui.ROW_HEIGHT + BubbleShoot.ui.BUBBLE_DIMS/2
            };
            return coords;
        };
        this.setCol = function (colIn) {
            col = colIn;
        };
        this.setRow = function (rowIn) {
            row = rowIn;
        };
        this.animatePop = function () {
            const top = type * that.getSprite().height();
            this.getSprite().css(`transform`, `rotate(${Math.random()*360}deg)`);
            setTimeout(function () {
                that.getSprite().css(`background-position`, `-50px -${top}px`);
            },125);
            setTimeout(function () {
                that.getSprite().css(`background-position`, `-100px -${top}px`);
            },150);
            setTimeout(function () {
                that.getSprite().css(`background-position`, `-150px -${top}px`);
            },175);
            setTimeout(function () {
                that.getSprite().remove();
            },200);
        }
    };
    Bubble.createBubble = function (rowNum, colNum, type) {

        if (type === undefined) {
            type = Math.floor(Math.random() * 4);
        }


        const sprite = $(document.createElement('div'));
        sprite.addClass(`bubble bubble_${type}`);
        const bubble = new Bubble(rowNum, colNum, type, sprite);
        return bubble;
    };

    return Bubble;

})(jQuery);

export default Bubble;
