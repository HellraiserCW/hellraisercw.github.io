import { socials } from '../mock-data/common-mock-data.js';
import { indexMockData } from '../mock-data/index-mock-data.js';
import { renderHeader, renderFooter, createDomElement, addTextNode } from './common.js';
import { initMap } from '../features/googleMap.js';
import { PortfolioSlider, TestimonialsSlider } from '../features/slider.js';
import { registerJQueryModalPlugin } from '../features/jquery-modal.js';

const postsPerSection = 3;
const even = 2;
registerJQueryModalPlugin($);

function renderSectionHeading(json) {
  const section = createDomElement('section', 'section__heading', 'heading');
  const headingCaption = createDomElement('h2', 'heading__caption');
  addTextNode(headingCaption, json.heading.caption);
  const headingText = createDomElement('p', 'heading__text');
  addTextNode(headingText, json.heading.text);
  const headingButtonContainer = createDomElement('div', 'heading__button-container');
  const buttonPrimary = createDomElement('button', 'heading__button', 'button', 'button--primary');
  addTextNode(buttonPrimary, json.heading.buttonPrimary);
  const buttonSecondary = createDomElement('button', 'heading__button', 'button', 'button--secondary');
  addTextNode(buttonSecondary, json.heading.buttonSecondary);

  headingButtonContainer.append(buttonPrimary, buttonSecondary);
  section.append(headingCaption, headingText, headingButtonContainer);

  return section;
}

function renderSectionAboutUs(json) {
  const section = createDomElement('section', 'section__about-us', 'about-us');
  section.id = 'about-us';
  const aboutUsTitle = createDomElement('div', 'about-us__title');
  const aboutUsCaption = createDomElement('h2', 'about-us__caption');
  addTextNode(aboutUsCaption, json.aboutUs.caption);
  const aboutUsText = createDomElement('p', 'about-us__text');
  addTextNode(aboutUsText, json.aboutUs.text);
  const aboutUsMain = createDomElement('div', 'about-us__main');
  const aboutUsFolders = createDomElement('div', 'about-us__folders');
  json.aboutUs.folders.slice(0, postsPerSection).forEach((item, index) => {
    const aboutUsTypography = createDomElement('div', `about-us__${item.type}`);
    const aboutUsTypographyImg = createDomElement('img', `about-us__${item.type}-img`);
    aboutUsTypographyImg.setAttribute('src', item.imgSrc);
    aboutUsTypographyImg.setAttribute('alt', 'preview');
    const aboutUsImgText = createDomElement('p', 'about-us__img-text');
    index % even && aboutUsImgText.classList.add('about-us--text-reverse');
    addTextNode(aboutUsImgText, item.text);
    const aboutUsTypographySquare = createDomElement('div', 'about-us__square');

    aboutUsTypography.append(aboutUsTypographyImg, aboutUsImgText, aboutUsTypographySquare);
    aboutUsFolders.append(aboutUsTypography);
  });
  const aboutUsPreview = createDomElement('div', 'about-us__preview');
  const aboutUsPreviewImg = createDomElement('img', 'about-us__img');
  aboutUsPreviewImg.setAttribute('src', json.aboutUs.preview.imgSrc);
  aboutUsPreviewImg.setAttribute('alt', 'preview');

  aboutUsTitle.append(aboutUsCaption, aboutUsText);
  aboutUsPreview.append(aboutUsPreviewImg);
  aboutUsMain.append(aboutUsFolders, aboutUsPreview);
  section.append(aboutUsTitle, aboutUsMain);

  return section;
}

