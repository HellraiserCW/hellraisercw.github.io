import { VideoPost, AudioPost, ImagePost, TextPost } from '../main/blog.js';
import { requestDb } from '../features/fetchMovies.js';
import { registerJQueryModalPlugin } from '../features/jquery-modal.js';

registerJQueryModalPlugin($);

export function searchEngine() {
  const coreUrl = 'https://api.themoviedb.org/3';
  const api_key = '897f8c44ed5f8e7e964d53a2db27dbfd';
  const params = new URLSearchParams(window.location.search);
  const searchBar = document.querySelector('.posts__input');
  const searchForm = document.querySelector('.posts__search-form');
  const inputSearch = document.querySelector('.input-search');
  const postsSection = document.querySelector('.posts__post-section');
  const validRegEx = /^[A-Z]{1}(?=.*[a-z])[a-z0-9 !:-?.,]{5,59}$/;
  const postsPerPage = 4;
  const infoBlock = document.createElement('p');
  infoBlock.classList.add('no-results');
  infoBlock.textContent = 'No search results, try again!';

  let searchResult = [];

  initSearchEngine();

  function initSearchEngine() {
    addSearchFormListeners();
    
    if (params.get('director')) {
      fetchSearchResultsData('director', params.get('director'));
    } else if (params.get('film')) {
      fetchSearchResultsData('film', params.get('film'));
    } else {
      fetchPresetData();
    }
  }
  
  function addSearchFormListeners() {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      validateInput(searchBar.value);
    });

    searchBar.addEventListener('input', () => {
      if (!searchBar.value.length) {
        inputSearch.style.border = '1px solid #DCDCDC';
        updateURL('');
        fetchPresetData();
      }
    });
  }

  function updateURL(parameters) {
    window.history.pushState({}, '', `?${parameters}`);
  }

  function validateInput(input) {
    validRegEx.test(input)
      ? fetchSearchResultsData(document.querySelector('.posts__select').value)
      : inputSearch.style.border = '1px solid #F06786';
    }
    
    function clearPostNodes() {
      inputSearch.style.border = '1px solid #DCDCDC';
      while (postsSection.childNodes.length) {
      postsSection.removeChild(postsSection.lastChild);
    }
  }
  
  async function fetchPresetData() {
    clearPostNodes();
    postsSection.textContent = 'Loading, please wait!';

    searchResult = await requestDb();
    
    renderData();
  }
  
  async function fetchSearchResultsData(searchBy, parameters) {
    if (searchBy === 'director') {
      params.delete('film');
      params.set('director', searchBar.value || params.get('director'));
    } else {
      params.delete('director');
      params.set('film', searchBar.value || params.get('film'));
    }

    updateURL(params.toString());

    clearPostNodes();
    postsSection.textContent = 'Loading, please wait!';
    
    searchResult = searchBy === 'director'
      ? await requestByDirector(parameters)
      : await requestByFilmName(parameters);
    
    renderData();
  }
  
  function renderData() {
    clearPostNodes();

    if (searchResult.length) {
      searchResult.forEach((res, i) => {
        switch (i % postsPerPage) {
          case 0:
            postsSection.append(new VideoPost(searchResult, i, 'video').render());
            break;
          case 1:
            postsSection.append(new AudioPost(searchResult, i, 'audio').render());
            break;
          case 2:
            postsSection.append(new ImagePost(searchResult, i, 'picture').render());
            break;
          case 3:
          default:
            postsSection.append(new TextPost(searchResult, i, 'text').render());
        }
      });
    } else {
      postsSection.append(infoBlock);
    }

    const postItem = '.post-item';
    const deletePostButton = '.post-item__text-delete-post';
    
    $(deletePostButton).on('click', (event) => {
      $('body').prepend($('<div />').addClass('modal-error'));
      
      $('.modal-error').showModal({
        type: 'error',
        content: 'Are you sure you want to delete this post?',
        onClickAroundModal: false,
        okButtonFn: () => {
          $(event.target).closest(postItem).remove();
        },
        cancelButtonFn: () => {
          return;
        }
      })
    });
  }
  
  function requestByDirector(query = searchBar.value) {
    const apiPersonUrl = `${coreUrl}/search/person?api_key=${api_key}&query=${query}`;

    return fetch(apiPersonUrl)
      .then(data => data.json())
      .then(data => data.results.filter(res => res.known_for_department === 'Directing'))
      .then(data => {
        return Promise.all(data.map(item => {
          const apiDirectingUrl = `${coreUrl}/person/${item.id}/movie_credits?api_key=${api_key}`;

          return fetch(apiDirectingUrl)
            .then(data => data.json())
            .then(data => data.crew.filter(res => res.department === 'Directing'))
            .then(data => {
              return Promise.all(data.map(item => {
                const apiFilmDetailsUrl = `${coreUrl}/movie/${item.id}?api_key=${api_key}`;

                return fetch(apiFilmDetailsUrl)
                  .then(data => data.json());
              }));
            });
        }));
      })
      .then(data => data.flat(1));
  }

  function requestByFilmName(query = searchBar.value) {
    const apiMovieUrl = `${coreUrl}/search/movie?api_key=${api_key}&query=${query}`;

    return fetch(apiMovieUrl)
      .then(data => data.json())
      .then(data => {
        return Promise.all(data.results.map(item => {
          const apiFilmDetailsUrl = `${coreUrl}/movie/${item.id}?api_key=${api_key}`;

          return fetch(apiFilmDetailsUrl)
            .then(data => data.json());
        }));
      });
  }
}
