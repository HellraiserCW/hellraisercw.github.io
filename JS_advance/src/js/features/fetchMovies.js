const coreUrl = 'https://api.themoviedb.org/3';
const api_key = '897f8c44ed5f8e7e964d53a2db27dbfd';
const postsQty = 4;

export async function requestDb() {
  try {
    let storedFilms = JSON.parse(localStorage.getItem('filmArray'));
    if (!storedFilms || !storedFilms.length) {
      return await requestFilms();
    }
    return storedFilms;
  } catch (error) {
    console.log('Something went wrong, sorry! ' + error);
  }
}

function requestFilms() {
  const apiUrl = `${coreUrl}/movie/popular?api_key=${api_key}&page=1`;

  return fetch(apiUrl)
    .then(data => data.json())
    .then(data => {
      if (data.success === false) {
        throw new Error('Something went wrong, sorry!');
      }
      return data;
    })
    .then(data => {
      return Promise.all(
        data.results.slice(0, postsQty).map(item => {
          const detailedApiUrl = `${coreUrl}/movie/${item.id}?api_key=${api_key}`;

          return fetch(detailedApiUrl)
            .then(data => data.json())
            .then(data => {
              if (data.success === false) {
                throw new Error('Something went wrong, sorry!');
              }
              return data;
            });
        })
      )
        .then(detailedData => {
          localStorage.setItem('filmArray', JSON.stringify(detailedData));
          return detailedData;
        })
    })
    .catch((err) => console.log(err));
}

export async function requestTopRatedFilmsByYear(year) {
  const limitPages = 50;
  let allFilmsPages = [];
  let pages = await countPagesOfFilmsByYear(year);
  pages = pages >= limitPages ? limitPages : pages;

  const toFetch = [...Array(pages).keys()].map(i => i + 1);
  allFilmsPages = await getAllFilmsByYear(year, toFetch);
  
  return allFilmsPages.flat(2);
}

async function getAllFilmsByYear(year, pages) {
  return Promise.all(pages.map(page => {
    return fetch(`${coreUrl}/discover/movie?api_key=${api_key}&page=${page}&primary_release_year=${year}`)
      .then(data => data.json())
      .then(data => {
        return Promise.all(data.results.map(item => {
          return fetch(`${coreUrl}/movie/${item.id}?api_key=${api_key}`)
            .then(data => data.json())
            .then(() => {
              return fetch(`${coreUrl}/movie/${item.id}/credits?api_key=${api_key}`)
                .then(data => data.json())
                .then(data => {
                  item.credits = data;
                  return item;
                });
            });
        }));
      });
  }))
    .then(data => {
      let array = [];
      array.push(data);
      return array;
    })
    .catch((err) => console.log(err));
}

function countPagesOfFilmsByYear(year) {
  return fetch(`${coreUrl}/discover/movie?api_key=${api_key}&page=1&primary_release_year=${year}`)
  .then(data => data.json())
  .then(data => {
    if (data.success === false) {
      throw new Error('Something went wrong, sorry!');
    }
    return data.total_pages;
  })
  .catch((err) => console.log(err));
}
