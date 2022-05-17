let play=confirm('Do you want to play a game?');
const PRIZE_MULTIPLYER=2;
const BORDER_INCREASE=4;
const ATTEMPTS=3;
const DIVIDER=2;
const TRIES=2;
if(!play) {
    alert('You did not become a billionaire, but can.');
} else {
    while (play) {
        let playAgain=true;
        let totalWonPrize=0;
        let currentPrize=100;
        let topBorder=8;
        while (playAgain) {
            let notGuessed=false;
            let rand=Math.floor(Math.random()*(topBorder + 1));
            for (let i=0; i<ATTEMPTS; i++) {
                let currentWonPrize=currentPrize/Math.pow(DIVIDER,i);
                let userChoise=Number(prompt(`Choose a roulette pocket number from 0 to ${topBorder}
                Attempts left: ${ATTEMPTS-i}
                Total prize: ${totalWonPrize}$
                Possible prize on current attempt: ${currentWonPrize}$`, ''));
                if (isNaN(userChoise)||!Number.isInteger(userChoise)||userChoise<0||userChoise>topBorder) {
                    alert(`Choose an integer number in range from 0 to ${topBorder}`)
                    i-=1;
                } else if (userChoise===rand) {
                    totalWonPrize+=currentWonPrize;
                    break;
                } else {
                    if (i===TRIES) {
                        notGuessed=true;
                        break;
                    }
                }
            }
            if (notGuessed) {
                break;
            }
            playAgain=confirm(`Congratulation, you won! Your prize is: ${totalWonPrize}$. Do you want to continue?`);
            if (playAgain) {
                currentPrize*=PRIZE_MULTIPLYER;
                topBorder+=BORDER_INCREASE;
            } else {
                break;
            }
        }
        alert(`Thank you for your participation. Your prize is: ${totalWonPrize}$`);
        play=confirm('Do you want to play again?');
    }
}