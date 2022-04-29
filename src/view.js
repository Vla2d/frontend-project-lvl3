/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import i18next from 'i18next';

// View
const render = (state, elements, i18n) => {
  elements.addButton.textContent = i18n.t('buttons.add');
  elements.exampleText.textContent = i18n.t('content.example');
  elements.feedsTitle.textContent = i18n.t('content.feeds');
  elements.postsTitle.textContent = i18n.t('content.posts');
  elements.modalLink.textContent = i18n.t('modal.article');
  elements.modalClose.textContent = i18n.t('modal.close');

  const buildFeeds = (feeds, selectedElements) => {
    selectedElements.container.classList.remove('d-none');
    selectedElements.feeds.innerHTML = '';

    feeds.forEach((feed) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'list-group-item-dark');

      li.innerHTML = `
      <h3>${feed.feedTitle}</h3>
      <p>${feed.feedDescription}</p>
      `;

      selectedElements.feeds.append(li);
    });
  };

  const buildPosts = (posts, selectedElements, appState) => {
    selectedElements.posts.innerHTML = '';

    posts.forEach((post, index) => {
      post.id = index;
      const li = document.createElement('li');

      const isViewed = appState.readPosts.includes(post);

      li.classList.add('list-group-item', 'list-group-item-dark', 'd-flex', 'justify-content-between');
      li.innerHTML = `
        <a href="${post.url}" class="${isViewed ? 'fw-normal' : 'fw-bold'} view-post" target="_blank" data-id="${post.id}">
          ${post.title}
        </a>
        <button 
          type="button" 
          class="btn btn-primary btn-sm view-post"
          data-bs-toggle="modal"
          data-bs-target="#modal"
          data-id="${post.id}"
        >${i18n.t('buttons.preview')}
        </button>
      `;

      selectedElements.posts.append(li);
    });
  };

  // Render feeds
  if (state.feeds.length > 0) {
    buildFeeds(state.feeds, elements);
    buildPosts(state.posts, elements, state);
  } else {
    elements.container.classList.add('d-none');
  }
};

// Utils
const handleViewPost = (post, selectedElements) => {
  selectedElements.modalTitle.textContent = post.title;
  selectedElements.modalContent.innerHTML = post.description;
  selectedElements.modalLink.href = post.url;
};

const handleLoadStatusState = (state, selectedElements, i18n) => {
  switch (state) {
    case 'running':
      selectedElements.addButton.setAttribute('disabled', '');
      selectedElements.input.setAttribute('readonly', '');
      break;
    case 'success':
      selectedElements.input.value = '';

      selectedElements.addButton.removeAttribute('disabled');
      selectedElements.input.removeAttribute('readonly');
      selectedElements.infoText.textContent = i18n.t('loadStatus.success');
      break;
    case 'failed':
      selectedElements.addButton.removeAttribute('disabled');
      selectedElements.input.removeAttribute('readonly');
      break;
    default:
      throw new Error(`Unexpected state: ${state}`);
  }
};

const handleLoadStatusError = (error, selectedElements, i18n) => {
  selectedElements.infoText.textContent = '';

  selectedElements.input.classList.add('is-invalid');
  selectedElements.infoText.classList.add('text-danger');
  selectedElements.infoText.classList.remove('d-none');

  const handleErrorMessage = (errorType) => {
    switch (errorType) {
      case 'Parsing Error':
        return i18n.t('loadStatus.invalidRSS');
      case 'Network Error':
        return i18n.t('loadStatus.netError');
      default:
        throw new Error(`Unexpected error: ${errorType}`);
    }
  };

  selectedElements.infoText.innerHTML = handleErrorMessage(error);
};

const handleFormState = (state, selectedElements) => {
  switch (state) {
    case 'success':
      selectedElements.infoText.textContent = '';
      selectedElements.infoText.classList.remove('text-danger', 'text-success');
      selectedElements.input.classList.remove('is-invalid');

      selectedElements.infoText.classList.add('text-success');
      selectedElements.infoText.classList.remove('d-none');
      break;
    case 'failed':
      selectedElements.infoText.textContent = '';
      selectedElements.infoText.classList.remove('text-danger', 'text-success');
      selectedElements.input.classList.remove('is-invalid');

      selectedElements.input.classList.add('is-invalid');
      selectedElements.infoText.classList.add('text-danger');
      selectedElements.infoText.classList.remove('d-none');
      break;
    default:
      throw new Error(`Unexpected state: ${state}`);
  }
};

const handleFormError = (error, selectedElements, i18n) => {
  selectedElements.infoText.textContent = '';
  selectedElements.infoText.innerHTML = i18n.t(error);
};

// Watcher
const initView = (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'modal.currentPost':
        handleViewPost(value, elements);
        break;
      case 'loadStatus.state':
        handleLoadStatusState(value, elements, i18next);
        break;
      case 'loadStatus.errorType':
        handleLoadStatusError(value, elements, i18next);
        break;
      case 'form.state':
        handleFormState(value, elements);
        break;
      case 'form.error':
        handleFormError(value, elements, i18next);
        break;
      default:
        render(watchedState, elements, i18next);
        break;
    }
  });

  return watchedState;
};

export default initView;
