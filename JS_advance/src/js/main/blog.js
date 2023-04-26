import { stars } from '../mock-data/common-mock-data.js';
import { blogMockData } from '../mock-data/blog-mock-data.js';
import { renderHeader, renderFooter, createDomElement, addTextNode } from './common.js';
import { searchEngine } from '../features/searchEngine.js';
import { registerJQueryModalPlugin } from '../features/jquery-modal.js';

registerJQueryModalPlugin($);

class Post {
  constructor(data, index, postTypeImg) {
    this.data = data;
    this.index = index;
    this.postTypeImg = postTypeImg;
    this.imgPath = 'https://image.tmdb.org/t/p/w500';
    this.post = createDomElement('div', 'posts__post-item', 'post-item');
    this.postContent = createDomElement('div', 'post-item__content');
    this.postCredentials = createDomElement('div', 'post-item__credentials');
    this.postCredentialsImg = createDomElement('img', 'post-item__credentials-image');
    this.postCredentialsData = createDomElement('div', 'post-item__credentials-data');
    this.postAuthorName = createDomElement('h3', 'post-item__author-name');
    this.postStats = createDomElement('div', 'post-item__stats');
    this.postPublished = createDomElement('span', 'post-item__published');
    this.postReadtime = createDomElement('span', 'post-item__readtime');
    this.postCommentsIcon = createDomElement('img', 'post-item__comments-icon');
    this.postComments = createDomElement('span', 'post-item__comments');
    this.postStars = createDomElement('div', 'post-item__stars');
    this.postTextBlock = createDomElement('div', 'post-item__text-block');
    this.postTextHeader = createDomElement('h3', 'post-item__text-header');
    this.postText = createDomElement('p', 'post-item__text');
    this.postTextReadmore = createDomElement(
      'button',
      'post-item__text-read-more',
      'button',
      'button--secondary'
    );
    this.postTextDeletePost = createDomElement(
      'button',
      'post-item__text-delete-post',
      'button',
      'button--primary'
    );
    this.starsCount = 5;
  }

  render() {
    this.post.classList.add(`post-item--${this.postTypeImg}`);
    
    if (this.data[this.index].production_companies.length) {
      if (this.data[this.index].production_companies[0].logo_path) {
        this.postCredentialsImg.setAttribute(
          'src',
          this.imgPath + this.data[this.index].production_companies[0].logo_path
        );
        this.postCredentialsImg.setAttribute('alt', 'company logo');
      } else {
        this.postCredentialsImg.setAttribute('alt', 'no logo');
      }

      this.data[this.index].production_companies[0].name
        ? addTextNode(this.postAuthorName, this.data[this.index].production_companies[0].name)
        : false;
    } else {
      this.postCredentialsImg.setAttribute('alt', 'no logo');
      addTextNode(this.postAuthorName, 'No company');
    }

    const date = new Date(this.data[this.index].release_date);
    const day = ('0' + date.getDate()).slice(-2);
    const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase();
    const year = date.getFullYear();
    addTextNode(this.postPublished, `${day} ${month}, ${year}`);
    addTextNode(this.postReadtime, this.data[this.index].runtime + ' mins');
    addTextNode(this.postComments, this.data[this.index].vote_count);
    
    this.postCommentsIcon.setAttribute('src', 'assets/a-icon-comment.svg');
    this.postCommentsIcon.setAttribute('alt', 'preview');

    let vote = 0;
    const starStep = 2;
    for (let i = 0; i < this.starsCount; i++) {
      const postStar = createDomElement('img', 'posts__star');

      if (this.data[this.index].vote_average < vote) {
        postStar.setAttribute('src', stars.starEmpty);
      } else if (this.data[this.index].vote_average < vote + 1) {
        postStar.setAttribute('src', stars.starHalf);
      } else {
        postStar.setAttribute('src', stars.starFull);
      }

      vote += starStep;
      postStar.setAttribute('alt', 'star');
      this.postStars.appendChild(postStar);
    }

    addTextNode(this.postTextHeader, this.data[this.index].title);
    addTextNode(this.postText, this.data[this.index].overview);
    addTextNode(this.postTextReadmore, 'Read more');
    addTextNode(this.postTextDeletePost, 'Delete post');

    this.postStats.append(
      this.postPublished,
      this.postReadtime,
      this.postCommentsIcon,
      this.postComments,
      this.postStars
    );
    this.postCredentialsData.append(this.postAuthorName, this.postStats);
    this.postCredentials.append(this.postCredentialsImg, this.postCredentialsData);
    this.postTextBlock.append(this.postTextHeader, this.postText);
    this.postContent.append(
      this.postCredentials,
      this.postTextBlock,
      this.postTextReadmore,
      this.postTextDeletePost
    );
    this.post.append(this.postContent);

    return this.post;
  }
  
  createDomElement(tag, ...elClassList) {
    const domElement = document.createElement(tag);
    domElement.classList.add(...elClassList);
    return domElement;
  }

  addTextNode(element, text) {
    const textNode = document.createTextNode(text);
    return element.appendChild(textNode);
  }
}

