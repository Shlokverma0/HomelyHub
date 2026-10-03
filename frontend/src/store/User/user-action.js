import { axiosInstance } from "../../utils/axios.js";
import { userActions } from "./user-slice.js";

const errorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong. Please try again.";

export const getSignup = (user) => async (dispatch) => {
  try {
    dispatch(userActions.getSignupRequest());
    const { data } = await axiosInstance.post("/v1/rent/user/signup", user);
    dispatch(userActions.getSignupDetails(data.user));
  } catch (error) {
    dispatch(userActions.getError(errorMessage(error)));
  }
};

export const getLogin = (user) => async (dispatch) => {
  try {
    dispatch(userActions.getLoginRequest());
    const { data } = await axiosInstance.post("/v1/rent/user/login", user);
    dispatch(userActions.getLoginDetails(data.user));
  } catch (error) {
    dispatch(userActions.getError(errorMessage(error)));
  }
};

export const currentUser = () => async (dispatch) => {
  try {
    dispatch(userActions.getCurrentRequest());
    const { data } = await axiosInstance.get("/v1/rent/user/me");
    dispatch(userActions.getCurrentUser(data.user));
  } catch {
    dispatch(userActions.getLogout(null));
  }
};

export const updateUser = (updatedUser) => async (dispatch) => {
  try {
    dispatch(userActions.getUpdateUserRequest());
    await axiosInstance.patch("/v1/rent/user/updateMe", updatedUser);
    const { data } = await axiosInstance.get("/v1/rent/user/me");
    dispatch(userActions.getCurrentUser(data.user));
  } catch (error) {
    dispatch(userActions.getError(errorMessage(error)));
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    await axiosInstance.post("/v1/rent/user/forgotPassword", { email });
  } catch (error) {
    dispatch(userActions.getError(errorMessage(error)));
  }
};

export const resetPassword = (passwords, token) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.patch(
      `/v1/rent/user/resetPassword/${token}`,
      passwords,
    );
    dispatch(userActions.getLoginDetails(data.user));
  } catch (error) {
    dispatch(userActions.getError(errorMessage(error)));
  }
};

export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch(userActions.getPasswordRequest());
    const { data } = await axiosInstance.patch(
      "/v1/rent/user/updateMyPassword",
      passwords,
    );
    dispatch(userActions.getLoginDetails(data.user));
    dispatch(userActions.getPasswordSuccess(true));
  } catch (error) {
    dispatch(userActions.getError(errorMessage(error)));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axiosInstance.get("/v1/rent/user/logout");
  } finally {
    dispatch(userActions.getLogout(null));
  }
};
