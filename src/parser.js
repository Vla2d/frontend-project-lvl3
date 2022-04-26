export default (content) => {
  const doc = new DOMParser().parseFromString(content, 'text/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    const error = new Error('Parsing error');
    error.isParsingError = true;
    throw error;
  }

  const feedTitle = doc.querySelector('title').textContent;
  const feedDescription = doc.querySelector('description').textContent;

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
