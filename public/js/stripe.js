
/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);
    // 2) Redirect to hosted Stripe Checkout page using Session URL
    window.location.assign(session.data.session.url);
  } catch (err) {
    console.log(err);
    showAlert("error", err.response?.data?.message);
  }
};