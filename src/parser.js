export default (content) => {
  const doc = new DOMParser().parseFromString(content, 'text/xml');
  const feedTitle = doc.querySelector('title').textContent;
  const feedDescription = doc.querySelector('description').textContent;

  if (!doc.querySelector('rss')) {
    return false;
  }

  const feed = {
    feedTitle, feedDescription,
  };

  const posts = [];

  doc.querySelectorAll('item')
    .forEach((post) => {
      const postTitle = post.querySelector('title').textContent;
      const postDescription = post.querySelector('description').textContent;
      const postLink = post.querySelector('link').textContent;

      const data = {
        title: postTitle, description: postDescription, url: postLink,
      };

      posts.push(data);
    });

  return { feed, posts };
};