export class VideoPost extends Post {
  constructor(data, index, postTypeImg) {
    super(data, index, postTypeImg);
    this.postPreview = createDomElement('div', 'post-item__preview');
    this.postImage = createDomElement('img', 'post-item__image');
  }

  render() {
    const postTemplate = super.render();

    if (this.data[this.index].backdrop_path) {
      this.postImage.setAttribute('src', this.imgPath + this.data[this.index].backdrop_path);
      this.postImage.setAttribute('alt', 'preview');
    } else {
      this.postImage.setAttribute('alt', 'no preview');
    }

    this.postPreview.append(this.postImage);
    this.post.insertBefore(this.postPreview, this.postContent);

    return postTemplate;
  }
}

export class AudioPost extends Post {
  constructor(data, index, postTypeImg) {
    super(data, index, postTypeImg);
    this.postPreview = createDomElement('div', 'post-item__preview');
    this.postImage = createDomElement('img', 'post-item__image');
    this.postAudio = createDomElement('audio', 'post-item__audio');
  }

  render() {
    const postTemplate = super.render();

    if (this.data[this.index].backdrop_path) {
      this.postImage.setAttribute('src', this.imgPath + this.data[this.index].backdrop_path);
      this.postImage.setAttribute('alt', 'preview');
    } else {
      this.postImage.setAttribute('alt', 'no preview');
    }

    this.postPreview.append(this.postImage);
    this.post.insertBefore(this.postPreview, this.postContent);

    this.postAudio.controls = true;
    this.postAudio.setAttribute('src', '#');
    this.postAudio.setAttribute('type', 'audio/mpeg');
    this.postTextBlock.insertBefore(this.postAudio, this.postText);

    return postTemplate;
  }
}

export class ImagePost extends Post {
  constructor(data, index, postTypeImg) {
    super(data, index, postTypeImg);
    this.postPreview = createDomElement('div', 'post-item__preview');
    this.postImage = createDomElement('img', 'post-item__image');
  }

  render() {
    const postTemplate = super.render();

    if (this.data[this.index].backdrop_path) {
      this.postImage.setAttribute('src', this.imgPath + this.data[this.index].backdrop_path);
      this.postImage.setAttribute('alt', 'preview');
    } else {
      this.postImage.setAttribute('alt', 'no preview');
    }

    this.postPreview.append(this.postImage);
    this.post.insertBefore(this.postPreview, this.postContent);

    return postTemplate;
  }
}

export class TextPost extends Post {
  render() {
    const postTemplate = super.render();

    this.postContent.classList.add('post-item__content--no-preview');

    return postTemplate;
  }
}

async function renderPosts(json) {
  const posts = createDomElement('main', 'posts');
  const postsHeader = createDomElement('h2', 'posts__header');
  addTextNode(postsHeader, json.header);
  const postsSearchForm = createDomElement('form', 'posts__search-form');
  const postsSearchInput = createDomElement('input', 'posts__input', 'input-search');
  postsSearchInput.setAttribute('type', 'search');
  postsSearchInput.setAttribute('placeholder', 'Search');
  postsSearchInput.setAttribute('name', 'director');
  const postsSearchButton = createDomElement('button', 'posts__button', 'button-search');
  postsSearchButton.setAttribute('type', 'submit');
  const postsSearchButtonImg = createDomElement('img', 'posts__button-icon', 'button-search-icon');
  postsSearchButtonImg.setAttribute('src', json.search.imgSrc);
  postsSearchButtonImg.setAttribute('alt', 'preview');
  const postsPostDropdown = createDomElement('select', 'posts__select');
  const postsPostDropdownDirector = createDomElement('option');
  postsPostDropdownDirector.setAttribute('value', 'director');
  addTextNode(postsPostDropdownDirector, 'by Director');
  const postsPostDropdownFilm = createDomElement('option');
  postsPostDropdownFilm.setAttribute('value', 'film');
  addTextNode(postsPostDropdownFilm, 'by Film');
  postsPostDropdown.append(postsPostDropdownDirector, postsPostDropdownFilm);
  const postsPostSection = createDomElement('div', 'posts__post-section');
  const postsReadMore = createDomElement('div', 'posts__read-more', 'button-search-icon');
  const postsReadMoreButton = createDomElement('button', 'button', 'button--primary');
  addTextNode(postsReadMoreButton, json.readMoreBtn);
  
  postsSearchButton.append(postsSearchButtonImg);
  postsSearchForm.append(postsSearchInput, postsSearchButton, postsPostDropdown);
  postsReadMore.append(postsReadMoreButton);
  posts.append(postsHeader, postsSearchForm, postsPostSection, postsReadMore);
  
  return posts;
}  

async function renderBlogPage(json) {
  const wrapper = createDomElement('div', 'wrapper');
  const header = renderHeader(window.location.pathname);
  const posts = await renderPosts(json);
  const footer = renderFooter();

  wrapper.append(header, posts)
  document.body.append(wrapper, footer);

  searchEngine();

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
      height: '100%',
      opacity: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      zIndex: 999
    },
    onOpenAnimation: {
      opacity: 1,
      transition: '0.2s'
    },
    delayInfoTimer: 10000
  });
}

renderBlogPage(blogMockData);
