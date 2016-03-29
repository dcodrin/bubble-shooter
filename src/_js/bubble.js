import jQuery from 'jquery';
import BubbleShoot from './BubbleShoot.js';


const Bubble = (function ($) {
    //Define the various states for the canvas
    BubbleShoot.BubbleState = {
        CURRENT: 1,
        ON_BOARD: 2,
        FIRING: 3,
        POPPING: 4,
        FALLING: 5,
        POPPED: 6,
        FIRED: 7,
        FALLEN: 8
    };

    //Create the Bubble constructor which returns a sprite
    const Bubble = function (row, col, type, sprite) {

        const that = this;
        //CANVAS CODE
        let state,
            stateStart = Date.now();

        this.getState = function () {
            return state;
        };

        this.setState = function (stateIn) {
            state = stateIn;
            stateStart = Date.now();
        };

        this.getTimeInState = function () {
          return Date.now() - stateStart;
        };



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
                left: that.getCol() * BubbleShoot.ui.BUBBLE_DIMS / 2 + BubbleShoot.ui.BUBBLE_DIMS / 2,
                top: that.getRow() * BubbleShoot.ui.ROW_HEIGHT + BubbleShoot.ui.BUBBLE_DIMS / 2
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
            this.getSprite().css(`transform`, `rotate(${Math.random() * 360}deg)`);
            setTimeout(function () {
                that.getSprite().css(`background-position`, `-50px -${top}px`);
            }, 125);
            setTimeout(function () {
                that.getSprite().css(`background-position`, `-100px -${top}px`);
            }, 150);
            setTimeout(function () {
                that.getSprite().css(`background-position`, `-150px -${top}px`);
            }, 175);
            setTimeout(function () {
                that.getSprite().remove();
            }, 200);
        }
    };
    Bubble.createBubble = function (rowNum, colNum, type) {

        let sprite;

        if (!type) {
            type = Math.floor(Math.random() * 4);
        }
        if(!BubbleShoot.Renderer){
            sprite = $(document.createElement('div'));
            sprite.addClass(`bubble bubble_${type}`);
        } else {
            sprite = new BubbleShoot.Sprite();
        }
        const bubble = new Bubble(rowNum, colNum, type, sprite);
        return bubble;
    };

    return Bubble;

})(jQuery);

export default Bubble;
