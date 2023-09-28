import axios from 'axios';
import Notiflix from 'notiflix';

export async function fetchImages(page, searchQuery) {
  const apiKey = '9318257-96b567a3bb5708a16f509a99b';
  const searchParams = new URLSearchParams({
    key: apiKey,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page,
  });

  searchParams.set('q', searchQuery);
  searchParams.set('page', page);

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: searchParams,
    });
    const data = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    Notiflix.Notify.failure(
      'Ooops... Something went wrong! Please, try again.'
    );
  }
}
