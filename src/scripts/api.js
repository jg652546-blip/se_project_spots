const config = {
  baseUrl: "https://around.nomoreparties.co/v1/web_es_10",
  headers: {
    authorization: "1f1b89d8-451a-4f2a-8ee6-17d0b5d1e3a3",
    "Content-Type": "application/json",
  },
};

const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
};

const request = (url, options) => {
  return fetch(url, options).then(handleResponse);
};

const getInitialCards = () => {
  return request(`${config.baseUrl}/cards`, {
    headers: config.headers,
  });
};

export { getInitialCards };