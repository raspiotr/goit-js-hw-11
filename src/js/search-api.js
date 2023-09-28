import axios from 'axios';
import Notiflix from 'notiflix';

export async function fetchImages(searchParams) {
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
