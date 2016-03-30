import jQuery from 'jquery';
import BubbleShoot from './BubbleShoot.js';

const Renderer = (function ($) {
    let canvas,
        context,
        spriteSheet;

    const BUBBLE_IMAGE_DIM = 50;

    const Renderer = {
        init: function (callback) {
            canvas = document.createElement('canvas');
            $(canvas).addClass('game_canvas');
            $('#game').prepend(canvas);
            $(canvas).attr('width', $(canvas).width());
            $(canvas).attr('height', $(canvas).height());
            context = canvas.getContext('2d');

            spriteSheet = new Image();
            spriteSheet.src = '_img/bubbles.png';
            spriteSheet.onLoad = function () {
                callback();
            };

            callback();
        },
        render: function (bubbles) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.translate(120, 0);
            $.each(bubbles, function () {
                const bubble = this;
                let clip = {
                    top: bubble.getType() * BUBBLE_IMAGE_DIM,
                    left: 0
                };
                switch (bubble.getState()) {
                    case BubbleShoot.BubbleState.POPPING:
                        const timeInState = bubble.getTimeInState();
                        if (timeInState < 80) {
                            clip.left = BUBBLE_IMAGE_DIM;
                        } else if (timeInState < 140) {
                            clip.left = BUBBLE_IMAGE_DIM * 2;
                        } else {
                            clip.left = BUBBLE_IMAGE_DIM * 3;
                        }
                        break;
                    case BubbleShoot.BubbleState.POPPED:
                        return;
                    case BubbleShoot.BubbleState.FIRED:
                        return;
                    case BubbleShoot.BubbleState.FALLING:
                        const timeInStateFall = bubble.getTimeInState();
                        if (timeInStateFall < 500) {
                            clip.left = 0;
                        } else if (timeInStateFall < 600) {
                            clip.left = BUBBLE_IMAGE_DIM;
                        } else if (timeInStateFall < 700) {
                            clip.left = BUBBLE_IMAGE_DIM * 2;
                        } else if (timeInStateFall < 800) {
                            clip.left = BUBBLE_IMAGE_DIM * 3;
                        } else {
                            return;
                        }
                        break;
                    case BubbleShoot.BubbleState.FALLEN:
                        return;
                }
                Renderer.drawSprite(bubble.getSprite(), clip);
            });
            context.translate(-120, 0);
        },
        drawSprite: function (sprite, clip) {
            context.translate(sprite.position().left + sprite.width() / 2, sprite.position().top + sprite.height() / 2);
            context.drawImage(spriteSheet, clip.left, clip.top, BUBBLE_IMAGE_DIM, BUBBLE_IMAGE_DIM, -sprite.width() / 2, -sprite.height() / 2, BUBBLE_IMAGE_DIM, BUBBLE_IMAGE_DIM);
            context.translate(-sprite.position().left - sprite.width() / 2, -sprite.position().top - sprite.height() / 2);
        }
    };
    return Renderer;
})(jQuery);

export default Renderer;