function renderSectionLatestPosts(json) {
  const section = createDomElement('section', 'section__latest-posts', 'latest-posts');
  const latestPostsTitle = createDomElement('div', 'latest-posts__title');
  const latestPostsCaption = createDomElement('h2', 'latest-posts__caption');
  addTextNode(latestPostsCaption, json.latestPosts.caption);
  const latestPostsText = createDomElement('p', 'latest-posts__text');
  addTextNode(latestPostsText, json.latestPosts.text);
  const latestPostsMain = createDomElement('div', 'latest-posts__main');
  json.latestPosts.main.slice(0, postsPerSection).forEach(item => {
    const latestPostsPost = createDomElement('div', 'latest-posts__post');
    const latestPostsPostImg = createDomElement('img', 'latest-posts__postimg');
    latestPostsPostImg.setAttribute('src', item.imgSrc);
    latestPostsPostImg.setAttribute('alt', 'preview');
    const latestPostsPostHeader = createDomElement('h3', 'latest-posts__postheader');
    addTextNode(latestPostsPostHeader, item.header);
    const latestPostsPostText = createDomElement('p', 'latest-posts__posttext');
    addTextNode(latestPostsPostText, item.text);
    const latestPostsStats = createDomElement('div', 'latest-posts__stats');
    const latestPostsPublished = createDomElement('span', 'latest-posts__published');
    addTextNode(latestPostsPublished, item.stats.published);
    const latestPostsReadtime = createDomElement('div', 'latest-posts__readtime');
    addTextNode(latestPostsReadtime, item.stats.readtime);
    const latestPostsIcon = createDomElement('img', 'latest-posts__icon');
    latestPostsIcon.setAttribute('src', item.stats.iconSrc);
    latestPostsIcon.setAttribute('alt', 'preview');
    const latestPostsComments = createDomElement('div', 'latest-posts__comments');
    addTextNode(latestPostsComments, item.stats.comments);

    latestPostsStats.append(
      latestPostsPublished,
      latestPostsPublished,
      latestPostsReadtime,
      latestPostsIcon,
      latestPostsComments
    );
    latestPostsPost.append(latestPostsPostImg, latestPostsPostHeader, latestPostsPostText, latestPostsStats);
    latestPostsMain.append(latestPostsPost);
  });

  latestPostsTitle.append(latestPostsCaption, latestPostsText);
  section.append(latestPostsTitle, latestPostsMain);

  return section;
}

function renderSectionPortfolio(json) {
  const section = createDomElement('section', 'section__portfolio', 'portfolio');
  section.id = 'portfolio';
  const portfolioTitle = createDomElement('div', 'portfolio__title');
  const portfolioCaption = createDomElement('h2', 'portfolio__caption');
  addTextNode(portfolioCaption, json.portfolio.caption);
  const portfolioText = createDomElement('p', 'portfolio__text');
  addTextNode(portfolioText, json.portfolio.text);
  const portfolioSlider = createDomElement('div', 'portfolio__slider');
  json.portfolio.main.forEach(item => {
    const portfolioSlide = createDomElement('div', 'portfolio__slide');
    const portfolioSlideImg = createDomElement('img', 'portfolio__slide-image');
    portfolioSlideImg.setAttribute('src', item.imgSrc);
    portfolioSlideImg.setAttribute('alt', 'preview');
    const portfolioSlideData = createDomElement('div', 'portfolio__slide-data');
    const portfolioSlideHeader = createDomElement('h3', 'portfolio__slide-header');
    addTextNode(portfolioSlideHeader, item.header);
    const portfolioSlideText = createDomElement('p', 'portfolio__slide-text');
    addTextNode(portfolioSlideText, item.text);

    portfolioSlideData.append(portfolioSlideHeader, portfolioSlideText);
    portfolioSlide.append(portfolioSlideImg, portfolioSlideData);
    portfolioSlider.append(portfolioSlide);
  });
  const portfolioButtons = createDomElement('div', 'portfolio__buttons');
  const portfolioSideButtons = createDomElement('div', 'portfolio__sidebuttons');
  const sideButtonLeft = createDomElement('button', 'side--button', 'button--left');
  sideButtonLeft.setAttribute('aria-label', 'left');
  const sideButtonRight = createDomElement('button', 'side--button', 'button--right');
  sideButtonRight.setAttribute('aria-label', 'right');
  const buttonSecondary = createDomElement('button', 'button', 'button--secondary');
  addTextNode(buttonSecondary, json.portfolio.buttonSecondary);

  portfolioSideButtons.append(sideButtonLeft, sideButtonRight);
  portfolioButtons.append(portfolioSideButtons, buttonSecondary);
  portfolioTitle.append(portfolioCaption, portfolioText);
  section.append(portfolioTitle, portfolioSlider, portfolioButtons);

  return section;
}

function renderSectionTestimonials(json) {
  const section = createDomElement(
    'section',
    'section__testimonials',
    'testimonials',
    'section__testimonials--background'
  );
  const testimonialsBackground = createDomElement('div', 'testimonials__background');
  const testimonialsTitle = createDomElement('div', 'testimonials__title', 'testimonials--margin');
  const testimonialsCaption = createDomElement('h2', 'testimonials__caption');
  addTextNode(testimonialsCaption, json.testimonials.caption);
  const testimonialsMain = createDomElement('div', 'testimonials__main');
  const testimonialsSlider = createDomElement('div', 'testimonials__slider');
  json.portfolio.main.forEach(item => {
    const testimonialsSlide = createDomElement('div', 'testimonials__slide');
    const testimonialsSlideImg = createDomElement('img', 'testimonials__slide-image');
    testimonialsSlideImg.setAttribute('src', item.imgSrc);
    testimonialsSlideImg.setAttribute('alt', 'preview');

    testimonialsSlide.append(testimonialsSlideImg);
    testimonialsSlider.append(testimonialsSlide);
  });
  const testimonialsSideButtons = createDomElement('div', 'testimonials__sidebuttons');
  const sideButtonLeft = createDomElement('button', 'side--button', 'button--left');
  sideButtonLeft.setAttribute('aria-label', 'left');
  const sideButtonRight = createDomElement('button', 'side--button', 'button--right');
  sideButtonRight.setAttribute('aria-label', 'right');

  testimonialsSideButtons.append(sideButtonLeft, sideButtonRight);
  testimonialsTitle.append(testimonialsCaption);
  testimonialsMain.append(testimonialsSlider);
  section.append(testimonialsBackground, testimonialsTitle, testimonialsMain, testimonialsSideButtons);

  return section;
}

