// propertyDetails

// create a slice
// create intital state
// request starts
// property data received
// error occurs
// export actions
// export slice

import {createSlice} from "@reduxjs/toolkit";
const propertyDetailsSlice = createSlice({
  name:"propertyDetails",
  initialState:{
    propertyDetails:null,
    loading:false,
    error:null
  },
  reducers:{
    getListRequest(state){
      state.loading = true; 
    },
    getPropertyDetails(state,action){
      state.propertyDetails = action.payload;
      state.loading = false;
    },
    getErrors(state,action){
      state.error = action.payload;
      state.loading = false;
    }
  }
  })

  export const propertyDetailsAction = propertyDetailsSlice.actions;
  export default propertyDetailsSlice;