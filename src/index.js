import cardTmp from './templates/item-card.hbs';
import { error, info } from '../node_modules/@pnotify/core/dist/PNotify.js';
import * as basicLightbox from 'basiclightbox';
import apiService from './js/apiService.js';

class Loader {
    constructor(selector) {
        this.loader = document.querySelector(selector)
    };
    addLoader() {
        this.loader.classList.remove('hidden');
    };
    clearLoader() {
        this.loader.classList.add('hidden');
    }
}
var lodash = require('lodash');
const newApiService = new apiService();
const changeLoader = new Loader('.loader');

const refs = {
    cardList: document.getElementById('gallery'),
    searchForm: document.getElementById('search-form')
}

refs.searchForm.addEventListener('input', lodash.debounce(onInputSearch, 1500));
window.addEventListener('scroll', onScrollSearch);

function onInputSearch(event) {
    event.preventDefault();
    newApiService.resetAmount();
    changeLoader.addLoader();
    clearCards();
    newApiService.value = event.target.value;
    newApiService.resetPage();
    newApiService.getData().then(res => {
        results(res);
        changeLoader.clearLoader();
        if (res.hits.length !== 0) {
            info({
                text: `Total images found: ${newApiService.total}`,
                delay: 2000,
            })
        };
    });
};

function onScrollSearch() {
    if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
          changeLoader.addLoader();
          newApiService.getData().then(res => {
            results(res);
            changeLoader.clearLoader();
        });
    }
};

function results(res) {
    if (res.hits.length === 0) {
        error({
            text: `No results were found for "${newApiService.inputValue}".`,
            delay: 3000
        });
        clearCards();
        return;
    };
    makeCards(res.hits);
};
function makeCards(cards) {
    refs.cardList.insertAdjacentHTML('beforeend', cardTmp(cards));
};

function clearCards() {
    refs.cardList.innerHTML = '';
};

refs.cardList.addEventListener('click', onFindElement);

function onFindElement(event) {
    if (event.currentTarget === event.target) {
        return;
    };
    const instance = basicLightbox.create(`<img src="${event.target.attributes.data.nodeValue}" alt="${event.target.alt}" width="1200">`);
    instance.show()
    };