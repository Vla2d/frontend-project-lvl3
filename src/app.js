import axios from 'axios';
import _ from 'lodash';
import i18next from 'i18next';
import * as yup from 'yup';
import ru from './locales/ru.js';
import initView from './view.js';

// Utils
// Parser
const parseRSS = (content) => {
  const doc = new DOMParser().parseFromString(content, 'text/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    const error = new Error('Parsing error');
    error.isParsingError = true;
    throw error;
  }

  const feedTitle = doc.querySelector('title').textContent;
  const feedDescription = doc.querySelector('description').textContent;

  const feed = {
    feedTitle, feedDescription,
  };

  const posts = [];

  doc.querySelectorAll('item')
    .forEach((post) => {
      const postTitle = post.querySelector('title').textContent;
      const postDescription = post.querySelector('description').textContent;
      const postLink = post.querySelector('link').textContent;

      const data = {
        title: postTitle, description: postDescription, url: postLink,
      };

      posts.push(data);
    });

  return { feed, posts };
};

// Validator
const isValidLink = (link, urls, i18n) => {
  const schema = yup.string()
    .url(i18n.t('loadStatus.invalidUrl'))
    .notOneOf(urls, i18n.t('loadStatus.sameUrl'));

  try {
    schema.validateSync(link);
    return null;
  } catch (e) {
    return e.message;
  }
};

// Loader
const buildProxyUrl = (originalLink) => {
  const url = new URL('https://allorigins.hexlet.app/get');
  url.searchParams.set('disableCache', 'true');
  url.searchParams.set('url', originalLink);

  return url;
};
const fetchRSS = (link) => axios.get(buildProxyUrl(link));

// Error handler
const getErrorType = (error) => {
  if (error.isParsingError) {
    return 'Parsing Error';
  } if (error.isAxiosError) {
    return 'Network Error';
  }
  return 'Unknown Error';
};

// Controllers
// Add feed
const handleAddFeed = (state, link) => {
  state.loadStatus.state = 'running';

  fetchRSS(link)
    .then((res) => parseRSS(res.data.contents))
    .then((res) => {
      res.feed.url = link;
      state.feeds.unshift(res.feed);

      state.posts = [...res.posts, ...state.posts];
      state.urls.push(link);

      state.loadStatus.state = 'success';
      state.form.state = 'success';
    })
    .catch((err) => {
      state.loadStatus.state = 'failed';
      state.form.state = 'failed';
      state.loadStatus.errorType = getErrorType(err);
    });
};

// Updater
const updateRSS = (state) => {
  const requests = state.feeds.map((item) => fetchRSS(item.url)
    .catch((err) => {
      state.loadStatus.state = 'failed';
      state.form.state = 'failed';
      state.loadStatus.errorType = getErrorType(err);
    })
    .then((res) => {
      const { feed } = parseRSS(res.data.contents);
      feed.url = res.data.status.url;

      const requestedPosts = parseRSS(res.data.contents).posts;
      const allPosts = _.union(requestedPosts, state.posts);
      const newPosts = _.differenceBy(allPosts, state.posts, 'url');
      if (newPosts.length > 0) {
        state.posts = [...newPosts, ...state.posts];
      }

      state.loadStatus.state = 'success';
    }));
  Promise.all(requests)
    .finally(() => {
      setTimeout(() => updateRSS(state), 5000);
    });
};

// Read post
const handleReadPost = (state, postId) => {
  const post = state.posts[postId];

  if (!state.readPosts.includes(post)) {
    state.readPosts.push(post);
  }
};

// Model
const app = () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url_input'),
    infoText: document.querySelector('#info_text'),
    addButton: document.querySelector('#add_button'),
    feeds: document.querySelector('#feeds_list'),
    posts: document.querySelector('#posts_list'),
    feedsTitle: document.querySelector('#feeds_title'),
    postsTitle: document.querySelector('#posts_title'),
    exampleText: document.querySelector('#example_text'),

    container: document.querySelector('#main_container'),

    modalTitle: document.querySelector('#modal_title'),
    modalContent: document.querySelector('#modal_body'),
    modalLink: document.querySelector('#modal_link'),
    modalClose: document.querySelector('#modal_close'),
  };

  const state = {
    urls: [],
    feeds: [],
    posts: [],
    form: {
      state: 'initial', // success, failed
      error: '',
    },
    loadStatus: {
      state: 'initial', // running, success, failed
      errorType: null,
    },
    readPosts: [],
    modal: { currentPost: null },
  };

  return i18next.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    const watchedState = initView(state, elements);

    const { form } = elements;
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const link = new FormData(e.target).get('url').trim();
      const validationError = isValidLink(link, watchedState.urls, i18next);
      if (validationError) {
        watchedState.form.state = 'failed';
        watchedState.form.error = validationError;
        return;
      }

      watchedState.form.state = 'success';
      handleAddFeed(watchedState, link);
    });

    const postsUl = elements.posts;
    postsUl.addEventListener('click', (event) => {
      const { target } = event;
      const currentPostId = target.getAttribute('data-id');
      watchedState.modal.currentPost = watchedState.posts[currentPostId];

      if (target.getAttribute('class').includes('view-post')) {
        handleReadPost(watchedState, target.getAttribute('data-id'));
      }
    });
    updateRSS(watchedState);
  });
};

export default app;
