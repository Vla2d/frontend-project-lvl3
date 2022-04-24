import i18next from 'i18next';
import { setLocale } from 'yup';
import ru from './locales/ru.js';
import { handleAddFeed, handleViewPost, handleReadPost } from './handler.js';
import initView from './view.js';

export default () => {
  const state = {
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

  const { form } = elements;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAddFeed(e, watchedState, i18nInstance);
  });

  const postsUl = elements.posts;
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
