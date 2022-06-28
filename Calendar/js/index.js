const date = new Date();

const renderMonth = () => {
    date.setDate(1);
    const weekDays = [
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun'
    ];
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    const getMon = date.getMonth();
    const getYear = date.getFullYear();
    const currMonthDays = document.querySelector('.days');
    const currWeek = document.querySelector('.weekdays');
    const lastMonthDay = new Date(getYear, getMon + 1, 0).getDate();
    const prevDays = new Date(getYear, getMon, 0).getDate();
    const weekIndex = 8;
    const nextDays = weekIndex - new Date(getYear, getMon + 1, 0).getDay() - 1;
    const calLength = 35;
    let days = '';
    let weekDay = '';
    let startDay = date.getDay() - 1;

    weekDays.forEach(e => {
        weekDay += `<div>${e}</div>`;
    });
    currWeek.innerHTML = weekDay;
    
    document.querySelector('.current').innerHTML = months[getMon] + ' ' + getYear;

    if(startDay < 0) {
        startDay += weekIndex - 1;
    }

    for(let j = startDay; j > 0; j--) {
        days += `<div class="prev-date">${prevDays - j + 1}</div>`;
    }

    for(let i = 1; i <= lastMonthDay; i++) {
        if(i === new Date().getDate() && getMon === new Date().getMonth() && getYear === new Date().getFullYear()) {
            days += `<div class="today">${i}</div>`;
        } else {
            days += `<div>${i}</div>`;
        }
    }
    
    for(let k = 1; k <= nextDays; k++) {
        days += `<div class="next-date">${k}</div>`;
    }
    currMonthDays.innerHTML = days;
    
    if(currMonthDays.children.length === calLength) {
        for(let l = nextDays + 1; l < nextDays + weekIndex; l++) {
            days += `<div class="next-date">${l}</div>`;
        }
        currMonthDays.innerHTML = days;
    }
}

document.querySelector('.prev').addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderMonth();
});

document.querySelector('.next').addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderMonth();
});

renderMonth();