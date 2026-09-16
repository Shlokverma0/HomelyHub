//managing booking

//store all bookings
//store individual booking details
//track the API loading status
// add new booking when a booking is created
//updating the booking data when we receive it from backend

import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  bookings:[],
  bookingDetails:{},
  loading:false
}
const bookingSlice = createSlice({
  name:"booking",
  initialState,
  reducers:{
    setBookingRequest(state){
      state.loading=true;
    },
    setBookings(state,action){
      state.bookings= action.payload;
      state.loading=false
    },
    addBooking:(state, action)=>{
      state.bookings.push(action.payload);
    },
    setBookingDetails:(state,action)=>{
      state.bookingDetails = action.payload.bookings;
    }
  }
})

export const {setBookings, addBooking, setBookingDetails} = bookingSlice.actions
export default bookingSlice;