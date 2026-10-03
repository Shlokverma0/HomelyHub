import { axiosInstance } from "../../utils/axios.js";
import {
  addBooking,
  setBookingDetails,
  setBookingError,
  setBookingRequest,
  setBookings,
} from "./booking-slice.js";

const errorMessage = (error) =>
  error.response?.data?.message || error.message || "Could not complete the booking request.";

export const fetchBookingDetails = (bookingId) => async (dispatch) => {
  try {
    dispatch(setBookingRequest());
    const { data } = await axiosInstance.get(
      `/v1/rent/user/booking/${bookingId}`,
    );
    dispatch(setBookingDetails(data.data.booking));
  } catch (error) {
    dispatch(setBookingError(errorMessage(error)));
  }
};

export const fetchUserBookings = () => async (dispatch) => {
  try {
    dispatch(setBookingRequest());
    const { data } = await axiosInstance.get("/v1/rent/user/booking");
    dispatch(setBookings(data.data.bookings));
  } catch (error) {
    dispatch(setBookingError(errorMessage(error)));
  }
};

export const createBooking = (bookingDraft) => async (dispatch) => {
  try {
    dispatch(setBookingRequest());
    const { data } = await axiosInstance.post(
      "/v1/rent/user/booking",
      bookingDraft,
    );
    dispatch(addBooking(data.data.booking));
    return data.data.booking;
  } catch (error) {
    dispatch(setBookingError(errorMessage(error)));
    throw error;
  }
};
