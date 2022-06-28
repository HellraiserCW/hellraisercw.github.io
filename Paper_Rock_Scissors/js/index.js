const playGame = () => {
    const wonscore = 3;
    const stuff = ['Rock', 'Paper', 'Scissors'];
    const renderResult = document.querySelector('.result-board');
    const buttons = document.querySelectorAll('.button');
    let rounds = 0;
    let playerScore = 0;
    let computerScore = 0;

    const generator = el => {
        rounds++;
        const playerHand = el.target.innerText;
        const computerHand = stuff[Math.floor(Math.random() * stuff.length)];
        renderRoundResult(playerHand, computerHand);
    };
    
    buttons.forEach(currentBtn => currentBtn.addEventListener('click', generator));

    const renderRoundResult = (player, comp) => {
        let roundResult = document.createElement('p');
        const won = `Round ${rounds}, ${player} vs. ${comp}, You've WON!`;
        const lost = `Round ${rounds}, ${player} vs. ${comp}, You've LOST!`;
        const draw = `Round ${rounds}, ${player} vs. ${comp}, DRAW!`;
    
        if (player === comp) {
            roundResult.innerText = draw;
        } else if (player === 'Rock') {
            if (comp === 'Paper') {
                computerScore++;
                roundResult.innerText = lost;
            } else {
                playerScore++;
                roundResult.innerText = won;
            }
        } else if (player === 'Paper') {
            if (comp === 'Scissors') {
                computerScore++;
                roundResult.innerText = lost;
            } else {
                playerScore++;
                roundResult.innerText = won;
            }
        } else if (player === 'Scissors') {
            if (comp === 'Rock') {
                computerScore++;
                roundResult.innerText = lost;
            } else {
                playerScore++;
                roundResult.innerText = won;
            }
        }
    
        renderResult.prepend(roundResult);
        
        if (playerScore >= wonscore || computerScore >= wonscore) {
            buttons.forEach(currentBtn => {
                currentBtn.removeEventListener('click', generator);
                currentBtn.disabled = true;
            });
            
            const final = document.createElement('h2');
            if (playerScore > computerScore) {
                final.innerText = `${playerScore} : ${computerScore}, You've WON!`;
                final.classList.add('won');
            } else {
                final.innerText = `${playerScore} : ${computerScore}, You've LOSE!`;
                final.classList.add('lose');
            }
    
            renderResult.prepend(final);
        }
    }
}

const game = () => {
    document.querySelector('.reset').addEventListener('click', () => {
        window.location.reload();
    });
}

game();
playGame();