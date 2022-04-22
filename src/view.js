/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import { setLocale } from 'yup';
import i18next from 'i18next';
import ru from './locales/ru.js';

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

const render = (state, elements) => {
  elements.addButton.textContent = i18nInstance.t('buttons.add');
  elements.exampleText.textContent = i18nInstance.t('content.example');
  elements.feedsTitle.textContent = i18nInstance.t('content.feeds');
  elements.postsTitle.textContent = i18nInstance.t('content.posts');
  elements.modalLink.textContent = i18nInstance.t('modal.article');
  elements.modalClose.textContent = i18nInstance.t('modal.close');

  const buildFeeds = (feeds) => {
    elements.container.classList.remove('d-none');
    elements.feeds.innerHTML = '';

    feeds.forEach((feed) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'list-group-item-dark');

      li.innerHTML = `
      <h3>${feed.feedTitle}</h3>
      <p>${feed.feedDescription}</p>
      `;

      elements.feeds.append(li);
    });
  };

  const buildPosts = (posts) => {
    elements.posts.innerHTML = '';

    posts.forEach((post) => {
      const li = document.createElement('li');

      const isViewed = state.readPosts.includes(post);

      li.classList.add('list-group-item', 'list-group-item-dark', 'd-flex', 'justify-content-between');
      li.innerHTML = `
        <a href="${post.url}" class="${isViewed ? 'fw-normal' : 'fw-bold'}" target="_blank" data-id="${post.id}">
          ${post.title}
        </a>
        <button 
          type="button" 
          class="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#modal"
          data-id="${post.id}"
        >${i18nInstance.t('buttons.preview')}
        </button>
      `;

      elements.posts.append(li);
    });
  };

  // Render feeds
  if (state.feeds.length > 0) {
    buildFeeds(state.feeds);
    buildPosts(state.posts);
  } else {
    elements.container.classList.add('d-none');
  }
};

export default (state, elements) => {
  const clearFeedback = () => {
    elements.infoText.textContent = '';
    elements.infoText.classList.remove('text-danger', 'text-success');
    elements.input.classList.remove('is-invalid');
  };

  const toggleForm = (status) => {
    elements.addButton.disabled = status;
    elements.input.readOnly = status;
  };

  const watchedState = onChange(state, (path, value) => {
    if (path === 'posts') {
      state.posts.forEach((item) => {
        item.id = state.posts.indexOf(item);
      });
    }
    if (path === 'form.state') {
      switch (value) {
        case 'pending':
          toggleForm(true);
          clearFeedback();
          break;
        case 'success':
          toggleForm(false);
          clearFeedback();
          elements.infoText.textContent = i18nInstance.t('loadStatus.success');
          elements.infoText.classList.add('text-success');
          elements.infoText.classList.remove('d-none');
          break;
        case 'failed':
          toggleForm(false);
          clearFeedback();
          elements.infoText.textContent = state.form.error;
          elements.input.classList.add('is-invalid');
          elements.infoText.classList.add('text-danger');
          elements.infoText.classList.remove('d-none');
          break;
        default:
          throw new Error(`Unexpected state: ${value}`);
      }
    } else if (path === 'form.error') {
      elements.infoText.textContent = '';
      if (value) {
        elements.input.classList.add('is-invalid');
        elements.infoText.classList.add('text-danger');
        elements.infoText.textContent = state.form.error;
      } else {
        elements.input.classList.remove('is-invalid');
        elements.infoText.classList.remove('text-danger');
      }
    } else if (path === 'lang') {
      clearFeedback();
      render(watchedState, elements);
    } else {
      render(watchedState, elements);
    }
  });

  return watchedState;
};
