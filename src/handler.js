/* eslint-disable no-param-reassign */
import axios from 'axios';
import _ from 'lodash';
import parseRSS from './parser.js';
import validateLink from './validator.js';

const RSSLoader = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .then((res) => parseRSS(url, res.data.contents));

const links = [];

const RSSupdater = (state) => {
  const promises = links.map(RSSLoader);

  Promise.all(promises)
    .then((results) => {
      const posts = results.flatMap((result) => result.posts);

      const allPosts = _.union(posts, state.posts);
      const newPosts = _.differenceBy(allPosts, state.posts, 'url');

      if (newPosts.length > 0) {
        state.posts = [...newPosts, ...state.posts];
      }
    })
    .finally(() => {
      setTimeout(() => RSSupdater(state), 5000);
    });
};

const updateRSS = (link, state) => {
  links.push(link);

  if (state.updateProcess.state === 'idle') {
    state.updateProcess.state = 'running';
    setTimeout(() => RSSupdater(state), 5000);
  }
};

export const handleAddFeed = (e, state, i18nInstance) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const link = formData.get('url').trim();

  const error = validateLink(link, state.feeds);
  console.log('validate error: ', error);
  state.form.error = error;

  if (!error) {
    state.form.state = 'pending';

    RSSLoader(link)
      .then((res) => {
        console.log(res);
        state.feeds.unshift(res.feed);
        state.posts = [...res.posts, ...state.posts];
        state.urls.push(link);

        state.form.state = 'success';
        updateRSS(link, state);
        e.target.reset();
      })
      .catch((err) => {
        console.log(err);
        state.form.state = 'failed';
        if (err.isAxiosError) {
          state.form.error = i18nInstance.t('errors.netError');
        } else {
          state.form.error = i18nInstance.t('errors.invalidRSS');
        }
      });
  } else {
    state.form.state = 'failed';
  }
};

export const handleViewPost = (post) => {
  document.body.classList.add('modal-open');

  document.querySelector('#modal_title').textContent = post.title;
  document.querySelector('#modal_body').innerHTML = post.desc;
  document.querySelector('#modal_link').href = post.url;
  document.querySelector('#modal').classList.add('show');
};
