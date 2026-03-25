/* eslint-disable */
import "@babel/polyfill";
import { login, logout, signup } from "./login";
import { displayMap } from "./mapbox";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";
import { addReview, toggleFavoriteTour, deleteTour, deleteUser, deleteBooking, deleteReview } from "./tourActions";

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form_login");
const signupForm = document.querySelector(".form_signup");
const userForm = document.querySelector(".form-user-data");
const userFormPassword = document.querySelector(".form-user-password");
const logoutBtn = document.querySelector(".nav__el--logout");
const bookBtn = document.getElementById("book-tour");
const favoriteBtn = document.getElementById("favorite-tour");
const reviewForm = document.querySelector(".form-review");

if (mapBox && mapBox.dataset.locations) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("confirm-password").value;
    signup(name, email, password, passwordConfirm);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (userForm) {
  userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    const userId = userForm.dataset.userId;
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    updateSettings(userId, "data", form);
  });
}

if (userFormPassword) {
  userFormPassword.addEventListener("submit", async (e) => {
    e.preventDefault();
    const saveBtn = document.querySelector(".saving");
    saveBtn.textContent = "Updating...";

    const currentPassword = document.getElementById("current-password").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    await updateSettings(
      { currentPassword, password, confirmPassword },
      "password",
    );

    saveBtn.textContent = "Save password";
    document.getElementById("current-password").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirm-password").value = "";
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (favoriteBtn) {
  favoriteBtn.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    const { tourId } = btn.dataset;
    btn.disabled = true;

    const favorites = await toggleFavoriteTour(tourId);

    if (!favorites) {
      btn.disabled = false;
      return;
    }

    const isNowFavorite = favorites.some(
      (id) => id.toString() === tourId.toString(),
    );

    if (isNowFavorite) {
      btn.classList.add("favorite--active");
    } else {
      btn.classList.remove("favorite--active");
    }
    btn.disabled = false;
  });
}

if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { tourId } = reviewForm.dataset;
    const review = document.getElementById("review").value;
    const rating = Number(document.getElementById("rating").value);

    await addReview(tourId, review, rating);
  });
}

// Delete button handlers for admin panel
const deleteTourBtns = document.querySelectorAll(".btn-admin-delete[data-tour-id]");
deleteTourBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const { tourId } = btn.dataset;
    if (confirm("Are you sure you want to delete this tour?")) {
      deleteTour(tourId);
    }
  });
});

const deleteUserBtns = document.querySelectorAll(".btn-admin-delete[data-user-id]");
deleteUserBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const { userId } = btn.dataset;
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId);
    }
  });
});

const deleteBookingBtns = document.querySelectorAll(".btn-admin-delete[data-booking-id]");
deleteBookingBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const { bookingId } = btn.dataset;
    if (confirm("Are you sure you want to delete this booking?")) {
      deleteBooking(bookingId);
    }
  });
});

const deleteReviewBtns = document.querySelectorAll(".btn-admin-delete[data-review-id]");
deleteReviewBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const { reviewId } = btn.dataset;
    if (confirm("Are you sure you want to delete this review?")) {
      deleteReview(reviewId);
    }
  });
});
