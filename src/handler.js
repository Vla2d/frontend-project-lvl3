/* eslint-disable no-param-reassign */
import loadRSS from './loader.js';
import updateRSS from './updater.js';
import isValidLink from './linkValidator.js';

const getFeedData = (e) => {
  const formData = new FormData(e.target);
  const link = formData.get('url').trim();

  document.querySelector('#url_input').value = '';

  return link;
};

const addFeed = (e, state, i18nInstance) => {
  const link = getFeedData(e);
  const isValid = isValidLink(link, state);
  if (isValid) {
    state.form.state = 'pending';

    loadRSS(link, state)
      .then((res) => {
        state.feeds.unshift(res.feed);
        state.posts = [...res.posts, ...state.posts];
        state.urls.push(link);

        state.form.state = 'success';

        updateRSS(link, state);

        e.target.reset();
      })
      .catch((err) => {
        state.form.state = 'failed';
        if (err.isAxiosError) {
          state.form.error = i18nInstance.t('loadStatus.netError');
        }
        if (err.isParsingError) {
          state.form.error = i18nInstance.t('loadStatus.invalidRSS');
        }
      });
  } else {
    state.form.state = 'failed';
  }
};

export const handleAddFeed = (e, state, i18nInstance) => {
  addFeed(e, state, i18nInstance);
};

export const handleReadPost = (state) => {
  const post = state.modal.currentPost;

  if (!state.readPosts.includes(post)) {
    state.readPosts.push(post);
  }
};
