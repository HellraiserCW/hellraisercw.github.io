const delayToRollback = 500;

export function handlePromisePage() {
  const bar = document.querySelector('.promises__bar');
  const buttonsDiv = document.querySelector('.promises__buttons');
  const articlesArray = document.getElementsByClassName('promises__article');
  
  onLoadChangeProgressBar();
  
  buttonsDiv.addEventListener('click', e => handleClick(e));
  
  function onLoadChangeProgressBar() {
    window.addEventListener('load', () => {
      disableButtons();
      bar.classList.add('promises__bar--empty-bar');
      bar.addEventListener('transitionend', () => {
        bar.classList.remove('promises__bar--empty-bar');
        enableButtons();
      }, { once: true });
    }, { once: true });
  }

  function handleClick(e) {
    if (e.target.classList.contains('button')) {
      emptyProgressbar(e);
    }
  }

  function emptyProgressbar(e) {
    disableButtons();
    bar.classList.add('promises__bar--empty-bar');
    if (e.target.textContent === 'One') {
      bar.addEventListener('transitionend', () => hideCardsInOrder(), { once: true });
    } else {
      bar.addEventListener('transitionend', () => hideCardsTogether(), { once: true });
    }
  }

  function hideCardsInOrder(index = 0) {
    if (index < articlesArray.length) {
      hideCardContent(articlesArray[index]).then(() => hideCardsInOrder(index + 1));
    } else {
      setTimeout(() => showCards(), delayToRollback);
    }
  }

  function hideCardsTogether() {
    [...articlesArray].forEach((item, index) => {
      hideCardContent(item).then(() => {
        if (index === articlesArray.length - 1) {
          setTimeout(() => showCards(), delayToRollback);
        }
      });
    });
  }

  function hideElement(element) {
    return new Promise((res) => {
      element.classList.add('hide');
      element.addEventListener('transitionend', () => res(), { once: true });
    });
  }

  function hideCardContent(card) {
    const img = card.querySelector('.promises__image');
    const header = card.querySelector('.promises__header');
    const text = card.querySelector('.promises__text');
    const dataDiv = card.querySelector('.promises__data');
    
    return hideElement(img)
      .then(() => hideElement(header))
      .then(() => hideElement(text))
      .then(() => hideElement(dataDiv))
      .then(() => hideElement(card));
  }

  function showCards() {
    document.querySelectorAll('.hide').forEach(item => {
      item.classList.remove('hide');
    });
    fillProgressbar();
  }

  function fillProgressbar() {
    bar.classList.remove('promises__bar--empty-bar');
    bar.style.transition = '1s';
    bar.addEventListener('transitionend', () => enableButtons(), { once: true });
  }

  function disableButtons() {
    document.querySelectorAll('.promises__button').forEach(item => {
      item.disabled = true;
    });
  }

  function enableButtons() {
    document.querySelectorAll('.promises__button').forEach(item => {
      item.disabled = false;
    });
  }
}