function renderSectionContactUs(json) {
  const section = createDomElement('section', 'section__contact-us', 'contact-us');
  const contactUsBackground = createDomElement('div', 'contact-us__background');
  const wrapper = createDomElement('div', 'wrapper');
  section.id = 'contact';
  const contactUsTitle = createDomElement('div', 'contact-us__title');
  const contactUsCaption = createDomElement('h2', 'contact-us__caption');
  addTextNode(contactUsCaption, json.contactUs.caption);
  const contactUsText = createDomElement('p', 'contact-us__text');
  addTextNode(contactUsText, json.contactUs.text);
  const contactUsContact = createDomElement('div', 'contact-us__contact');
  const contactUsLeft = createDomElement('div', 'contact-us__left');
  const contactUsSocials = createDomElement('div', 'contact-us__socials');
  socials.forEach(social => {
    const contactUsIcon = createDomElement('img', 'contact-us__icon');
    contactUsIcon.setAttribute('src', social.imgSrc);
    contactUsIcon.setAttribute('alt', social.alt);

    contactUsSocials.append(contactUsIcon);
  });
  const contactUsWhat = createDomElement('div', 'contact-us__what');
  const contactUsHeader = createDomElement('h3', 'contact-us__header');
  addTextNode(contactUsHeader, json.contactUs.contact.header);
  const contactUsList = createDomElement('ol', 'contact-us__list');
  json.contactUs.contact.items.forEach((item, index) => {
    const contactUsListItem = createDomElement('li', 'contact-us__list-item');
    const contactUsListCaption = createDomElement('h4', 'contact-us__list-caption');
    const contactUsListNumber = createDomElement('span', 'contact-us__list-number');
    addTextNode(contactUsListNumber, `${index + 1}. `);
    const contactUsListText = createDomElement('p', 'contact-us__list-text');
    addTextNode(contactUsListText, item.text);

    contactUsListCaption.append(contactUsListNumber, item.caption);
    contactUsListItem.append(contactUsListCaption, contactUsListText);
    contactUsList.append(contactUsListItem);
  });
  const contactUsRight = createDomElement('div', 'contact-us__right');
  const contactUsRightTop = createDomElement('div', 'contact-us__right-top');
  const contactUsMailIcon = createDomElement('img', 'contact-us__mail-icon');
  contactUsMailIcon.setAttribute('src', json.contactUs.mailIcon.imgSrc);
  contactUsMailIcon.setAttribute('alt', 'preview');
  const contactUsMailText = createDomElement('p', 'contact-us__mail-text');
  addTextNode(contactUsMailText, json.contactUs.mailText);
  const contactUsRightMain = createDomElement('div', 'contact-us__right-main');
  const contactUsForm = createDomElement('div', 'contact-us__form');
  const contactUsFormData = createDomElement('form', 'contact-us__form-data');
  const contactUsFormLabelName = createDomElement('label', 'contact-us__form-label');
  contactUsFormLabelName.setAttribute('for', 'name');
  addTextNode(contactUsFormLabelName, json.contactUs.form.name);
  const contactUsFormInputName = createDomElement('input', 'contact-us__form-input');
  contactUsFormInputName.setAttribute('type', 'text');
  contactUsFormInputName.setAttribute('name', 'name');
  contactUsFormInputName.id = 'name';
  const contactUsFormLabelEmail = createDomElement('label', 'contact-us__form-label');
  contactUsFormLabelEmail.setAttribute('for', 'email');
  addTextNode(contactUsFormLabelEmail, json.contactUs.form.email);
  const contactUsFormInputEmail = createDomElement('input', 'contact-us__form-input');
  contactUsFormInputEmail.setAttribute('type', 'email');
  contactUsFormInputEmail.setAttribute('name', 'email');
  contactUsFormInputEmail.id = 'email';
  const contactUsFormPwd = createDomElement('div', 'contact-us__form-pwd');
  const contactUsFormLabelPwd = createDomElement('label', 'contact-us__form-label');
  contactUsFormLabelPwd.setAttribute('for', 'password');
  addTextNode(contactUsFormLabelPwd, json.contactUs.form.password);
  const contactUsTogglePwd = createDomElement('span', 'contact-us__toggle-pwd');
  const contactUsTogglePwdImg = createDomElement('img', 'contact-us__toggle-pwd-show-pass');
  contactUsTogglePwdImg.setAttribute('src', json.contactUs.form.togglePwd.imgSrc);
  contactUsTogglePwdImg.setAttribute('alt', 'preview');
  const contactUsFormInputPwd = createDomElement('input', 'contact-us__form-input');
  contactUsFormInputPwd.setAttribute('type', 'password');
  contactUsFormInputPwd.setAttribute('name', 'password');
  contactUsFormInputPwd.id = 'password';
  const contactUsFormButton = createDomElement('button', 'button', 'button--primary');
  addTextNode(contactUsFormButton, json.contactUs.form.button);
  const contactUsDna = createDomElement('p', 'contact-us__dna');
  addTextNode(contactUsDna, json.contactUs.form.dna);
  const contactUsDnaHref = createDomElement('a', 'contact-us__href');
  contactUsDnaHref.setAttribute('href', `mailto:${json.contactUs.form.href}`)
  addTextNode(contactUsDnaHref, json.contactUs.form.href);
  const contactUsMap = createDomElement('div', 'contact-us__map');

  contactUsTitle.append(contactUsCaption, contactUsText);
  contactUsRightTop.append(contactUsMailIcon, contactUsMailText);
  contactUsTogglePwd.append(contactUsTogglePwdImg, json.contactUs.form.togglePwd.text);
  contactUsDna.append(contactUsDnaHref);
  contactUsFormPwd.append(contactUsFormLabelPwd, contactUsTogglePwd);
  contactUsFormData.append(
    contactUsFormLabelName,
    contactUsFormInputName,
    contactUsFormLabelEmail,
    contactUsFormInputEmail,
    contactUsFormPwd,
    contactUsFormInputPwd,
    contactUsFormButton,
    contactUsDna
  );
  contactUsForm.append(contactUsFormData);
  contactUsRightMain.append(contactUsForm, contactUsMap);
  contactUsRight.append(contactUsRightTop, contactUsRightMain);
  contactUsWhat.append(contactUsHeader, contactUsList);
  contactUsLeft.append(contactUsSocials, contactUsWhat);
  contactUsContact.append(contactUsLeft, contactUsRight);
  wrapper.append(contactUsTitle, contactUsContact);
  section.append(contactUsBackground, wrapper);

  return section;
}

