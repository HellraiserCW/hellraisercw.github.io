const root = document.getElementById('root');

async function requestId(id) {
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        if (response.ok && id !== '') {
            return response.json()
            .then(card => pushCard(card));
        } else {
        throw alert('Character not found');
        }
    } catch (error) {
        return null;
    }
}

const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';
let cardContainer = document.querySelector('#characters-wrap');
let charactersArray = JSON.parse(localStorage.getItem('localData')) || [];
let resultsToShow = 5;
let loadedResults = resultsToShow;
charactersArray.forEach(makeCard);

searchBtn.addEventListener('click', () => {
    let id = searchInput.value;
    let isIdExist;
    if (charactersArray === null) {
        isIdExist = false;
    } else {
        isIdExist = !!charactersArray.find(element => Number( element.id) === Number(id));
    }
    if (isIdExist) {
        alert('Character is already in the list');
    } else {
        requestId(id);
    }
    document.querySelector('#search-input').value = '';
});

function pushCard(data) {
    charactersArray.push(data);
    localStorage.setItem('localData', JSON.stringify(charactersArray));
    makeCard(data);
}

function makeCard(data) {
    let currentCard = document.createElement('div');
    currentCard.setAttribute('class', `card character-card${data.id}`);
    currentCard.innerHTML = currentCard.innerHTML +
        `<img src=${data.image} class='search-id'></img>
        <button class='button' onclick='deleteCard(${data.id})'>Remove</button>`;
    cardContainer.prepend(currentCard);
    hideCards();
}

function deleteCard(id) {
    let toDelete = JSON.parse(localStorage.getItem('localData'));
    if (confirm('Delete?')) {
        const removeDiv = document.querySelector(`.character-card${id}`);
        removeDiv.remove();
        toDelete.forEach(function(item, i) {
            if (item.id === id) {
                toDelete.splice(i, 1);
            }
        });
    }
    localStorage.setItem('localData', JSON.stringify(toDelete));
    charactersArray = toDelete;
    hideCards();
}

function hideCards() {
    let cards = JSON.parse(localStorage.getItem('localData'));
    cards.forEach((element, id) => {
        let toHide = element.id;
        let hideDiv = document.getElementsByClassName(`character-card${toHide}`);
        let hideIt = hideDiv[0];
        if (hideIt !== undefined && id <= cards.length - loadedResults - 1) {
            hideIt.setAttribute('style', 'display: none');
        } else if (hideIt !== undefined && id > cards.length - loadedResults - 1) {
            hideIt.setAttribute('style', '');
        }
        localStorage.setItem('localData', JSON.stringify(cards));
        charactersArray = cards;
        if (cards.length > loadedResults) {
            loadMoreBtn.style.display = '';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    });
}

loadMoreBtn.addEventListener('click', () => {
    loadedResults += resultsToShow;
    hideCards()
    document.body.scrollTop = document.body.scrollHeight;
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
});