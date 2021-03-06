import fetch from 'isomorphic-unfetch';
import { assocPath, concat, __, compose, merge } from 'ramda';
import { isLoggedIn, getAccessToken } from '../client/auth';

async function fetchApi(link, params = {}) {
  const req = params.req || false;
  let uri = link;
  let options = merge({ method: 'GET' }, params.options || {});
  const authHeader = compose(assocPath(['headers', 'Authorization'], __, options), concat('token '));
  if (req) {
    uri = `${req.protocol}://${req.get('host')}${uri}`;
    if (req.cookies.token) {
      options = authHeader(req.cookies.token);
    }
  }
  return new Promise((res) => {
    if (isLoggedIn()) {
      return getAccessToken()
        .then(authHeader)
        .then(res);
    }
    return res(options);
  })
    .then(opts => fetch(uri, opts))
    .then(res => res.text())
    .then(res => JSON.parse(res));
}

const getApi = fetchApi;
const postApi = (link, body, params) => fetchApi(link, merge(params, {
  options: {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  },
}));
const putApi = (link, body, params) => fetchApi(link, merge(params, {
  options: {
    method: 'PUT',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  },
}));

export { getApi, putApi, postApi };

