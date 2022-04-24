import i18next from 'i18next';
import { setLocale } from 'yup';
import ru from './locales/ru.js';
import { handleAddFeed, handleViewPost, handleReadPost } from './handler.js';
import initView from './view.js';
import elements from './selectors.js';

export default () => {
  const state = {
    lang: 'ru',
    urls: [],
    feeds: [],
    posts: [],
    form: {
      state: 'filling',
      error: null,
    },
    updateProcess: {
      state: 'idle',
    },
    readPosts: [],
    modal: { currentPost: null },
  };

  const i18nInstance = i18next.createInstance();

  i18nInstance.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    setLocale({
      mixed: {
        notOneOf: () => i18nInstance.t('loadStatus.sameUrl'),
      },
      string: {
        url: () => i18nInstance.t('loadStatus.invalidUrl'),
      },
    });
  });

  const watchedState = initView(state, elements, i18nInstance);

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAddFeed(e, watchedState, i18nInstance);
  });

  const postsUl = document.getElementById('posts_list');
  postsUl.addEventListener('click', (event) => {
    const { target } = event;
    const currentPostId = target.getAttribute('data-id');
    watchedState.modal.currentPost = watchedState.posts[currentPostId];

    if (target.getAttribute('class').includes('view-post')) {
      handleReadPost(watchedState);
    }

    if (target.getAttribute('class').includes('view-post') && target.tagName.toLowerCase() === 'button') {
      handleReadPost(watchedState);
      
      handleViewPost(watchedState);
    }
  });
};
