import { handleAddFeed, handleViewPost } from './handler.js';
import initView from './view.js';

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

  const watchedState = initView(state, elements);

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    handleAddFeed(e, watchedState);
  });

  const postsUl = document.getElementById('posts_list');
  postsUl.addEventListener('click', (event) => {
    const { target } = event;

    const currentPostId = target.getAttribute('data-id');
    state.modal.currentPost = state.posts[currentPostId];
    const post = state.modal.currentPost;

    if (target.tagName.toLowerCase() === 'a') {
      if (!watchedState.readPosts.includes(post)) {
        watchedState.readPosts.push(post);
      }
    }

    if (target.tagName.toLowerCase() === 'button') {
      if (!watchedState.readPosts.includes(post)) {
        watchedState.readPosts.push(post);
      }

      handleViewPost(post, watchedState);
    }
  });
};
