

import BubbleShoot from './BubbleShoot.js';


import jQuery from 'jquery';
import ui from './ui.js';
import Bubble from './bubble.js';
import Board from './board.js';
import CollisionDetector from './collision-detector.js';
import Kaboom from './jquery.kaboom.js';
import Renderer from './renderer.js';
import Sprite from './sprite.js';
import Sounds from './sounds.js';


//BubbleShoot.ui is an IIFE that returns an object with multiple methods
BubbleShoot.ui = ui;
BubbleShoot.Board = Board;
BubbleShoot.Sounds = Sounds;

console.log(BubbleShoot.Sounds);
//BubbleShoot.Bubble returns a constructor Object
BubbleShoot.Bubble = Bubble;

//FOR CANVAS USAGE. COMMENT OUT TO RENDER WITH HTML
BubbleShoot.Renderer = Renderer;
BubbleShoot.Sprite = Sprite;


BubbleShoot.CollisionDetector = CollisionDetector;


//BubbleShoot.Game is an IIFE that returns a constructor Object.
BubbleShoot.Game = (function ($) {
    const Game = function () {

        let curBubble,
            board,
            numBubbles,
            coords,
            bubbles = [],
            requestAnimationID,
            level = 0,
            score = 0,
            highScore = 0;
        const
            MAX_BUBBLES = 80,
            POINTS_PER_BUBBLE = 50,
            MAX_ROWS = 11;

        //init is a public method
        this.init = function () {

            if (BubbleShoot.Renderer) {
                BubbleShoot.Renderer.init(function () {
                    $('.btn_start_game').bind('click', startGame);
                })
            } else {
                $('.btn_start_game').bind('click', startGame);
            }
            if (window.localStorage && localStorage.getItem('highScore')) {
                highScore = Number(localStorage.getItem('highScore'));
            }
            BubbleShoot.ui.drawHighScore(highScore);
        };
        //startGame is a private method that is available to us through the principle of 'closure'
        const startGame = function () {
            const $game = $('#game');
            BubbleShoot.Sounds.play('_sounds/start.ogg', Math.random() * 0.5 + 0.5);
            $('.btn_start_game').unbind('click');
            $game.append(`<div id="score"><p>${score}</p><span>Score</span></div>`);
            $game.append(`<div id="level"><p>${level}</p><span>Level</span></div>`);
            $game.append(`<div id="highScore"><p>${highScore}</p>High Score</div>`);

            if (level <= 5) {
                numBubbles = MAX_BUBBLES - level * 5;
            } else if (level > 5 && level <= 10) {
                numBubbles = MAX_BUBBLES - level * 3;
            } else if (level > 10 && level <= 15) {
                numBubbles = MAX_BUBBLES - level * 2;
            } else {
                numBubbles = 30;
            }
            BubbleShoot.ui.hideDialog();
            board = new BubbleShoot.Board();
            bubbles = board.getBubbles();
            if (BubbleShoot.Renderer) {
                if (!requestAnimationID) {
                    requestAnimationID = setTimeout(renderFrame);
                }
            } else {
                BubbleShoot.ui.drawBoard(board);
            }
            curBubble = getNextBubble(board);
            //clickGameScreen will determine the direction of the shooting bubble.
            $game.bind('click', clickGameScreen);
            BubbleShoot.ui.drawScore(score);
            BubbleShoot.ui.drawLevel(level);
        };

        const endGame = function (hasWon) {

            if (score > highScore) {
                highScore = score;
                $('#new_high_score').show();
                BubbleShoot.ui.drawHighScore(highScore);
                if (window.localStorage) {
                    localStorage.setItem('highScore', highScore);
                }
            } else {
                $('#new_high_score').hide();
            }

            if (hasWon) {
                level++;
            } else {
                level = 0;
                score = 0;
            }
            $('.btn_start_game').bind('click', startGame);
            $('#board .bubble').remove();
            $('#score').remove();
            $('#highScore').remove();
            $('#level').remove();
            BubbleShoot.ui.endGame(hasWon, score);

        };

        const getNextBubble = function () {
            //createBubble returns a new Bubble Object
            //the getSprite() method allows us to reference the DOM object
            const bubble = BubbleShoot.Bubble.createBubble();
            bubbles.push(bubble);
            bubble.setState(BubbleShoot.BubbleState.CURRENT);
            bubble.getSprite().addClass('cur_bubble');

            let
                top = 470,
                left = ($('#board').width() - BubbleShoot.ui.BUBBLE_DIMS) / 2;
            bubble.getSprite().css({
                top: top,
                left: left
            });

            $('#board').append(bubble.getSprite());
            BubbleShoot.ui.drawBubblesRemaining(numBubbles);
            numBubbles -= 1;
            return bubble;
        };

        const clickGameScreen = function (e) {


            let duration = 1000;

            const angle = BubbleShoot.ui.getBubbleAngle(curBubble.getSprite(), e),
                distance = 1500,
                collision = BubbleShoot.CollisionDetector.findIntersection(curBubble, board, angle);

            if (collision) {
                coords = collision.coords;
                duration = Math.round(duration * collision.distToCollision / distance);
                setTimeout(function () {
                    BubbleShoot.Sounds.play('_sounds/touch.wav', Math.random() * 0.5 + 0.5);
                }, duration);
                board.addBubble(curBubble, coords);
                const group = board.getGroup(curBubble, {});
                if (group.list.length >= 3) {
                    popBubbles(group.list, duration);
                    const topRow = board.getRows()[0];
                    let topRowBubbles = [];
                    topRow.forEach(function (bubble) {
                        if (bubble) {
                            topRowBubbles.push(bubble);
                        }
                    });
                    if (topRowBubbles.length <= 5) {
                        popBubbles(topRowBubbles, duration);
                        group.list.concat(topRowBubbles);
                    }
                }
                if (group.list.length >= 3) {
                    popBubbles(group.list, duration);
                    const
                        orphans = board.findOrphans(),
                        delay = duration + 200 + 30 * group.list.length;
                    dropBubbles(orphans, delay);
                    if (group.list.length >= 6 && group.list.length < 8) {
                        setTimeout(function () {
                            BubbleShoot.Sounds.play('_sounds/holy_cow.mp3', Math.random() * 0.5 + 0.5);
                        }, delay)
                    }else if (group.list.length >= 8 && group.list.length < 10) {
                        setTimeout(function () {
                            BubbleShoot.Sounds.play('_sounds/holy_shit.mp3', Math.random() * 0.5 + 0.5);
                        }, delay)
                    } else if (group.list.length > 10) {
                        setTimeout(function () {
                            BubbleShoot.Sounds.play('_sounds/good.mp3', Math.random() * 0.5 + 0.5);
                        }, delay)
                    }
                    let popped = [].concat(group.list, orphans),
                        points = popped.length * POINTS_PER_BUBBLE;
                    score += points;

                    setTimeout(function () {
                        BubbleShoot.ui.drawScore(score);
                    }, delay);
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
            if (board.getRows().length > MAX_ROWS) {
                endGame(false);
            } else if (numBubbles === 0) {
                endGame(false);
            } else if (board.isEmpty()) {
                endGame(true);
            } else {
                curBubble = getNextBubble(board);
            }
        };
        const dropBubbles = function (bubbles, delay) {
            $.each(bubbles, function () {
                const bubble = this;
                board.popBubblesAt(bubble.getRow(), bubble.getCol());
                setTimeout(function () {
                    bubble.setState(BubbleShoot.BubbleState.FALLING);
                    bubble.getSprite().kaboom({
                        callback: function () {
                            bubble.getSprite().remove();
                            bubble.setState(BubbleShoot.BubbleState.FALLEN);
                        }
                    });
                    BubbleShoot.Sounds.play('_sounds/drop.wav', Math.random() * 0.3 + 0.5)
                }, delay);
                delay += 60;
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
                    bubble.setState(BubbleShoot.BubbleState.POPPING);
                    bubble.animatePop();
                    setTimeout(function () {
                        bubble.setState(BubbleShoot.BubbleState.POPPED);
                    }, 200);
                    BubbleShoot.Sounds.play('_sounds/pop.wav', Math.random() * 0.5 + 0.5)
                }, delay);
                board.popBubblesAt(bubble.getRow(), bubble.getCol());
                setTimeout(function () {
                    bubble.getSprite().remove();
                }, delay + 200);
                delay += 60;
            })
        };

        const renderFrame = function () {
            console.log("FRAME IS REFRESHING");
            $.each(bubbles, function () {
                if (this.getSprite().updateFrame) {
                    this.getSprite().updateFrame();
                }
            });
            BubbleShoot.Renderer.render(bubbles);
            requestAnimationID = setTimeout(renderFrame, 10);
        };
    };
    return Game;
})(jQuery);
//As soon as the DOM is ready initialize a new game
jQuery(function () {
    const game = new BubbleShoot.Game();
    game.init();
});