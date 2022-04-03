/* eslint-disable no-param-reassign */
import loadRSS from './loader.js';
import updateRSS from './updater.js';
import validateLink from './validator.js';

export const handleAddFeed = (e, state, i18nInstance) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const link = formData.get('url').trim();

  document.querySelector('#url_input').value = '';

  const error = validateLink(link, state.feeds);
  state.form.error = error;

  if (!error) {
    state.form.state = 'pending';

    loadRSS(link)
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
        } else {
          state.form.error = i18nInstance.t('loadStatus.invalidRSS');
        }
      });
  } else {
    state.form.state = 'failed';
  }
};

export const handleViewPost = (post) => {
  document.body.classList.add('modal-open');

  document.querySelector('#modal_title').textContent = post.title;
  document.querySelector('#modal_body').innerHTML = post.description;
  document.querySelector('#modal_link').href = post.url;
  document.querySelector('#modal').classList.add('show');
};
