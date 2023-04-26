import { titleMockData, navigationMockData, socials } from '../mock-data/common-mock-data.js';
import { renderTimer } from '../features/timer.js';
import { renderClock } from '../features/clock.js';

export function renderHeader(page) {
  const currentPageLink = page.split('/').slice(-1)[0];
  const header = createDomElement('header', 'header');
  const headerPageLogo = createDomElement('div', 'header__page-logo');
  addTextNode(headerPageLogo, titleMockData);
  const headerNavigation = createDomElement('ul', 'header__navigation');
  navigationMockData.forEach(element => {
    const headerNavigationLink = createDomElement('li', 'header__navigation-link');
    const headerNavigationHref = createDomElement('a');
    headerNavigationHref.href = element.href;
    if (currentPageLink === element.href) {
      headerNavigationHref.classList.add('header__navigation-current-href');
    } else {
      headerNavigationHref.classList.add('header__navigation-href');
    }
    addTextNode(headerNavigationHref, element.textContent);

    headerNavigationLink.append(headerNavigationHref);
    headerNavigation.append(headerNavigationLink);
  });
  renderTimer(headerNavigation);
  
  header.append(headerPageLogo, headerNavigation);
    
  return header;
}

export function renderFooter() {
  const footer = createDomElement('footer', 'footer', 'footer--border-top');
  const wrapper = createDomElement('div', 'wrapper');
  const footerContent = createDomElement('div', 'footer__content');
  const footerSocials = createDomElement('div', 'footer__socials');
  socials.forEach(social => {
    const contactUsIcon = createDomElement('img', 'footer__icon');
    contactUsIcon.setAttribute('src', social.imgSrc);
    contactUsIcon.setAttribute('alt', social.alt);

    footerSocials.append(contactUsIcon);
  });
  const footerPageLogo = createDomElement('div', 'footer__page-logo');
  addTextNode(footerPageLogo, titleMockData);
  const footerCopyright = createDomElement('div', 'footer__copyright');
  renderClock(footerCopyright);

  footerContent.append(footerSocials, footerPageLogo, footerCopyright);
  wrapper.append(footerContent);
  footer.append(wrapper);

  return footer;
}

export function createDomElement(tag, ...elClassList) {
  const domElement = document.createElement(tag);
  domElement.classList.add(...elClassList);
  return domElement;
}

export function addTextNode(element, text) {
  const textNode = document.createTextNode(text);
  return element.appendChild(textNode);
}
