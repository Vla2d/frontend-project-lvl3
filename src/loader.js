import axios from 'axios';
import parseRSS from './parser.js';

export default (link, state) => {
  const isUnique = state.urls.includes(link);
  if (isUnique) {
    state.urls.push(link);
  }

  function Url() {
    this.url = axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${link}`);
  }

  const parsedData = new Url(link).url.then((res) => parseRSS(res.data.contents));
  return parsedData;
};
