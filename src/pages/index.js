import "./index.css";
import {
  addCard,
  addLike,
  getInitialCards,
  getUserInfo,
  removeCard,
  removeLike,
  updateAvatar,
  updateProfile,
} from "../scripts/api.js";
import {
  enableValidation,
  resetValidation,
  settings,
  validationConfig,
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

const cardSubmitBtn = newPostModal.querySelector(".modal__submit-btn");

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

const deleteCardModal = document.querySelector("#delete-card-modal");
const deleteCardCloseBtn = deleteCardModal.querySelector(".modal__close-btn");
const deleteCardForm = deleteCardModal.querySelector(".modal__form");
const deleteCardSubmitBtn = deleteCardModal.querySelector(".modal__submit-btn");

const avatarModal = document.querySelector("#avatar-modal");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarLinkInput = avatarModal.querySelector("#avatar-link-input");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");

const profileAvatarBtn = document.querySelector(".profile__avatar-button");
const profileAvatarEl = document.querySelector(".profile__avatar");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;
let currentUserId;

const getOwnerId = (data) => data.owner?._id ?? data.owner;

const renderLoading = (isLoading, button, defaultText, loadingText) => {
  button.textContent = isLoading ? loadingText : defaultText;
};

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
    handleLikeCard(data, cardLikeBtnEl);
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  const ownerId = getOwnerId(data);
  if (ownerId && ownerId !== currentUserId) {
    cardDeleteBtnEl.remove();
  } else {
    cardDeleteBtnEl.addEventListener("click", () => {
      handleDeleteCard(cardElement, data);
    });
  }

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleLikeCard(data, likeButton) {
  const hasLiked = likeButton.classList.contains("card__like-button-active");
  const likeRequest = hasLiked ? removeLike : addLike;

  likeRequest(data._id)
    .then((updatedCard) => {
      if (updatedCard.isLiked) {
        likeButton.classList.add("card__like-button-active");
      } else {
        likeButton.classList.remove("card__like-button-active");
      }
    })
    .catch(console.error);
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteCardModal);
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

  renderLoading(true, cardSubmitBtn, "Save", "Saving...");
  addCard(inputValues)
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      addCardFormElement.reset();
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, cardSubmitBtn, "Save", "Saving...");
    });
}

addCardFormElement.addEventListener("submit", handleAddCardSubmit);

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const editProfileSubmitBtn =
  editProfileModal.querySelector(".modal__submit-btn");

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
  renderLoading(true, editProfileSubmitBtn, "Save", "Saving...");
  updateProfile({
    name: editProfileNameInput.value,
    about: editProfileDescriptionInput.value,
  })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, editProfileSubmitBtn, "Save", "Saving...");
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
