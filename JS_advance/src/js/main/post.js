import { socials, stars } from '../mock-data/common-mock-data.js';
import { postMockData } from '../mock-data/post-mock-data.js';
import { renderHeader, renderFooter, createDomElement, addTextNode } from './common.js';
import { registerJQueryModalPlugin } from '../features/jquery-modal.js';

const starsCount = 5;
const latestPosts = 2;
registerJQueryModalPlugin($);

function renderContent(json) {
  const content = createDomElement('section', 'post__content', 'content');
  const contentHeader = createDomElement('h2', 'content__header');
  addTextNode(contentHeader, json.content.header);
  const contentCredentials = createDomElement('div', 'content__credentials');
  const contentCredentialsImg = createDomElement('img', 'content__credentials-image');
  contentCredentialsImg.setAttribute('src', json.content.credentials.authorImg.imgSrc);
  contentCredentialsImg.setAttribute('alt', 'preview');
  const contentCredentialsData = createDomElement('div', 'content__credentials-data');
  const contentAuthorName = createDomElement('h3', 'content__author-name');
  addTextNode(contentAuthorName, json.content.credentials.authorName);
  const contentStats = createDomElement('div', 'content__stats');
  const contentPublished = createDomElement('span', 'content__published');
  addTextNode(contentPublished, json.content.credentials.published);
  const contentReadtime = createDomElement('span', 'content__readtime');
  addTextNode(contentReadtime, json.content.credentials.readTime);
  const contentCommentsIcon = createDomElement('img', 'content__comments-icon');
  contentCommentsIcon.setAttribute('src', json.content.credentials.commentsIcon.imgSrc);
  contentCommentsIcon.setAttribute('alt', 'preview');
  const contentCommentsQty = createDomElement('span', 'content__comments-quantity');
  addTextNode(contentCommentsQty, json.content.credentials.comments);
  const contentStars = createDomElement('div', 'content__stars');
  for (let j = 0; j < starsCount; j++) {
    const contentStar = createDomElement('img', 'content__star');
    contentStar.setAttribute('src', stars.starFull);
    contentStar.setAttribute('alt', stars.alt);

    contentStars.append(contentStar);
  }
  const contentPreview = createDomElement('img', 'content__preview');
  contentPreview.setAttribute('src', json.content.mainImg.imgSrc);
  contentPreview.setAttribute('alt', 'preview');
  const contentAudio = createDomElement('audio', 'content__audio');
  contentAudio.controls = true;
  contentAudio.setAttribute('src', json.content.audio.source);
  contentAudio.setAttribute('type', json.content.audio.type);
  const contentText1 = createDomElement('p', 'content__text');
  contentText1.innerHTML = json.content.text1;
  const contentText2 = createDomElement('p', 'content__text');
  contentText2.innerHTML = json.content.text2;
  const contentText3 = createDomElement('p', 'content__text');
  contentText3.innerHTML = json.content.text3;
  const contentCaption1 = createDomElement('h3', 'content__caption');
  addTextNode(contentCaption1, json.content.caption1);
  const contentText4 = createDomElement('p', 'content__text');
  contentText4.innerHTML = json.content.text4;
  const contentText5 = createDomElement('p', 'content__text');
  contentText5.innerHTML = json.content.text5;
  const contentCite = createDomElement('p', 'content__text-cite');
  contentCite.innerHTML = json.content.cite;
  const contentCaption2 = createDomElement('h3', 'content__caption');
  addTextNode(contentCaption2, json.content.caption2);
  const contentText6 = createDomElement('p', 'content__text');
  contentText6.innerHTML = json.content.text6;
  const contentActions = createDomElement('div', 'content__actions');
  const contentLikes = createDomElement('div', 'content__likes');
  const contentLikesImg = createDomElement('div', 'content__likes-img');
  const contentLikesCounter = createDomElement('span', 'content__likes-counter');
  addTextNode(contentLikesCounter, json.content.likes);
  const contentSocials = createDomElement('div', 'content__socials');
  socials.forEach(social => {
    const contentIcon = createDomElement('img', 'content__socials-icon');
    contentIcon.setAttribute('src', social.imgSrc);
    contentIcon.setAttribute('alt', 'preview');

    contentSocials.append(contentIcon);
  });
  contentSocials.insertBefore(contentSocials.childNodes[latestPosts], contentSocials.childNodes[1]);
  const contentComments = createDomElement('div', 'content__comments');
  const contentCommentsCaption = createDomElement('h3', 'content__comments-caption');
  addTextNode(contentCommentsCaption, json.content.commentsCaption);

  contentComments.append(contentCommentsCaption);
  json.content.comments.forEach((comment, index) => {
    const contentComment = createDomElement('div', 'content__comment', 'comments--decoration');
    if (index === 0) {
      contentComment.classList.add('comments--decoration-top');
    }
    if (index + 1 === json.content.comments.length) {
      contentComment.classList.add('comments--decoration-bottom');
    }
    const contentCommentatorPhoto = createDomElement('img', 'content__commentator-photo');
    contentCommentatorPhoto.setAttribute('src', comment.commentator.imgSrc);
    contentCommentatorPhoto.setAttribute('alt', 'preview');
    const contentCommentSection = createDomElement('div', 'content__comment-section');
    const contentCommentData = createDomElement('div', 'content__comment-data');
    const contentCommentatorName = createDomElement('h4', 'content__commentator-name');
    addTextNode(contentCommentatorName, comment.commentator.name);
    const contentStars = createDomElement('div', 'content__stars');
    for (let j = 0; j < starsCount; j++) {
      const contentStar = createDomElement('img', 'content__star');
      contentStar.setAttribute('src', stars.starFull);
      contentStar.setAttribute('alt', stars.alt);
  
      contentStars.append(contentStar);
    }
    const contentPosted = createDomElement('div', 'content__posted');
    const contentPostedIcon = createDomElement('img', 'content__posted-icon');
    contentPostedIcon.setAttribute('src', comment.posted.imgSrc);
    contentPostedIcon.setAttribute('alt', 'preview');
    const contentPostedTime = createDomElement('span', 'content__posted-time');
    addTextNode(contentPostedTime, comment.posted.time);
    const contentCommentText = createDomElement('p', 'content__comment-text');
    addTextNode(contentCommentText, comment.text);
    const contentOptions = createDomElement('div', 'content__options');
    if (comment.more) {
      const contentReadMore = createDomElement('a', 'content__read-more');
      addTextNode(contentReadMore, comment.more);
      contentReadMore.href = comment.moreHref;
  
      contentOptions.append(contentReadMore);
    }
    
    contentPosted.append(contentPostedIcon, contentPostedTime)
    contentCommentData.append(contentCommentatorName, contentStars, contentPosted);
    contentCommentSection.append(contentCommentData, contentCommentText, contentOptions);
    contentComment.append(contentCommentatorPhoto, contentCommentSection);
    contentComments.append(contentComment);
  });
  const contentMoreComments = createDomElement('div', 'content__more-comments');
  const contentButton = createDomElement('button', 'button', 'button--secondary');
  addTextNode(contentButton, json.content.moreComments);

  contentMoreComments.append(contentButton);
  contentStats.append(contentPublished, contentReadtime, contentCommentsIcon, contentCommentsQty, contentStars);
  contentCredentialsData.append(contentAuthorName, contentStats);
  contentCredentials.append(contentCredentialsImg, contentCredentialsData);
  contentLikes.append(contentLikesImg, contentLikesCounter);
  contentActions.append(contentLikes, contentSocials);
  content.append(
    contentHeader,
    contentCredentials,
    contentPreview,
    contentAudio,
    contentText1,
    contentText2,
    contentText3,
    contentCaption1,
    contentText4,
    contentText5,
    contentCite,
    contentCaption2,
    contentText6,
    contentActions,
    contentComments,
    contentMoreComments
  );

  return content;
}

