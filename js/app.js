import { dictionary } from './dictionary.js';
let gameFin = 0;
const rows = 6;
const cols = 5;
let checkBtn;
let resetBtn;
let state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(rows)
        .fill()
        .map(() => Array(cols).fill('')),
    currentRow: 0,
    currentCol: 0
}

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            drawBox(grid, i, j);
        }
    }
    container.appendChild(grid);
}

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = letter;
    box.id = `box${row}${col}`;
    container.appendChild(box);
}

function drawBar(container) {
    const navBar = document.createElement('div');
    navBar.className = 'nav_bar';
    container.appendChild(navBar);
    resetBtn = document.createElement('button');
    resetBtn.className = 'resetBtn';
    resetBtn.innerText = 'Reset';
    navBar.appendChild(resetBtn);
    resetBtn.addEventListener('click', gameOver);
    checkBtn = document.createElement('button');
    checkBtn.className = 'checkBtn';
    checkBtn.innerText = 'Check';
    navBar.appendChild(checkBtn);
    checkBtn.disabled = true;
    checkBtn.addEventListener('click', checkEvent);
}

function registerInputData() {
    if(gameFin) {
        return;
    }
    document.body.onkeydown = function (e) {
        const key = e.key;
        if (key === 'Enter') {
            checkEvent();
        }
        if (key === 'Backspace') {
            removeLetter();
        }
        if (isLetter(key)&&!gameFin) {
            addLetter(key);
        }
        updateGrid();
    }
}

function checkEvent() {
    checkBtn.disabled = true;
    if (state.currentCol === cols) {
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
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
    return dictionary.includes(word);
}

function revealWord(guess) {
    const row = state.currentRow;
    for (let i = 0; i < cols; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;
        if (letter === state.secret[i]) {
            box.classList.add('right');
        } else if (state.secret.includes(letter)) {
            box.classList.add('wrong');
        } else {
            box.classList.add('empty');
        }
    }
    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === cols;
    if (isWinner) {
        gameFin = 1;
        alert('Congratulations! You won.');
        return;
    } else if (isGameOver) {
        gameFin = 1;
        alert('Game over.');
        return;
    }
}

function isLetter(key) {
    return key.length === 1 && key.match(/[А-ЩЬЮЯҐЄІЇа-щьюяґєії]/i);
}

function addLetter(letter) {
    if (state.currentCol === cols-1) {
        checkBtn.disabled = false;
    }
    if (state.currentCol === cols) {
        return;
    }
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if (state.currentCol === 0) {
        return;
    }
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
    checkBtn.disabled = true;
}

function gameOver() {
    gameFin = 1;
    removeElements();
    startup();
}

function removeElements(){
    state = {
        secret: dictionary[Math.floor(Math.random() * dictionary.length)],
        grid: Array(rows)
            .fill()
            .map(() => Array(cols).fill('')),
        currentRow: 0,
        currentCol: 0
    };
    let elements = document.querySelectorAll('div', 'button');
    for(let i = 0; i < elements.length; i++){
        elements[i].innerHTML = '';
    }
}

function startup() {
    gameFin = 0;
    const game = document.getElementById('game');
    drawGrid(game);
    drawBar(game);
    registerInputData();
    console.log(state.secret);
}

startup();