import i18next from 'i18next';
import { setLocale } from 'yup';
import { handleAddFeed } from './handler.js';
import initView from './view.js';
import ru from './locales/ru.js';

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
    readIds: new Set(),
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

  const elements = {
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

  const watchedState = initView(state, i18nInstance, elements);

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    handleAddFeed(e, watchedState, i18nInstance);
  });
};
