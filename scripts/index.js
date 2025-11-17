const editProfilebtn = document.querySelector(".profile__edit-btn");
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

// Create the form submission handler.
function handleAddCardSubmit(evt) {
  evt.preventDefault(); 
  console.log(nameInput.value);
  console.log(linkInput.value);
  newPostModal.classList.remove("modal_is-opened");
}

addCardFormElement.addEventListener('submit', handleAddCardSubmit);

const profilenamel = document.querySelector(".profile__name");
const profiledescriptionl = document.querySelector(".profile__description");

editProfilebtn.addEventListener("click", function () {
  editProfileNameInput.value = profilenamel.textContent;
  editProfileDescriptionInput.value = profiledescriptionl.textContent;
  editProfileModal.classList.add("modal_is-opened");
});

editProfileClosebtn.addEventListener("click", function () {
  editProfileModal.classList.remove("modal_is-opened");
});

newPostbtn.addEventListener("click", function () {
  newPostModal.classList.add("modal_is-opened");
});

newPostClosebtn.addEventListener("click", function () {
  newPostModal.classList.remove("modal_is-opened");
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profilenamel.textContent = editProfileNameInput.value;
  profiledescriptionl.textContent = editProfileDescriptionInput.value;
  editProfileModal.classList.remove("modal_is-opened");
}

editProfileForm.addEventListener("submit",handleEditProfileSubmit);
