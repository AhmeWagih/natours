/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

export const addReview = async (tourId, review, rating) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/reviews",
      data: {
        tour: tourId,
        review,
        rating,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Review submitted successfully!");
      window.setTimeout(() => {
        location.reload();
      }, 700);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const toggleFavoriteTour = async (tourId) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/users/favorites/${tourId}`,
    });

    if (res.data.status === "success") {
      return res.data.data.favorites || [];
    }

    return [];
  } catch (err) {
    showAlert("error", err.response.data.message);
    return null;
  }
};

export const deleteTour = async (tourId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/tours/${tourId}`,
    });

    if (res.data.status === "success") {
      showAlert("success", "Tour deleted successfully!");
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const deleteUser = async (userId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/users/${userId}`,
    });

    if (res.data.status === "success") {
      showAlert("success", "User deleted successfully!");
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/bookings/${bookingId}`,
    });

    if (res.data.status === "success") {
      showAlert("success", "Booking deleted successfully!");
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/reviews/${reviewId}`,
    });

    if (res.data.status === "success") {
      showAlert("success", "Review deleted successfully!");
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
