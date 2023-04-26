import { renderHeader, renderFooter, createDomElement, addTextNode } from './common.js';
import { articles } from '../mock-data/promise-mock-data.js';
import { handlePromisePage } from '../features/progressBar.js';

function renderMain(json) {
  const main = createDomElement('main', 'promises');
  const progressBar = createDomElement('div', 'promises__progress-bar');
  const bar = createDomElement('div', 'promises__bar');
  const buttonsDiv = createDomElement('div', 'promises__buttons');
  const oneButton = createDomElement('button', 'promises__button', 'button', 'button--secondary');
  addTextNode(oneButton, 'One');
  const allButton = createDomElement('button', 'promises__button', 'button', 'button--primary');
  addTextNode(allButton, 'All');
  const articlesDiv = createDomElement('div', 'promises__articles');
  json.forEach(item => {
    const article = createDomElement('article', 'promises__article');
    const img = createDomElement('img', 'promises__image');
    img.setAttribute('src', item.imgSrc);
    img.setAttribute('alt', 'preview');
    const data = createDomElement('div', 'promises__data');
    const header = createDomElement('h4', 'promises__header');
    addTextNode(header, item.header);
    const text = createDomElement('p', 'promises__text');
    addTextNode(text, item.text);
    
    data.append(header, text);
    article.append(img, data);
    articlesDiv.append(article);
  });

  progressBar.append(bar);
  buttonsDiv.append(oneButton, allButton);
  main.append(progressBar, buttonsDiv, articlesDiv);

  return main;
}


function renderPromisesPage() {
  const wrapper = createDomElement('div', 'wrapper');
  const main = renderMain(articles);
  const header = renderHeader(window.location.pathname);
  const footer = renderFooter();

  wrapper.append(header, main);
  document.body.append(wrapper, footer);
  
  handlePromisePage();
}

renderPromisesPage();
