const imgPath = 'https://image.tmdb.org/t/p/w500';

export class Mediator {
  constructor(componentTop, componentAside) {
    this._component1 = componentTop;
    this._component1.setMediator(this);
    this._component2 = componentAside;
    this._component2.setMediator(this);
  }

  notify(sender) {
    if (sender.closest('.mediator__top-panel')) {
      this._component2.changeSiblingsDropdownState(sender);
    }

    if (sender.closest('.mediator__aside-panel')) {
      this._component1.changeSiblingsDropdownState(sender);
    }
  }
}

class BaseComponent {
  constructor(mediator) {
    this.mediator = mediator;
  }

  setMediator(mediator) {
    this.mediator = mediator;
  }

  changeDropdownState(target, directorsList) {
    if (target.classList.contains('mediator__dropdown-header')) {
      target.classList.toggle('active');
      [...target.parentElement.lastChild.children].forEach(child => {
        child.classList.toggle('show');
      });

      [...document.querySelectorAll('.mediator__dropdown-header')].forEach(header => {
        if (!header.classList.contains('active')) {
          [...document.querySelectorAll('.mediator__dropdown-item')].forEach(item => {
            item.classList.remove('active');
            document.querySelector('.mediator__central-image').setAttribute('src', './assets/img_post_2.webp');
            document.querySelector('.mediator__film-name').textContent = 'Film name';
            document.querySelector('.mediator__film-rating').textContent = 'Film rating';
            document.querySelector('.mediator__film-description').textContent = 'Film description';
          });
        }
      });
    }

    if (target.classList.contains('mediator__dropdown-item')) {
      target.classList.add('active');
      directorsList.forEach(author => {
        if (target.closest('.mediator__dropdown').firstChild.textContent === author[0]) {
          const currentFilm = author.find(film => film.title === target.textContent);
          if (currentFilm?.poster_path) {
            document.querySelector('.mediator__central-image').setAttribute('src', imgPath + currentFilm.poster_path);
          } else {
            document.querySelector('.mediator__central-image').setAttribute('src', './assets/img_post_2.webp');
          }
          document.querySelector('.mediator__film-name').textContent = currentFilm.title;
          document.querySelector('.mediator__film-rating').textContent = `Film rating: ${currentFilm.vote_average}`;
          document.querySelector('.mediator__film-description').textContent = currentFilm.overview;
        }
      });
    }

    this.mediator.notify(target);
  }

  changeSiblingsDropdownState(sender, childClass) {
    if (sender.classList.contains('mediator__dropdown-header')) {
      const directorIndex = [...sender.parentElement.parentElement.children]
        .findIndex(el => el === sender.parentElement);
      const actor = document.querySelector(childClass).children[directorIndex];
      document.querySelectorAll('.mediator__dropdown-content').forEach(content => {
        if (content.parentElement.firstChild !== sender && content.parentElement !== actor) {
          content.parentElement.firstChild.classList.remove('active');
          [...content.children].forEach(child => {
            child.classList.remove('show');
          });
        }
      });
      actor.firstChild.classList.toggle('active');
      [...actor.lastChild.children].forEach(child => {
        child.classList.toggle('show');
      });
    }

    if (sender.classList.contains('mediator__dropdown-item')) {
      const directorIndex = [...sender.parentElement.parentElement.parentElement.children]
        .findIndex(el => el === sender.parentElement.parentElement);
      const filmIndex = [...sender.parentElement.children].findIndex(el => el === sender);
      const sibling = [...[...document
        .querySelector(childClass)
        .querySelectorAll('.mediator__dropdown-content')][directorIndex].children][filmIndex];

      sibling.classList.add('active');
      [...document.querySelectorAll('.mediator__dropdown-content')].forEach(author => {
        [...author.children].forEach(child => {
          if (child !== sibling && child !== sender) {
            child.classList.remove('active');
          }
        });
      });
    }
  }
}

export class ComponentTop extends BaseComponent {
  constructor(panel) {
    super();
    this.panel = panel;
  }

  changeDropdownState(target, directorsList) {
    super.changeDropdownState(target, directorsList);
  }

  changeSiblingsDropdownState(sender) { 
    super.changeSiblingsDropdownState(sender, this.panel);

  }
}

export class ComponentAside extends BaseComponent {
  constructor(panel) {
    super();
    this.panel = panel;
  }

  changeDropdownState(target, directorsList) {
    super.changeDropdownState(target, directorsList);
  }
  
  changeSiblingsDropdownState(sender) {
    super.changeSiblingsDropdownState(sender, this.panel);
  }
}
