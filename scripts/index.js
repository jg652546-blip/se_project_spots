const editProfilebtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileClosebtn = editProfileModal.querySelector(".modal__close-btn");

const newPostbtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#edit-post-modal");
const newPostClosebtn = newPostModal.querySelector(".modal__close-btn");

editProfilebtn.addEventListener("click", function () {
  editProfileModal.classList.add("modal_is-opened");
});

editProfileClosebtn.addEventListener("click", function () {
  editProfileModal.classList.remove("modal_is-opened");
});
