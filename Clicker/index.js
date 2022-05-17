const nickName=document.getElementById('nickname').value;
let startGameBtn=document.getElementById('start');
let bigButton=document.getElementById('big-button');
let bestResult=document.getElementById('best-result');
let bestResultEver=document.getElementById('bestever-result');
let clearBest=document.getElementById('clear-best');
let clearBestEver=document.getElementById('clear-bestever');
let timer=false;
let clicks=0;
let playTime=5000;
let sessionClicks=sessionStorage.getItem('current')||0;
let localClicks=localStorage.getItem('top');
let bestNickname=localStorage.getItem('name');

startGameBtn.addEventListener('click', startGame);

function startGame() {
    const nickName=document.getElementById('nickname').value;
    try {
        if (nickName.trim().length===0) {
            throw 'Empty nickname';
        } else {
            startGameBtn.removeEventListener('click', startGame);
            timer=true;
            clicks=0;
            setTimeout(function () {
                sessionClicks=sessionStorage.getItem('current');
                localClicks=localStorage.getItem('top');
                bestNickname=localStorage.getItem('name');
                if (localClicks<clicks) {
                    sessionClicks=clicks;
                    localClicks=clicks;
                    bestNickname=nickName;
                    sessionStorage.setItem('current', sessionClicks);
                    localStorage.setItem('top', localClicks);
                    localStorage.setItem('name', bestNickname);
                } else if (sessionClicks<clicks) {
                    sessionClicks=clicks;
                    sessionStorage.setItem('current', sessionClicks);
                }
                alert(`You clicked ${clicks} times`);
                startGameBtn.addEventListener('click', startGame);
            }, playTime);
        }
    } catch (err) {
        alert(err);
    }
}

bigButton.addEventListener('click', function() {
	if(timer) {
        clicks++;
    }
});

bestResult.addEventListener('click', function() {
    alert(`Best result is: ${sessionClicks}`);
});

bestResultEver.addEventListener('click', function() {
    localClicks=localStorage.getItem('top');
    bestNickname=localStorage.getItem('name');
    alert(`Best result for the whole time is: ${localClicks} by ${bestNickname}`);
});

clearBest.addEventListener('click', function() {
    sessionClicks=0;
    sessionStorage.setItem('current', clicks);
    alert('Best result is cleared');
});

clearBestEver.addEventListener('click', function() {
    localClicks=0;
    localStorage.setItem('top', 0);
    bestNickname='';
    localStorage.setItem('name', null);
    alert('Best result for the whole time is cleared');
});