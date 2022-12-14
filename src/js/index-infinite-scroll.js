import {PixabayApi} from './pixabay-api';
import Notiflix from 'notiflix';
import createGalleryItems from '../templates/gallery-item.hbs';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { franc, francAll } from 'franc';

const searchFormEl = document.querySelector('#search-form');
const galleryListEl = document.querySelector('.gallery');
const targetEl = document.querySelector('.js-target');


const pixabayApi = new PixabayApi();
let lightbox = new SimpleLightbox('.photo-card a', {captionsData: 'alt', captionDelay: 250, overlayOpacity: 0.8 });
const infiniteScrollOptions = {
    root: null,
    rootMargin: '0px 0px 300px 0px',
    threshold: 1.0
}

const observer = new IntersectionObserver(async (entries, observer) => {
    if (entries[0].isIntersecting) {
      try {
        pixabayApi.page += 1;
        const { data } = await pixabayApi.fetchPicsByInput();
        galleryListEl.insertAdjacentHTML('beforeend', createGalleryItems(data.hits));
        lightbox.refresh();
        if (data.totalHits / pixabayApi.pageVolume <= pixabayApi.page) {
            observer.unobserve(targetEl); 
        }
    } catch (err) {
        console.log(err);
    }
  }
}, infiniteScrollOptions);

const onSearchFormElSubmit = async event => {
    event.preventDefault();
    galleryListEl.innerHTML = '';
    
  pixabayApi.inputedValue = event.currentTarget.elements.searchQuery.value;
  const inputEl = document.querySelector('.input');
  console.log(inputEl.value);
    console.log(franc(inputEl.value, {
    only: ['eng', 'rus', 'ukr'], minLength: 3
  }));
    pixabayApi.page = 1;

    try {
        const { data } = await pixabayApi.fetchPicsByInput()
        console.log(data.totalHits);
        if (data.totalHits === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
          position: 'center-top',
          timeout: 7000,
          cssAnimationStyle: 'from-top',
        },);
                return;
            }

            if (data.totalHits / pixabayApi.pageVolume <= pixabayApi.page) {
                Notiflix.Notify.info(`There are ${data.totalHits} pictures found`, {
          position: 'center-top',
          timeout: 7000,
          cssAnimationStyle: 'from-top',
        },);
                galleryListEl.insertAdjacentHTML('beforeend', createGalleryItems(data.hits));
                lightbox.refresh();

                return;
            }

            console.log(data.hits);
            
            galleryListEl.insertAdjacentHTML('beforeend', createGalleryItems(data.hits));
            lightbox.refresh();
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`, {
          position: 'center-top',
          timeout: 7000,
          cssAnimationStyle: 'from-top',
        },);
            observer.observe(targetEl);
    } catch(err) {console.log(err);}
    
};
searchFormEl.addEventListener('submit', onSearchFormElSubmit);