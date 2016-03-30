import jQuery from 'jquery';
import BubbleShoot from './BubbleShoot.js';

const Board = (function ($) {
    const NUM_ROWS = 9,
    //we only have 16 bubble per row, however we have to account for the offset
        NUM_COLS = 32;
    const Board = function () {
        const that = this;

        this.getBubbles = function () {
            let bubbles = [];
            const rows = this.getRows();
            rows.forEach(function (row, i) {
                row.forEach(function (bubble, j) {
                    if (bubble) {
                        bubbles.push(bubble);
                    }
                });
            });
            return bubbles;
        };

        const rows = createLayout();
        this.getRows = function () {
            return rows;
        };
        this.addBubble = function (bubble, coords) {
            let
                rowNum = Math.floor(coords.y / BubbleShoot.ui.ROW_HEIGHT),
                colNum = coords.x / BubbleShoot.ui.BUBBLE_DIMS * 2;

            if (rowNum % 2 === 1) {
                colNum -= 1;
            }
            colNum = Math.round(colNum / 2) * 2;
            if (rowNum % 2 === 0) {
                colNum -= 1;
            }
            if (!rows[rowNum]) {
                rows[rowNum] = [];
            }
            rows[rowNum][colNum] = bubble;
            bubble.setRow(rowNum);
            bubble.setCol(colNum);

        };
        this.getBubbleAt = function (rowNum, colNum) {
            if (!this.getRows()[rowNum]) {
                return null;
            }
            return this.getRows()[rowNum][colNum];
        };
        this.getBubbleAtArround = function (curRow, curCol) {
            let bubbles = [],
                rowNum,
                colNum;

            for (rowNum = curRow - 1; rowNum <= curRow + 1; rowNum += 1) {
                for (colNum = curCol - 2; colNum <= curCol + 2; colNum += 1) {
                    const bubbleAt = that.getBubbleAt(rowNum, colNum);
                    if (bubbleAt && !(colNum === curCol && rowNum === curRow)) {
                        bubbles.push(bubbleAt);
                    }
                }
            }
            return bubbles;
        };
        this.getGroup = function (bubble, found, differentColor) {
            let curRow = bubble.getRow();
            if (!found[curRow]) {
                found[curRow] = {};
            }
            if (!found.list) {
                found.list = [];
            }
            if (found[curRow][bubble.getCol()]) {
                return found;
            }
            found[curRow][bubble.getCol()] = bubble;
            found.list.push(bubble);
            const
                curCol = bubble.getCol(),
                surrounding = that.getBubbleAtArround(curRow, curCol);

            surrounding.forEach(function (bubbleAt) {
                if (bubbleAt.getType() === bubble.getType() || differentColor) {
                    found = that.getGroup(bubbleAt, found, differentColor);
                }
            });
            return found;
        };

        this.popBubblesAt = function (rowNum, colNum) {
            const row = rows[rowNum];
            delete row[colNum];
        };

        this.findOrphans = function () {
            let
                connected = [],
                groups = [],
                rows = that.getRows(),
                orphaned = [],
                i,
                e,
                j;

            rows.forEach(function (row, i) {
                connected[i] = [];
            });
            for (i = 0; i < rows[0].length; i += 1) {
                const bubble = that.getBubbleAt(0, i);
                if (bubble && !connected[0][i]) {
                    const group = that.getGroup(bubble, {}, true);
                    $.each(group.list, function () {
                        const bubble = this;
                        connected[bubble.getRow()][bubble.getCol()] = true;
                    })
                }
            }
            for (e = 0; e < rows.length; e += 1) {
                for (j = 0; j < rows[e].length; j += 1) {
                    const bubble = that.getBubbleAt(e, j);
                    if (bubble && !connected[e][j]) {
                        orphaned.push(bubble)
                    }
                }
            }

            return orphaned;
        };

        this.isEmpty = function () {
          return this.getBubbles().length === 0;
        };

        return this;
    };

    const createLayout = function () {
        let rows = [],
            i;

        for (i = 0; i < NUM_ROWS; i += 1) {
            let row = [],
            //offset bubbles on each row
                startCol = i % 2 === 0 ? 1 : 0,
                j;
            //j is incremented by 2 to account for the offset
            for (j = startCol; j < NUM_COLS; j += 2) {
                const bubble = BubbleShoot.Bubble.createBubble(i, j);
                bubble.setState(BubbleShoot.BubbleState.ON_BOARD);
                if (BubbleShoot.Renderer) {
                    const
                        left = j * BubbleShoot.ui.BUBBLE_DIMS / 2,
                        top = i * BubbleShoot.ui.ROW_HEIGHT;
                    bubble.getSprite().setPosition({
                        left: left,
                        top: top
                    });
                }
                row[j] = bubble;
            }
            rows.push(row);
        }
        return rows;
    };
    return Board;
})(jQuery);

export default Board;