function renderIndexPage(json) {
  const main = createDomElement('main', 'main-background');
  const wrapper1 = createDomElement('div', 'wrapper');
  const wrapper2 = createDomElement('div', 'wrapper');
  const header = renderHeader(window.location.pathname);
  const sectionHeading = renderSectionHeading(json);
  const sectionAboutUs = renderSectionAboutUs(json);
  const sectionLatestPosts = renderSectionLatestPosts(json);
  const sectionPortfolio = renderSectionPortfolio(json);
  const sectionTestimonials = renderSectionTestimonials(json);
  const sectionContactUs = renderSectionContactUs(json);
  const footer = renderFooter();

  wrapper1.append(header, sectionHeading);
  main.append(wrapper1);
  document.body.append(main);
  wrapper2.append(sectionAboutUs, sectionLatestPosts, sectionPortfolio);
  document.body.append(wrapper2, sectionTestimonials, sectionContactUs, footer);

  window.initMap = initMap;

  const interval = 1500;
  const portfolioSlider = new PortfolioSlider(
    document.querySelector('.portfolio__slider'),
    document.querySelector('.portfolio__sidebuttons'),
    interval
  );
  portfolioSlider.init();

  const testimonialsSlider = new TestimonialsSlider(
    document.querySelector('.testimonials__slider'),
    document.querySelector('.testimonials__sidebuttons'),
    interval
  );
  testimonialsSlider.init();
  
  $('body').prepend($('<div />').addClass('modal-info'));

  $('.modal-info').showModal({
    type: 'info',
    content: 'Subscribe to this blog and be first to know about updates',
    okButtonFn: () => {
      localStorage.setItem('subscribeOffer', true);
    },
    modalCss: {
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      width: '0',
      height: '0',
      background: 'rgba(0, 0, 0, 0.4)',
      zIndex: 999
    },
    onOpenAnimation: {
      width: '100%',
      height: '100%',
      transition: '0.2s'
    },
    delayInfoTimer: 10000
  });
}

renderIndexPage(indexMockData);
