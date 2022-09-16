import {PixabayApi} from './pixabay-api';
import Notiflix from 'notiflix';
import createGalleryItems from '../templates/gallery-item.hbs';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchFormEl = document.querySelector('#search-form');
const galleryListEl = document.querySelector('.gallery');
const btnLoadMoreEl = document.querySelector('.load-more');

const pixabayApi = new PixabayApi();
let lightbox = new SimpleLightbox('.photo-card a', {captionsData: 'alt', captionDelay: 250, overlayOpacity: 0.8 });

const onLoadMoreBtnElClick = async event => {
    pixabayApi.page += 1;
    
    try {
        const { data } = await pixabayApi.fetchPicsByInput();
        galleryListEl.insertAdjacentHTML('beforeend', createGalleryItems(data.hits));
        lightbox.refresh();
        if (data.total / pixabayApi.pageVolume <= pixabayApi.page) {
            btnLoadMoreEl.classList.add('is-hidden');
            btnLoadMoreEl.removeEventListener('click', onLoadMoreBtnElClick);
        }
    } catch (err) {
        console.log(err);
    }
};

const onSearchFormElSubmit = async event => {
    event.preventDefault();
    galleryListEl.innerHTML = '';
    btnLoadMoreEl.classList.add('is-hidden');
    
    pixabayApi.inputedValue = event.currentTarget.elements.searchQuery.value;
    pixabayApi.page = 1;

    try {
        const { data } = await pixabayApi.fetchPicsByInput()
        console.log(data.total);
        if (data.total === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                return;
            }

            if (data.total / pixabayApi.pageVolume <= pixabayApi.page) {
                Notiflix.Notify.info(`There are ${data.total} pictures found`);
                galleryListEl.insertAdjacentHTML('beforeend', createGalleryItems(data.hits));
                lightbox.refresh();

                return;
            }

            console.log(data.hits);
            
            galleryListEl.insertAdjacentHTML('beforeend', createGalleryItems(data.hits));
            lightbox.refresh();
            Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
            btnLoadMoreEl.classList.remove('is-hidden');
            btnLoadMoreEl.addEventListener('click', onLoadMoreBtnElClick);
    } catch(err) {console.log(err);}
    
};
searchFormEl.addEventListener('submit', onSearchFormElSubmit);