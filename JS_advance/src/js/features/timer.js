let timer = 0;

export function renderTimer(headerNav) {
  const timerLi = document.createElement('li');
  timerLi.classList.add('header__navigation-timer');
  timerLi.textContent = '00:00:00';
  headerNav.append(timerLi);
  const refreshTime = 1000;

  let timerFunc = setInterval(() => countTimer(timerLi), refreshTime);

  timerLi.addEventListener('mouseover', function() {
    clearInterval(timerFunc);
  });

  timerLi.addEventListener('mouseout', function() {
    timerFunc = setInterval(() => countTimer(timerLi), refreshTime);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      timerLi.textContent = '00:00:00';
      timer = 0;
    }
  });
}

function countTimer(timerLi) {
  const hour = 3600;
  const minute = 60;
  const doubleDigit = 10;

  timer++;
  let hours = Math.floor(timer / hour);
  let minutes = timer / minute < minute ? Math.floor(timer / minute) : Math.floor(timer / minute) % minute;
  let seconds = timer < minute ? timer : timer % minute;

  timerLi.textContent = (hours < doubleDigit ? '0' + hours + ':' : hours + ':')
    + (minutes < doubleDigit ? '0' + minutes + ':' : minutes + ':')
    + (seconds < doubleDigit ? '0' + seconds : seconds);
}
