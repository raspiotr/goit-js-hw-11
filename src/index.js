import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';

const apiKey = '9318257-96b567a3bb5708a16f509a99b';
//axios.defaults.headers.common['x-api-key'] = apiKey;

const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('input[name="searchQuery"]');
const searchBtn = document.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';

gallery.style.display = 'flex';
gallery.style.alignItems = 'center';
gallery.style.justifyContent = 'center';
gallery.style.flexWrap = 'wrap';
gallery.style.gap = '10px';
gallery.style.width = '1600px';

let page = 1;

const searchParams = new URLSearchParams({
  key: apiKey,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page,
});

const createImageCard = image => {
  const card = document.createElement('div');

  card.classList.add('photo-card');
  card.innerHTML = `
            <a href="${image.largeImageURL}" class="gallery-item">
              <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            </a>
            <div class="info">
              <p class="info-item"><b>Likes</b> ${image.likes}</p>
              <p class="info-item"><b>Views</b> ${image.views}</p>
              <p class="info-item"><b>Comments</b> ${image.comments}</p>
              <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
            </div>
          `;
  gallery.append(card);
};

const fetchImages = async () => {
  try {
    console.log(page);
    searchParams.set('page', page);
    const response = await axios.get('https://pixabay.com/api/', {
      params: searchParams,
    });
    const data = await response.data;
    console.log(data);

    if (data.hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    data.hits.forEach(createImageCard);

    // const lightbox = new SimpleLightbox('.gallery a');
    // lightbox.refresh();

    //console.log(page);

    if (data.totalHits <= page * 40) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.style.display = 'block';
    }
    page++;
  } catch (error) {
    Notiflix.Notify.failure('Ooops... Something is wrong! Please, try again.');
  }
};

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const searchQuery = searchInput.value;
  console.log(searchQuery);

  if (searchQuery) {
    searchParams.set('q', searchQuery);
    page = 1;
    gallery.innerHTML = '';
    await fetchImages();
  }
});

loadMoreBtn.addEventListener('click', fetchImages);
