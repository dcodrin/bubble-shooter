import jQuery from 'jquery';
import BubbleShoot from './BubbleShoot.js';

const Sprite = (function ($) {
    const Sprite = function () {
        const that = this;
        let left,
            top;

        this.position = function () {
            return {
                left: left,
                top: top
            }
        };

        this.setPosition = function (args) {
            if (arguments.length > 1) {
                return;
            }
            if (args.left !== null) {
                left = args.left;
            }
            if (args.top !== null) {
                top = args.top;
            }
        };
        this.css = this.setPosition;

        this.animate = function (destination, config) {
            console.log("this was called");
            let
                duration = config.duration,
                animationStart = Date.now(),
                startPosition = that.position();
            that.updateFrame = function () {
                let elapsed = Date.now() - animationStart,
                    proportion = elapsed / duration;
                if (proportion > 1) {
                    proportion = 1
                }
                let posLeft = startPosition.left + (destination.left - startPosition.left) * proportion,
                    posTop = startPosition.top + (destination.top - startPosition.top) * proportion;
                that.css({
                    left: posLeft,
                    top: posTop
                });
            };
            setTimeout(function () {
                that.updateFrame = null;
                if (config.complete) {
                    config.complete();
                }
            }, duration);
        };
        return this;
    };

    Sprite.prototype.width = function () {
        return BubbleShoot.ui.BUBBLE_DIMS;
    };
    Sprite.prototype.height = function () {
        return BubbleShoot.ui.BUBBLE_DIMS;
    };
    Sprite.prototype.removeClass = function () {

    };
    Sprite.prototype.addClass = function () {

    };
    Sprite.prototype.remove = function () {

    };
    Sprite.prototype.kaboom = function () {
        jQuery.fn.kaboom.apply(this);
    };
    return Sprite;
})(jQuery);

export default Sprite;