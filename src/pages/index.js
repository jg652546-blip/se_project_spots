import "./index.css";
import Api from "../scripts/api.js";
import {
  enableValidation,
  resetValidation,
  settings,
} from "../scripts/validation.js";

enableValidation(settings);

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "1f1b89d8-451a-4f2a-8ee6-17d0b5d1e3a3",
    "Content-Type": "application/json",
  },
});

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const editAvatarBtn = document.querySelector(".profile__avatar-edit-btn");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarCloseBtn = editAvatarModal.querySelector(".modal__close-btn");
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const editAvatarInput = editAvatarModal.querySelector("#profile-avatar-input");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const addCardFormElement = newPostModal.querySelector(".modal__form");
const descriptionInput = newPostModal.querySelector("#card-description-input");
const linkInput = newPostModal.querySelector("#card-image-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

function updateLikeButton(cardData, likeButton) {
  if (cardData.isLiked) {
    likeButton.classList.add("card__like-button-active");
  } else {
    likeButton.classList.remove("card__like-button-active");
  }
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  updateLikeButton(data, cardLikeBtnEl);

  cardLikeBtnEl.addEventListener("click", () => {
    const likeAction = data.isLiked
      ? api.removeLike(data._id)
      : api.addLike(data._id);

    likeAction
      .then((updatedCard) => {
        data.isLiked = updatedCard.isLiked;
        updateLikeButton(data, cardLikeBtnEl);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  cardDeleteBtnEl.addEventListener("click", () => {
    api
      .deleteCard(data._id)
      .then(() => {
        cardElement.remove();
      })
      .catch((err) => {
        console.error(err);
      });
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function renderCard(cardData, container) {
  const cardElement = getCardElement(cardData);
  container.append(cardElement);
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(modal);
    }
  });
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  api
    .updateUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  api
    .addCard({
      name: descriptionInput.value,
      link: linkInput.value,
    })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      addCardFormElement.reset();
      closeModal(newPostModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  api
    .updateAvatar({ avatar: editAvatarInput.value })
    .then((userData) => {
      profileAvatarEl.src = userData.avatar;
      editAvatarForm.reset();
      closeModal(editAvatarModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

editProfileBtn.addEventListener("click", () => {
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings,
  );
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
});

editAvatarBtn.addEventListener("click", () => {
  resetValidation(editAvatarForm, [editAvatarInput], settings);
  editAvatarInput.value = "";
  openModal(editAvatarModal);
});

editAvatarCloseBtn.addEventListener("click", () => {
  closeModal(editAvatarModal);
});

newPostBtn.addEventListener("click", () => {
  resetValidation(addCardFormElement, [descriptionInput, linkInput], settings);
  if (editProfileModal.classList.contains("modal_is-opened")) {
    closeModal(editProfileModal);
  }
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
addCardFormElement.addEventListener("submit", handleAddCardSubmit);
editAvatarForm.addEventListener("submit", handleEditAvatarSubmit);

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;
    cards.forEach((card) => {
      renderCard(card, cardsList);
    });
  })
  .catch((err) => {
    console.error(err);
  });
