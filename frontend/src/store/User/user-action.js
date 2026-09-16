import {userActions} from "./user-slice.js";
import {axiosInstance} from "../../utils/axios.js";


//signup
export const getSignup = (user) => async(dispatch)=>{
  try {
      dispatch(userActions.getSignupRequest());
      const {data} = await axiosInstance.post("/v1/rent/user/signup", user)
      dispatch(userActions.getSignupDetails(data.user))
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message))
  }
} 

//login
export const getLogin = (user) => async(dispatch) =>{
  try {
    dispatch(userActions.getLoginRequest());
    const {data} = await axiosInstance.post("/v1/rent/user/login", user);
    dispatch(userActions.getLoginDetails(data.user))
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message))
  }
}

//current User

export const currentUser =() => async(dispatch) => {
  try {
    dispatch(userActions.getCurrentRequest());;
    const {data} = await axiosInstance.get("/v1/rent/user/me");
    dispatch(userActions.getCurrentUser(data.user))
  } catch (error) {
    dispatch(userActions.getLogout(null));
  }
}

//Update User

export const updateUser = (updateUser) => async(dispatch) => {
  try {
    dispatch(userActions.getUpdateUserRequest());
    const response = await axiosInstance.patch("/v1/rent/user/updateMe", updateUser);
    console.log(response)
    const {data} = await axiosInstance.get("/v1/rent/user/me")
    dispatch(userActions.getCurrentUser(data.user));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message))
  }
}

//Forgot Password

export const forgotPassword =(email) => async(dispatch)=>{
try {
  await axiosInstance.post("/v1/rent/user/forgotPassword", {email})
} catch (error) {
  dispatch(userActions.getError(error.response.data.message))
  }
}

//reset Password

export const resetPassword =(repassword, token) => async(dispatch)=>{
  try {
    await axiosInstance.patch(`/v1/rent/user/resetPassword/${token}`, repassword)
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message))
  }
}

//update Password

export const updatePassword=(passwords) => async(dispatch) => {
try {
  dispatch(userActions.getPasswordRequest());
  await axiosInstance.patch("/v1/rent/user/updateMyPassword", passwords)
  dispatch(userActions.getPasswordSuccess(true))
}catch (error) {
  dispatch(userActions.getError(error.response.data.message))
  }
}

//logout

export const logout =()=> async(dispatch)=>{
  try {
    await axiosInstance.get("/v1/rent/user/logout")
    dispatch(userActions.getLogout(null));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message))
  }
};