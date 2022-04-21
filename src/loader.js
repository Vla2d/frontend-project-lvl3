import axios from 'axios';
import parseRSS from './parser.js';

export default (url, state) => {
  const isUnique = state.urls.includes(url);
  if (isUnique) {
    state.urls.push(url);
  }

  return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
    .then((res) => parseRSS(res.data.contents));
};
