export function renderClock(clockDiv) {
  const hoursSpan = document.createElement('span');
  const minutesSpan = document.createElement('span');
  const secondsSpan = document.createElement('span');
  const daysSpan = document.createElement('span');
  const refreshTime = 1000;

  clockDiv.append(hoursSpan, minutesSpan, secondsSpan, daysSpan);

  setInterval(() => countTime(hoursSpan, minutesSpan, secondsSpan, daysSpan), refreshTime);
}

function countTime(hours, minutes, seconds, days) {
  const twoDigit = 2;
  const noonTime = 12;

  let date = new Date();
  let hh = date.toLocaleString('en-US', { hour: '2-digit', hour12: false });
  let mm = date.toLocaleString('en-US', { minute: '2-digit' });
  let ss = date.toLocaleString('en-US', { second: '2-digit' });
  let noon = hh > noonTime ? 'PM' : 'AM';
  let hrs = hh > noonTime ? hh - noonTime : hh;
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let currentDate = new Intl.DateTimeFormat('en-US', options).format(date);

  if (hours.textContent !== `${hrs.toString().padStart(twoDigit, 0)}:`) {
    hours.textContent = `${hrs.toString().padStart(twoDigit, 0)}:`;
  }
  if (minutes.textContent !== `${mm.padStart(twoDigit, 0)}:`) {
    minutes.textContent = `${mm.padStart(twoDigit, 0)}:`;
  }
  if (seconds.textContent !== ss.padStart(twoDigit, 0)) {
    seconds.textContent = ss.padStart(twoDigit, 0);
  }
  if (days.textContent !== ` ${noon} ${currentDate}`) {
    days.textContent = ` ${noon} ${currentDate}`;
  }
}
