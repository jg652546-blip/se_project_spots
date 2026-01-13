import "./index.css";
import Api from "../scripts/Api.js";
import {
  enableValidation,
  resetValidation,
  settings,
} from "../scripts/validation.js";

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);

const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

const addCardFormElement = newPostModal.querySelector(".modal__form");
const descriptionInput = newPostModal.querySelector("#card-description-input");
const linkInput = newPostModal.querySelector("#card-image-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

if (previewModalCloseBtn) {
  previewModalCloseBtn.addEventListener("click", () => {
    closeModal(previewModal);
  });
}

const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c56e30dc-2883-4270-a59e-b2f7bae969c6",
    "Content-Type": "application/json",
  },
});

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-button-active");
  }
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-button-active");
    const action = cardLikeBtnEl.classList.contains("card__like-button-active")
      ? api.removeLike(data._id)
      : api.addLike(data._id);

    action
      .then((updatedCard) => {
        cardLikeBtnEl.classList.toggle(
          "card__like-button-active",
          updatedCard.isLiked
        );
      })
      .catch((err) => {
        console.error(err);
      });
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
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

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: descriptionInput.value,
    link: linkInput.value,
  };

  api
    .addCard(inputValues)
    .then((cardData) => {
      renderCard(cardData, "prepend");
      addCardFormElement.reset();
      closeModal(newPostModal);
    })
    .catch((err) => {
      console.error(err);
    });
}

addCardFormElement.addEventListener("submit", handleAddCardSubmit);

function setProfileInfo(userData) {
  profileNameEl.textContent = userData.name;
  profileDescriptionEl.textContent = userData.about;
  profileAvatarEl.src = userData.avatar;
  profileAvatarEl.alt = userData.name;
}

editProfileBtn.addEventListener("click", function () {
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    validationConfig
  );

  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  resetValidation(
    addCardFormElement,
    [descriptionInput, linkInput],
    validationConfig
  );
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((userData) => {
      setProfileInfo(userData);
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error(err);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

api
  .getAppInfo()
  .then(([userData, cards]) => {
    setProfileInfo(userData);
    cards.forEach((card) => {
      renderCard(card);
    });
  })
  .catch((err) => {
    console.error(err);
  });

enableValidation(settings);
