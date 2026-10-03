//state manager
// all list properties
//count
//search filters
//loading flag
//error

import {createSlice} from '@reduxjs/toolkit'

const propertySlice = createSlice({
  name:"property",
  initialState:{
    properties:[],
    totalProperties: 0,
    searchParams: {},
    error:null,
    loading: false 
  },
  reducers:{
    getRequest(state){
      state.loading = true;
      state.error = null;
    },
    getProperties(state,action){
      state.properties = action.payload.data;
      state.totalProperties = action.payload.all_properties ?? action.payload.data.length;
      state.loading = false; //req finished => hide the loader
    },
    updateSearchParams:(state,action)=>{
      for (const [key, value] of Object.entries(action.payload)) {
        if (value === "" || value === null || value === undefined) {
          delete state.searchParams[key];
        } else {
          state.searchParams[key] = value;
        }
      }
    },
    getErrors(state,action){
      state.error = action.payload;
      state.loading = false;
    },
    clearErrors(state){
      state.error = null;
    }

  }
})

export const propertyAction = propertySlice.actions
export default propertySlice.reducer;
