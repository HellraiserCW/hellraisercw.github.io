import { dictionary } from './dictionary.js';

let gameFin = 0;
console.log('game finished?='+gameFin);

let state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
};

function drawGrid(container) {
    console.log('function drawGrid');
    const grid = document.createElement('div');
    grid.className = 'grid';
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            drawBox(grid, i, j);
        }
    }
    container.appendChild(grid);
    console.log(grid);
}

function updateGrid() {
    console.log('function updateGrid');
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = '') {
    console.log('function drawBox');
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = letter;
    box.id = `box${row}${col}`;
    container.appendChild(box);
    return box;
}

function drawBar(container) {
    console.log('function drawBar');
    const navBar = document.createElement('div');
    navBar.className = 'nav_bar';
    container.appendChild(navBar);
    console.log(navBar);

    const resetBtn = document.createElement('button');
    resetBtn.className = 'resetBtn';
    resetBtn.innerText = 'Reset';
    navBar.appendChild(resetBtn);
    resetBtn.addEventListener('click', gameOver);

    const checkBtn = document.createElement('button');
    checkBtn.className = 'checkBtn';
    checkBtn.innerText = 'Check';
    navBar.appendChild(checkBtn);
    checkBtn.addEventListener('click', checkEvent);
}

function registerKeyboardEvents() {
    console.log('function registerKeyboardEvents');
    console.log('game finished?='+gameFin);
    document.body.onkeydown = function (e) {
        console.log('game finished?='+gameFin);
        const key = e.key;
        if(gameFin) {
            return;
        }
        if (key === 'Enter') {
            console.log('pressed Enter');
            checkEvent();
        }
        if (key === 'Backspace') {
            console.log('pressed Backspace');
            removeLetter();
        }
        if (isLetter(key)&&!gameFin) {
            console.log('pressed Letter');
            addLetter(key);
        }
        updateGrid();
    }
}

function checkEvent() {
    console.log('function checkEvent');
    if (state.currentCol === 5) {
        const word = getCurrentWord();
        if (isWordValid(word)) {
            revealWord(word);
            state.currentRow++;
            state.currentCol = 0;
        } else {
            alert('Not in word list');
        }
    }
}

function getCurrentWord() {
    console.log('function getCurrentWord');
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
    console.log('function isWordValid');
    return dictionary.includes(word);
}

function revealWord(guess) {
    console.log('function revealWord')
    const row = state.currentRow;
    console.log('row of the guess word='+row);

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;
        if (letter === state.secret[i]) {
            console.log('GUESS='+letter);
            box.classList.add('right');
        } else if (state.secret.includes(letter)) {
            console.log('WRONG PLACE='+letter);
            box.classList.add('wrong');
        } else {
            console.log('NO LETTER='+letter);
            box.classList.add('empty');
        }
    }

    const isWinner = state.secret === guess;
    console.log('word guessed!='+isWinner);
    const isGameOver = state.currentRow === 5;
    console.log('this was last row to try!='+isGameOver);

    if (isWinner) {
        gameFin = 1;
        console.log('game finished?='+gameFin);
        console.log('you win='+isWinner)
        alert('Congratulations! You won.');
        return;
    } else if (isGameOver) {
        gameFin = 1;
        console.log('game finished?='+gameFin);
        console.log('you lose='+isGameOver);
        alert('Game over.');
        return;
    }
}

function isLetter(key) {
    console.log('function isLetter');
    return key.length === 1 && key.match(/[А-ЩЬЮЯҐЄІЇа-щьюяґєії]/i);
}

function addLetter(letter) {
    console.log('function addLetter');
    if (state.currentCol === 5) return;
    console.log('current column '+state.currentCol);
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    console.log('function removeLetter');
    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}

function gameOver() {
    console.log('function gameOver');
    gameFin = 1;
    removeElements();
    startup();
}

function removeElements(){
    console.log('function removeElements');
    state = {
        secret: dictionary[Math.floor(Math.random() * dictionary.length)],
        grid: Array(6)
            .fill()
            .map(() => Array(5).fill('')),
        currentRow: 0,
        currentCol: 0,
    };
    let elements = document.querySelectorAll('div', 'button');
    for(let i = 0; i < elements.length; i++){
        elements[i].innerHTML = "";
    }
}

function startup() {
    console.log('function startup');
    gameFin = 0;
    console.log('START NEW ROUND, game finished?='+gameFin);
    const game = document.getElementById('game');
    console.log(game);
    drawGrid(game);
    drawBar(game);
    registerKeyboardEvents();
    console.log('NEW SECRET WORD='+state.secret);
}

startup();