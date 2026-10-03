import {propertyDetailsAction} from "./propertyDetails-slice";
import {axiosInstance} from "../../../utils/axios";

//fetch details of one specific property using p-id
//recev p-id
//start loading
//call backend api
//wait for response
//get property data
//store details in redux
//if error store error in redux

export const getPropertyDetails = (id) => async(dispatch) => {
  try{
    dispatch(propertyDetailsAction.getListRequest());
    const response = await axiosInstance.get(`/v1/rent/listing/${id}`);
    const {data} =response.data;
    dispatch(propertyDetailsAction.getPropertyDetails(data));
  }
  catch(error){
    dispatch(propertyDetailsAction.getErrors(
      error.response?.data?.message || error.message || "Could not load property details.",
    ));
  }
}
