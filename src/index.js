import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'font-awesome/css/font-awesome.min.css';

const apiKey = '9318257-96b567a3bb5708a16f509a99b';
//axios.defaults.headers.common['x-api-key'] = apiKey;

const body = document.querySelector('body');
body.style.fontFamily = 'Verdana';
body.style.backgroundColor = '#f9f4e7';
body.style.display = 'flex';
body.style.flexDirection = 'column';
body.style.alignItems = 'center';

const titleElement = document.createElement('h1');
titleElement.textContent = 'Image Search App';
titleElement.style.fontWeight = 'bold';
titleElement.style.textAlign = 'center';
titleElement.style.marginTop = '20px';
body.prepend(titleElement);

const searchForm = document.getElementById('search-form');
searchForm.style.display = 'inline-block';
searchForm.style.position = 'relative';
searchForm.style.paddingTop = '15px';
searchForm.style.paddingBottom = '15px';
searchForm.style.background = '#007fff';

const searchInput = document.querySelector('input[name="searchQuery"]');
searchInput.style.width = '250px';

const searchBtn = document.querySelector('button[type="submit"]');
searchBtn.textContent = '';
const icon = document.createElement('i');
icon.className = 'fa fa-search';
searchBtn.append(icon);
searchBtn.style.position = 'absolute';
searchBtn.style.right = '0';

const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';
loadMoreBtn.style.textAlign = 'center';

const gallery = document.querySelector('.gallery');
gallery.style.listStyle = 'none';
gallery.style.display = 'flex';
gallery.style.alignItems = 'center';
gallery.style.justifyContent = 'center';
gallery.style.flexWrap = 'wrap';
gallery.style.gap = '20px';
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
  const card = document.createElement('li');
  card.classList.add('photo-card');
  card.innerHTML = `
        <div class="photo-image">
          <a href="${image.largeImageURL}" class="gallery-link">
            <img class="gallery-img"
              src="${image.webformatURL}"
              alt="${image.tags}"
              loading="lazy"
            />
          </a>
        </div>
        <div class="info">
          <p class="info-item">
            <b>Likes</b><br />
            ${image.likes}
          </p>
          <p class="info-item">
            <b>Views</b><br />
            ${image.views}
          </p>
          <p class="info-item">
            <b>Comments</b><br />
            ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b><br />
            ${image.downloads}
          </p>
        </div>
          `;
  gallery.append(card);
};

const adjustImageCards = () => {
  const photoCard = document.querySelectorAll('.photo-card');
  photoCard.forEach(item => {
    item.style.width = '350px';
    item.style.border = '1px solid #bab8c4';
    item.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.4)';
  });

  const photoImage = document.querySelectorAll('.photo-image');
  photoImage.forEach(item => {
    item.style.width = '100%';
    item.style.height = '230px';
    item.style.overflow = 'hidden';
  });

  const galleryImg = document.querySelectorAll('.gallery-img');
  galleryImg.forEach(item => {
    item.style.width = '100%';
    item.style.height = '100%';
    item.style.objectFit = 'cover';
  });

  const imageInfo = document.querySelectorAll('.info');
  imageInfo.forEach(item => {
    item.style.display = 'flex';
    item.style.fontSize = '12px';
    item.style.justifyContent = 'space-around';
  });
};

const fetchImages = async () => {
  try {
    loadMoreBtn.style.display = 'none';
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
    adjustImageCards();

    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();

    //console.log(page);

    if (data.totalHits <= page * 40) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.style.display = 'inline';
    }
    page++;
  } catch (error) {
    Notiflix.Notify.failure(
      'Ooops... Something went wrong! Please, try again.'
    );
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
