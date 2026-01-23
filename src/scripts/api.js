export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _request(path, options = {}) {
    return fetch(`${this._baseUrl}${path}`, {
      headers: this._headers,
      ...options,
    }).then(this._checkResponse);
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(new Error(`Error: ${res.status}`));
  }

  getUserInfo() {
    return this._request("/users/me");
  }

  getInitialCards() {
    return this._request("/cards");
  }

  updateUserInfo({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  addCard({ name, link }) {
    return this._request("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    });
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, {
      method: "DELETE",
    });
  }

  addLike(cardId) {
    return this._request(`/cards/${cardId}/likes`, {
      method: "PUT",
    });
  }

  removeLike(cardId) {
    return this._request(`/cards/${cardId}/likes`, {
      method: "DELETE",
    });
  }
}