const apiConfig = {
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "Bearer a85181f4-7f5a-4b54-8e47-0c62895ccae9",
    "Content-Type": "application/json",
  },
};

const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
};

const request = (path, options = {}) => {
  return fetch(`${apiConfig.baseUrl}${path}`, {
    headers: apiConfig.headers,
    ...options,
  }).then(handleResponse);
};

export const getUserInfo = () => {
  return request("/users/me");
};

export const getInitialCards = () => {
  return request("/cards");
};

export const updateProfile = ({ name, about }) => {
  return request("/users/me", {
    method: "PATCH",
    body: JSON.stringify({ name, about }),
  });
};

export const addCard = ({ name, link }) => {
  return request("/cards", {
    method: "POST",
    body: JSON.stringify({ name, link }),
  });
};

export const removeCard = (cardId) => {
  return request(`/cards/${cardId}`, {
    method: "DELETE",
  });
};

export const addLike = (cardId) => {
  return request(`/cards/${cardId}/likes`, {
    method: "PUT",
  });
};

export const removeLike = (cardId) => {
  return request(`/cards/${cardId}/likes`, {
    method: "DELETE",
  });
};

export const updateAvatar = ({ avatar }) => {
  return request("/users/me/avatar", {
    method: "PATCH",
    body: JSON.stringify({ avatar }),
  });
};
