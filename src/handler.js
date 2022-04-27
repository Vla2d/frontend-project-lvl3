/* eslint-disable no-param-reassign */
import loadRSS from './loader.js';
import updateRSS from './updater.js';
import isValidLink from './linkValidator.js';

export const handleAddFeed = (state) => {
  const link = state.feeds.feedLink;

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
      })
      .catch((err) => {
        state.form.state = 'failed';
        state.form.error = err;
      });
  } else {
    state.form.state = 'failed';
  }
};

export const handleReadPost = (state, postId) => {
  const post = state.posts[postId];

  if (!state.readPosts.includes(post)) {
    state.readPosts.push(post);
  }
};
