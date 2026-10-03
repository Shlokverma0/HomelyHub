import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    bookingDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    setBookingRequest(state) {
      state.loading = true;
      state.error = null;
    },
    setBookings(state, action) {
      state.bookings = action.payload;
      state.loading = false;
    },
    addBooking(state, action) {
      state.bookings.unshift(action.payload);
      state.bookingDetails = action.payload;
      state.loading = false;
    },
    setBookingDetails(state, action) {
      state.bookingDetails = action.payload;
      state.loading = false;
    },
    setBookingError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setBookingRequest,
  setBookings,
  addBooking,
  setBookingDetails,
  setBookingError,
} = bookingSlice.actions;
export default bookingSlice.reducer;
