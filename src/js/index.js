import {PixabayApi} from './pixabay-api';
import Notiflix from 'notiflix';
import createGalleryItems from '../templates/gallery-item.hbs';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchFormEl = document.querySelector('#search-form');
const galleryListEl = document.querySelector('.gallery');
const btnLoadMoreEl = document.querySelector('.load-more');

const pixabayApi = new PixabayApi();


const onLoadMoreBtnElClick = event => {
    pixabayApi.page += 1;
    pixabayApi.fetchPicsByInput()
        .then(res => {
            const { data } = res;

            galleryListEl.insertAdjacentHTML('beforeend', createGalleryItems(data.hits));
            let lightbox = new SimpleLightbox('.photo-card a', {captionsData: 'alt', captionDelay: 250, overlayOpacity: 0.8 });

            if (data.total / pixabayApi.pageVolume <= pixabayApi.page) {
                btnLoadMoreEl.classList.add('is-hidden');
                btnLoadMoreEl.removeEventListener('click', onLoadMoreBtnElClick);
            }
        })
        .catch(err => {
            console.log(err);
        });
};

const onSearchFormElSubmit = event => {
    event.preventDefault();
    galleryListEl.innerHTML = '';
    

    pixabayApi.inputedValue = event.currentTarget.elements.searchQuery.value;
    pixabayApi.page = 1;
    

    pixabayApi
        .fetchPicsByInput()
        .then(response => {
            console.log(response);
            const { data } = response;

            if (data.total === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                return;
            }

            if (data.total <= pixabayApi.pageVolume) {
                Notiflix.Notify.info(`There are ${data.total} pictures found`);
                btnLoadMoreEl.classList.add('is-hidden');
                galleryListEl.insertAdjacentHTML('beforeend', createGalleryItems(data.hits));
                let lightbox = new SimpleLightbox('.photo-card a', {captionsData: 'alt', captionDelay: 250, overlayOpacity: 0.8 });

                return;
            }

    console.log(data.hits);
            galleryListEl.insertAdjacentHTML('beforeend', createGalleryItems(data.hits));
            let lightbox = new SimpleLightbox('.photo-card a', {captionsData: 'alt', captionDelay: 250, overlayOpacity: 0.8 });
            Notiflix.Notify.info(`There are ${data.total} pictures found`);
      btnLoadMoreEl.classList.remove('isHidden');
      btnLoadMoreEl.addEventListener('click', onLoadMoreBtnElClick);
    })
        .catch(err => {
        if (err.message === "Network Error") {
        Notiflix.Notify.failure('Oops, some troubles with request');

      }
      console.log(err);
    });
};
searchFormEl.addEventListener('submit', onSearchFormElSubmit);