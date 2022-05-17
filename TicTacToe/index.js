window.addEventListener('DOMContentLoaded', () => {
    const boxes = 9;
    const zero = 0;
    const one = 1;
    const two = 2;
    const three = 3;
    const four = 4;
    const five = 5;
    const six = 6;
    const seven = 7;
    const eight = 8;
    const qtyWinCond = 7;
    const container = document.querySelector('.container');
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');
    const wonPlayerX = 'PLAYERX_WON';
    const wonPlayerO = 'PLAYERO_WON';
    const tie = 'TIE';
    const winningConditions = [
        [zero, one, two],
        [zero, three, six],
        [zero, four, eight],
        [one, four, seven],
        [two, four, six],
        [two, five, eight],
        [three, four, five],
        [six, seven, eight]
    ];
    let desk = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;

    function drawGrid() {
        for (let i = 0; i < boxes; i++) {
            let grid = document.createElement('div');
            grid.className = 'tile';
            container.appendChild(grid);
        }
    }

    drawGrid();

    const tiles = Array.from(document.querySelectorAll('.tile'));
    
    let dragAndDrop = () => {
        let card = document.querySelectorAll('.avatar-icon');
        let cells = document.querySelectorAll('.avatar-container');
        for (let i = 0; i < card.length; i++) {
            let dragStart = function () {
                setTimeout(() => {
                    this.classList.add('hide');
                }, 0);
                this.classList.add('selected');
            }
            let dragEnd = function () {
                this.classList.remove('hide');
                this.classList.remove('selected');
            }
            card[i].addEventListener('dragstart', dragStart);
            card[i].addEventListener('dragend', dragEnd);
        }
        cells.forEach((cell) => {
            cell.addEventListener('dragover', (event) => {
                 event.preventDefault();
            });
            cell.addEventListener('dragenter', (event) => {
                 event.preventDefault();
            });
            cell.addEventListener('drop', () => {
                let drag = document.querySelector('.selected');
                if (cell.children.length) {
                return;
            }
            cell.appendChild(drag);
            });
        });
    }

    dragAndDrop();

    function checkForWin() {
        let roundWon = false;
        for (let i = 0; i <= qtyWinCond; i++) {
            const winCondition = winningConditions[i];
            const a = desk[winCondition[zero]];
            const b = desk[winCondition[one]];
            const c = desk[winCondition[two]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
                announce(currentPlayer === 'X' ? wonPlayerX : wonPlayerO);
                isGameActive = false;
                return;
            }

        if (!desk.includes('')) {
            announce(tie);
        }
    }

    const announce = (type) => {
        if (type === wonPlayerX) {
            announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
        } else if (type === wonPlayerO) {
            announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
        } else {
            announcer.innerText = 'Tie';
        }
        announcer.classList.remove('hide');
    };

    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O'){
            return false;
        }
        return true;
    };

    const updateDesk = (index) => {
        desk[index] = currentPlayer;
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    let start = document.querySelector('.container').firstChild;
    start.focus();

    function active(sibling) {
        if (sibling !== null) {
            start.focus();
            start.classList.remove('active');
            sibling.focus();
            sibling.classList.add('active');
            start = sibling;
        }
    }

    let currCell = 0;

    let keyDown = (e) => {
        e = e || window.event;
        if (e.key === 'ArrowLeft') {
            if (currCell > zero) {
                currCell -= 1;
            }
            let sibling = start.previousElementSibling;
            start.classList.add('active');
            active(sibling);
        } else if (e.key === 'ArrowRight') {
            if (currCell < eight) {
                currCell += 1;
            }
            let sibling = start.nextElementSibling;
            start.classList.add('active');
            active(sibling);
        } else if (e.key === 'Enter') {
            let active = document.querySelector('.active');
            userAction(active, currCell);
        }
    }

    window.addEventListener('keydown', keyDown);

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateDesk(index);
            checkForWin();
            changePlayer();
        }
    }

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', () => {
        document.location.reload();
    });
});