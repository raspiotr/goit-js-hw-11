import Notiflix from 'notiflix';
import axios from 'axios';

const apiKey = '9318257-96b567a3bb5708a16f509a99b';
//axios.defaults.headers.common['x-api-key'] = apiKey;

const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('input[name="searchQuery"]');
const searchBtn = document.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.loadmore');

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

const fetchImages = async () => {
  const response = await axios.get('https://pixabay.com/api/', {
    params: searchParams,
  });
  const data = response.data;
  console.log(data);
};

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const searchQuery = searchInput.value;
  console.log(searchQuery);
  searchParams.set('q', searchQuery);
  fetchImages();
});
