/* eslint-disable no-param-reassign, consistent-return, no-useless-return */
import * as yup from 'yup';

const isValidLink = (link, state) => {
  const { urls } = state;

  const schema = yup.string().url().notOneOf(urls);

  try {
    schema.validateSync(link);
    return true;
  } catch (e) {
    state.form.state = 'failed';
    e.isValidationError = true;
    state.form.error = e;
    return;
  }
};

export default isValidLink;
