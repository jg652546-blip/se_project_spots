import "./index.css";
import { enableValidation, settings } from "../scripts/validation.js";
import Api from "../utils/Api.js";

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);

const deleteModal = document.querySelector("#delete-modal");
const confirmDeleteBtn = deleteModal.querySelector(".modal__submit-btn");
let selectedCard;
let selectedCardId;

const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
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

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

const api = new Api({
  baseUrl:
    "https://around-api.en.tripleten-services.com/v1/469b4bea781e9fb77cddeacb",
  headers: {
    authorization: "a59d0436-cb47-46a9-86cf-8bac31dcde14",
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
  const isLiked = data.isLiked;
  cardLikeBtnEl.classList.toggle("card__like-button-active", isLiked);

  cardLikeBtnEl.addEventListener("click", () => {
    const request = cardLikeBtnEl.classList.contains("card__like-button-active")
      ? api.unlikeCard(data._id)
      : api.likeCard(data._id);

    request
      .then(() => {
        cardLikeBtnEl.classList.toggle("card__like-button-active");
      })
      .catch(console.error);
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  cardDeleteBtnEl.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  confirmDeleteBtn.addEventListener("click", () => {
    confirmDeleteBtn.textContent = "Deleting...";

    api
      .deleteCard(selectedCardId)
      .then(() => {
        selectedCard.remove();
        closeModal(deleteModal);
      })
      .catch(console.error)
      .finally(() => {
        confirmDeleteBtn.textContent = "Yes";
      });
  });

  const avatarModal = document.querySelector("#avatar-modal");
  const avatarForm = avatarModal.querySelector(".modal__form");
  const avatarInput = avatarModal.querySelector("#avatar-link-input");
  const avatarImage = document.querySelector(".profile__image");

  avatarForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const submitBtn = evt.submitter;
    submitBtn.textContent = "Saving...";

    api
      .updateAvatar({ avatar: avatarInput.value })
      .then((userData) => {
        avatarImage.src = userData.avatar;
        closeModal(avatarModal);
        avatarForm.reset();
      })
      .catch(console.error)
      .finally(() => {
        submitBtn.textContent = "Save";
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
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  submitBtn.disabled = true;

  api
    .addCard({
      name: descriptionInput.value,
      link: linkInput.value,
    })
    .then((card) => {
      const cardElement = getCardElement(card);
      cardsList.prepend(cardElement);
      addCardFormElement.reset();
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Create";
      submitBtn.disabled = false;
    });
}

addCardFormElement.addEventListener("submit", handleAddCardSubmit);

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

api
  .getUserInfo()
  .then((userData) => {
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
  })
  .catch((err) => {
    console.error(err);
  });

editProfileBtn.addEventListener("click", function () {
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings,
  );

  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  resetValidation(addCardFormElement, [descriptionInput, linkInput], settings);
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .editUserInfo({
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
      submitBtn.textContent = "Save";
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

api
  .getInitialCards()
  .then((cards) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

enableValidation(settings);
