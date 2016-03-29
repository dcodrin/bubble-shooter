import jQuery from 'jquery';
import ui from './ui.js';
import Bubble from './bubble.js';
import Board from './board.js';
import CollisionDetector from './collision-detector.js';
import Kaboom from './jquery.kaboom.js';


//Create a namespace to protect the variables from naming collisions and to minimize global variables.
const BubbleShoot = window.BubbleShoot || {};

//BubbleShoot.ui is an IIFE that returns an object with multiple methods
BubbleShoot.ui = ui;
//BubbleShoot.Bubble returns a constructor Object
BubbleShoot.Bubble = Bubble;
BubbleShoot.Board = Board;
BubbleShoot.CollisionDetector = CollisionDetector;

//BubbleShoot.Game is an IIFE that returns a constructor Object.
BubbleShoot.Game = (function ($) {
    const Game = function () {

        let curBubble,
            board,
            numBubbles,
            coords;
        const MAX_BUBBLES = 50;

        //init is a public method
        this.init = function () {
            $('.btn_start_game').bind('click', startGame);
        };
        //startGame is a private method that is available to us through the principle of 'closure'
        const startGame = function () {
            $('.btn_start_game').unbind('click');
            numBubbles = MAX_BUBBLES;
            BubbleShoot.ui.hideDialog();
            curBubble = getNextBubble();

            board = new BubbleShoot.Board();
            BubbleShoot.ui.drawBoard(board);
            //clickGameScreen will determine the direction of the shooting bubble.
            $('#game').bind('click', clickGameScreen);
        };
        const getNextBubble = function () {
            //createBubble returns a new Bubble Object
            //the getSprite() method allows us to reference the DOM object
            const bubble = BubbleShoot.Bubble.createBubble();
            bubble.getSprite().addClass('cur_bubble');
            $('#board').append(bubble.getSprite());
            BubbleShoot.ui.drawBubblesRemaining(numBubbles);
            numBubbles -= 1;
            return bubble;
        };

        const clickGameScreen = function (e) {

            let duration = 1000;

            const angle = BubbleShoot.ui.getBubbleAngle(curBubble.getSprite(), e),
                distance = 1000,
                collision = BubbleShoot.CollisionDetector.findIntersection(curBubble, board, angle);

            if (collision) {
                coords = collision.coords;
                duration = Math.round(duration * collision.distToCollision / distance);
                board.addBubble(curBubble, coords);
                const group = board.getGroup(curBubble, {});
                if (group.list.length >= 3) {
                    popBubbles(group.list, duration);
                }
                if (group.list.length >= 3) {
                    popBubbles(group.list, duration);
                    const
                        orphans = board.findOrphans(),
                        delay = duration + 200 + 30 * group.list.length;
                    dropBubbles(orphans, delay);
                }
            } else {
                const distX = Math.sin(angle) * distance,
                    distY = Math.cos(angle) * distance,
                    bubbleCoords = BubbleShoot.ui.getBubbleCoords(curBubble.getSprite());
                coords = {
                    x: bubbleCoords.left + distX,
                    y: bubbleCoords.top - distY
                };
            }
            BubbleShoot.ui.fireBubble(curBubble, coords, duration);
            curBubble = getNextBubble();
        };
        const dropBubbles = function (bubbles, delay) {
          $.each(bubbles, function () {
              const bubble = this;
              board.popBubblesAt(bubble.getRow(), bubble.getCol());

              setTimeout(function () {
                  bubble.getSprite().kaboom();
              },delay);

              //Simple animation example
              //setTimeout(function () {
              //    bubble.getSprite().animate({
              //        top: 1000
              //    }, 1000);
              //}, delay)
          })
        };
        const popBubbles = function (bubbles, delay) {
            $.each(bubbles, function () {
                const bubble = this;
                setTimeout(function () {
                    bubble.animatePop();
                }, delay);
                board.popBubblesAt(this.getRow(), this.getCol());
                setTimeout(function () {
                    bubble.getSprite().remove();
                }, delay + 200);
                delay += 60;
            })
        }

    };
    return Game;
})(jQuery);
//As soon as the DOM is ready initialize a new game
jQuery(function () {
    const game = new BubbleShoot.Game();
    game.init();
});


export default BubbleShoot;