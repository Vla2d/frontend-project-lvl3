import axios from 'axios';
import parseRSS from './parser.js';

export default (link, state) => {
  const isUnique = state.urls.includes(link);
  if (isUnique) {
    state.urls.push(link);
  }

  const buildUrl = (originalLink) => {
    const url = new URL('https://allorigins.hexlet.app/get');
    url.searchParams.set('disableCache', 'true');
    url.searchParams.set('url', originalLink);

    return url;
  };

  const url = buildUrl(link);
  const parsedData = axios.get(url).then((res) => parseRSS(res.data.contents));
  return parsedData;
};
