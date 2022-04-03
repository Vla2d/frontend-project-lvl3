import _ from 'lodash';

export default (url, content) => {
  const doc = new DOMParser().parseFromString(content, 'text/xml');

  const feedId = _.uniqueId();

  const result = {
    feed: null,
    posts: [],
  };

  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;

  doc.querySelectorAll('item')
    .forEach((post) => {
      const postTitle = post.querySelector('title').textContent;
      const postDescription = post.querySelector('description').textContent;
      const postLink = post.querySelector('link').textContent;
      const postId = _.uniqueId();

      const data = {
        id: postId, feedId, title: postTitle, description: postDescription, url: postLink,
      };

      result.posts.push(data);
    });

  result.feed = {
    id: feedId, title, description, url,
  };

  return result;
};
