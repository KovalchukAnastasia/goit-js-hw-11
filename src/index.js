import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import FetchImg from './fetchImg';
// import InfiniteScroll from 'infinite-scroll';

import markup from './markup'


const refs = {
    formEl: document.querySelector('.search-form'),
    formInputField: document.querySelector('input[name="searchQuery"]'),
    formBtn: document.querySelector('.searchBtn'),
    // loadMoreBtn: document.querySelector('.load-more'),
    imgCard: document.querySelector('.gallery'),
    preloader: document.querySelectorAll('.loader div')
};

const fetchImg = new FetchImg();
let gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// refs.loadMoreBtn.style.display = 'none';
// refs.preloader.forEach(e => {
//     e.style.display = 'none';           
// });

refs.formEl.addEventListener('submit', onSearchImages);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearchImages(evt) {
  evt.preventDefault();

  fetchImg.inputTitle =
    evt.currentTarget.elements.searchQuery.value.trim();
    resetMarkup();

  if (fetchImg.inputTitle === '') {
    Notiflix.Notify.warning('Field must not be empty');
    refs.formInputField.value = '';
    return;
  }

  refs.preloader.forEach(e => {
    e.style.display = 'block';
  });
//   refs.loadMoreBtn.style.display = 'none';

  fetchImg.resetPage();
  fetchImg.resetCurrentHits();
  refs.formInputField.value = '';

  fetchImg
    .fetchImg()
      .then(hits => {
        resetMarkup();
      refs.imgCard.insertAdjacentHTML('beforeend', markup(hits));
      gallerySimpleLightbox.refresh();
      refs.preloader.forEach(e => {
        e.style.display = 'none';
      });
    //   refs.loadMoreBtn.style.display = 'block';
    //   if (hits.length < 40) {
    //     // refs.loadMoreBtn.style.display = 'none';
    //   }
    })
    .catch(err => {
        console.log(err);
        refs.preloader.forEach(e => {
          e.style.display = 'none';
          resetMarkup();
      });
    });
}

function onLoadMore() {
//   refs.loadMoreBtn.style.display = 'none';
//   refs.preloader.forEach(e => {
//     e.style.display = 'block';
//   });
  fetchImg
    .fetchImg()
    .then(hits => {
      refs.imgCard.insertAdjacentHTML('beforeend', markup(hits));
      gallerySimpleLightbox.refresh();
      refs.preloader.forEach(e => {
        e.style.display = 'none';
      });
    //   refs.loadMoreBtn.style.display = 'block';
      const { height: cardHeight } =
        refs.imgCard.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    //   if (hits.length < 40) {
    //     // refs.loadMoreBtn.style.display = 'none';
    //   }
    })
    .catch(err => {
      console.log(err);
    });
}

// нескінченний скролл
window.addEventListener('scroll', () => {
    const documentRect = document.documentElement.getBoundingClientRect();
    
    if (documentRect.bottom < document.documentElement.clientHeight + 150) {
            onLoadMore();
    }

})

function resetMarkup() {
    refs.imgCard.innerHTML = '';
}

