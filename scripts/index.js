const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileClosebtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostbtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostClosebtn = newPostModal.querySelector(".modal__close-btn");

const addCardFormElement = newPostModal.querySelector(".modal__form");
const nameInput = newPostModal.querySelector("#card-description-input");
const linkInput = newPostModal.querySelector("#card-image-input");

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  console.log(nameInput.value);
  console.log(linkInput.value);

  closeModal(newPostModal);
}

addCardFormElement.addEventListener("submit", handleAddCardSubmit);

const profileNamel = document.querySelector(".profile__name");
const profileDescriptionl = document.querySelector(".profile__description");

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profilenamel.textContent;
  editProfileDescriptionInput.value = profiledescriptionl.textContent;

  openModal(editProfileModal);
});

editProfileClosebtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostbtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostClosebtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profilenamel.textContent = editProfileNameInput.value;
  profiledescriptionl.textContent = editProfileDescriptionInput.value;

  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
