/* eslint-disable no-param-reassign, import/prefer-default-export */
import * as yup from 'yup';

export const isValidLink = (link, state) => {
  const { urls } = state;

  const schema = yup.string().url().notOneOf(urls);

  try {
    schema.validateSync(link);
    return true;
  } catch (e) {
    state.form.error = e.message;
    state.form.state = 'failed';
    throw (e);
  }
};