function renderAside(json) {
  const aside = createDomElement('section', 'post__aside', 'aside');
  const asideLatest = createDomElement('div', 'aside__latest');
  const asideLatestHeader = createDomElement('h2', 'aside__header');
  addTextNode(asideLatestHeader, json.aside.latest.header);
  
  asideLatest.append(asideLatestHeader);
  json.aside.latest.posts.slice(0, latestPosts).forEach(post => {
    const asideLatestPost = createDomElement('div', 'aside__latest-post');
    const asideLatestPreview = createDomElement('div', 'aside__latest-preview');
    const asideLatestImg = createDomElement('img', 'aside__latest-img');
    asideLatestImg.setAttribute('src', post.imgSrc);
    asideLatestImg.setAttribute('alt', 'preview');
    const asideLatestContent = createDomElement('div', 'aside__latest-content');
    const asideLatestCaption = createDomElement('h3', 'aside__latest-caption');
    addTextNode(asideLatestCaption, post.caption);
    const asideLatestStats = createDomElement('div', 'aside__latest-stats');
    const asideLatestPublished = createDomElement('span', 'aside__latest-published');
    addTextNode(asideLatestPublished, post.stats.published);
    const asideLatestReadtime = createDomElement('span', 'aside__latest-readtime');
    addTextNode(asideLatestReadtime, post.stats.readTime);
    const asideLatestIcon = createDomElement('img', 'aside__latest-icon');
    asideLatestIcon.setAttribute('src', post.stats.commentsIcon.imgSrc);
    asideLatestIcon.setAttribute('alt', 'preview');
    const asideLatestComments = createDomElement('span', 'aside__latest-comments');
    addTextNode(asideLatestComments, post.stats.comments);
  
    asideLatestPreview.append(asideLatestImg);
    asideLatestStats.append(asideLatestPublished, asideLatestReadtime, asideLatestIcon, asideLatestComments);
    asideLatestContent.append(asideLatestCaption, asideLatestStats);
    asideLatestPost.append(asideLatestPreview, asideLatestContent);
    asideLatest.append(asideLatestPost);
  });
  const asideLatestMore = createDomElement('button', 'aside__latest-more', 'button', 'button--secondary');
  addTextNode(asideLatestMore, json.aside.latest.readMore);

  asideLatest.append(asideLatestMore);

  const asideCategories = createDomElement('div', 'aside__categories');
  const asideCategoriesHeader = createDomElement('h2', 'aside__header');
  addTextNode(asideCategoriesHeader, json.aside.categories.header);
  const asideDropdowns = createDomElement('div', 'aside__categories-dropdowns');
  json.aside.categories.dropdowns.forEach((dropdown, index) => {
    const asideDropdown = createDomElement('nav', 'aside__categories-dropdown');
    const asideHeader = createDomElement('label', 'aside__categories-header');
    asideHeader.setAttribute('for', `touch-${index}`);
    const asideHeaderText = createDomElement('span', 'aside__categories-header-text');
    addTextNode(asideHeaderText, dropdown.header);
    const asideSlider = createDomElement('input', 'aside__categories-slider');
    asideSlider.setAttribute('type', 'checkbox');
    asideSlider.id = `touch-${index}`;
    const asideContent = createDomElement('ul', 'aside__categories-content');
    if (index === 1) {
      asideDropdown.classList.add('dropdown--open-content');
      asideContent.classList.add('dropdown--show-content');
    }
    dropdown.content.forEach(drop => {
      const asideItem = createDomElement('li', 'aside__categories-item');
      const asideHref = createDomElement('a', 'aside__categories-link');
      asideHref.setAttribute('href', drop.href);
      addTextNode(asideHref, drop.name);
  
      asideItem.append(asideHref);
      asideContent.append(asideItem);
      asideHeader.append(asideHeaderText);
      asideDropdown.append(asideHeader, asideSlider, asideContent);
      asideDropdowns.append(asideDropdown);
    });

    asideCategories.append(asideCategoriesHeader, asideDropdowns);
  });
  const asideTags = createDomElement('div', 'aside__tags');
  const asideTagsHeader = createDomElement('h2', 'aside__header');
  addTextNode(asideTagsHeader, json.aside.tags.header);
  const asideTagsButtons = createDomElement('div', 'aside__tags-buttons');
  json.aside.tags.tagNames.forEach(tag => {
    const asideTagsButton = createDomElement('button', 'button', 'button--secondary', 'button--small');
    addTextNode(asideTagsButton, tag);

    asideTagsButtons.append(asideTagsButton);
  });

  asideTags.append(asideTagsHeader, asideTagsButtons);
  aside.append(asideLatest, asideCategories, asideTags);

  return aside;
}

function renderPostPage(json) {
  const wrapper = createDomElement('div', 'wrapper');
  const header = renderHeader(window.location.pathname);
  const post = createDomElement('main', 'post');
  const content = renderContent(json);
  const aside = renderAside(json);
  post.append(content, aside);
  const footer = renderFooter();

  wrapper.append(header, post)
  document.body.append(wrapper, footer);

  $('body').prepend($('<div />').addClass('modal-info'));

  $('.modal-info').showModal({
    type: 'info',
    content: 'Subscribe to this blog and be first to know about updates',
    okButtonFn: () => {
      localStorage.setItem('subscribeOffer', true);
    },
    modalCss: {
      position: 'fixed',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
      width: '100%',
      height: '0',
      background: 'rgba(0, 0, 0, 0.4)',
      zIndex: 999
    },
    onOpenAnimation: {
      height: '100%',
      transition: '0.2s'
    },
    delayInfoTimer: 10000
  });
}

renderPostPage(postMockData);
