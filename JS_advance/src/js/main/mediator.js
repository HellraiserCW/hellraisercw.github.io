import { requestTopRatedFilmsByYear } from '../features/fetchMovies.js';
import { ComponentTop, ComponentAside, Mediator } from '../features/mediatorPattern.js';
import { renderHeader, renderFooter, createDomElement, addTextNode } from './common.js';

const topPanelClass = '.mediator__top-panel';
const asidePanelClass = '.mediator__aside-panel';

async function renderMediatorPage() {
  const wrapper = createDomElement('div', 'wrapper');
  const header = renderHeader(window.location.pathname);
  const footer = renderFooter();
  const searchForm = renderSearchBlock();
  wrapper.append(header, searchForm);  
  document.body.append(wrapper, footer);

  document.querySelector('.posts__search-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const searchYear = document.querySelector('.posts__input').value;
    handleSearchRequest(searchYear);
  });
}

function renderSearchBlock() {
  const startYear = 1874;
  const postsSearchText = createDomElement('p', 'mediator__search-text');
  addTextNode(
    postsSearchText,
    `Search Top 3 Directors by the number of released films per year. 
    Available range: 1874 - ${new Date().getFullYear()} years`
  );
  const postsSearchForm = createDomElement('form', 'posts__search-form');
  const postsSearchInput = createDomElement('input', 'posts__input', 'input-search');
  postsSearchInput.setAttribute('type', 'number');
  postsSearchInput.setAttribute('placeholder', 'Year');
  postsSearchInput.setAttribute('name', 'year');
  postsSearchInput.setAttribute('min', startYear);
  postsSearchInput.setAttribute('max', new Date().getFullYear());
  const postsSearchButton = createDomElement('button', 'posts__button', 'button-search');
  postsSearchButton.setAttribute('type', 'submit');
  const postsSearchButtonImg = createDomElement('img', 'posts__button-icon', 'button-search-icon');
  postsSearchButtonImg.setAttribute('src', './assets/a-icon-search-2.svg');
  postsSearchButtonImg.setAttribute('alt', 'preview');

  postsSearchButton.append(postsSearchButtonImg);
  postsSearchForm.append(postsSearchText, postsSearchInput, postsSearchButton);

  return postsSearchForm;
}

async function handleSearchRequest(searchYear) {
  showLoading();
  const fetchedResult = await requestTopRatedFilmsByYear(searchYear);
  hideLoading();
  renderFetchedResult(fetchedResult);
}

function showLoading() {
  if (document.querySelector('.mediator')) {
    document.querySelector('.mediator').remove();
  }
  
  const loadingDiv = createDomElement('div', 'loading');
  addTextNode(loadingDiv, 'Loading...');
  document.body.insertBefore(loadingDiv, document.querySelector('.footer'));

  document.querySelector('.posts__input').disabled = true;
  document.querySelector('.posts__button').disabled = true;
}

function hideLoading() {
  document.querySelector('.loading').remove();
  document.querySelector('.posts__input').disabled = false;
  document.querySelector('.posts__button').disabled = false;
}

function renderFetchedResult(result) {
  if (!result) {
    const noData = createDomElement('div', 'loading');
    addTextNode(noData, 'Error occured! No data to show!');
    document.body.insertBefore(noData, document.querySelector('.footer'));

    return;
  }

  const directorsList = getTopThreeDirectorsByFilmCount(result);
  const content = renderMediatorContent(directorsList);
  document.body.insertBefore(content, document.querySelector('.footer'));

  const c1 = new ComponentTop(topPanelClass);
  const c2 = new ComponentAside(asidePanelClass);
  // eslint-disable-next-line no-unused-vars
  const mediator = new Mediator(c1, c2);

  document.querySelector('.mediator').addEventListener('click', (e) => {
    if (e.target.closest(topPanelClass)) {
      c1.changeDropdownState(e.target, directorsList);
    }

    if (e.target.closest(asidePanelClass)) {
      c2.changeDropdownState(e.target, directorsList);
    }
  });
}

function getTopThreeDirectorsByFilmCount(data) {
  if (!data) {
    return;
  }

  const arrOfDirectors = [];
  data.forEach(item => {
    const filterDir = item.credits.crew.filter(entry => {
      return entry.job === 'Director';
    });
    arrOfDirectors.push(filterDir);
  });

  const mapOfDirectors = arrOfDirectors.flat().reduce((acc, e) => acc.set(e.id, (acc.get(e.id) || 0) + 1), new Map());
  const sortedMapOfDirectors = new Map([...mapOfDirectors.entries()].sort((a, b) => b[1] - a[1]));
  const topThreeDirectors = [...sortedMapOfDirectors.keys()].slice(0, 3);
  const fullDataTopThreeDirectors = [];

  topThreeDirectors.forEach(director => {
    const fullDataForOne = [];
    data.forEach(item => {
      const isFilmByDirector = item.credits.crew.filter(entry => {
        return entry.id === director && entry.job === 'Director';
      });
      if (isFilmByDirector.length) {
        if (isFilmByDirector[0].name !== fullDataForOne[0]) {
          fullDataForOne.push(isFilmByDirector[0].name);
        }
        fullDataForOne.push(item);
      }
    });
    fullDataTopThreeDirectors.push(fullDataForOne);
  });

  return fullDataTopThreeDirectors;
}

function renderMediatorContent(directorsList) {
  const content = createDomElement('main', 'mediator');
  const mainSection = createDomElement('section', 'mediator__main-section');
  const topPanel = createDomElement('section', 'mediator__top-panel');
  const asidePanel = createDomElement('aside', 'mediator__aside-panel');
  directorsList.forEach(director => {
    const dropdown = createDomElement('nav', 'mediator__dropdown');
    const dropdownHeader = createDomElement('label', 'mediator__dropdown-header', 'button', 'button--secondary');
    addTextNode(dropdownHeader, director[0]);
    const dropdownContent = createDomElement('ul', 'mediator__dropdown-content');
    director.forEach(film => {
      if (film !== director[0]) {
        const dropdownItem = createDomElement('li', 'mediator__dropdown-item', 'button', 'button--primary');
        addTextNode(dropdownItem, film.title);
        dropdownContent.append(dropdownItem);
      }
    });
    dropdown.append(dropdownHeader, dropdownContent);
    topPanel.append(dropdown);
    asidePanel.append(dropdown.cloneNode(true));
  });

  const centralSection = createDomElement('div', 'mediator__central-section');
  const imageInfoBlock = createDomElement('div', 'mediator__film-image');
  const centralImage = createDomElement('img', 'mediator__central-image');
  centralImage.setAttribute('src', './assets/img_post_2.webp');
  centralImage.setAttribute('alt', 'preview');
  const filmInfoBlock = createDomElement('div', 'mediator__central-info');
  const filmName = createDomElement('h4', 'mediator__film-name');
  addTextNode(filmName, 'Film name');
  const filmRating = createDomElement('p', 'mediator__film-rating');
  addTextNode(filmRating, 'Film rating');
  const filmDescription = createDomElement('p', 'mediator__film-description');
  addTextNode(filmDescription, 'Film description');

  imageInfoBlock.append(centralImage);
  filmInfoBlock.append(filmName, filmRating, filmDescription);
  centralSection.append(imageInfoBlock, filmInfoBlock);
  mainSection.append(topPanel, centralSection);
  content.append(mainSection, asidePanel);

  return content;
}

renderMediatorPage();
