import axios from 'axios';
import { toast } from "react-toastify";
import { USER_LOAD_FAIL, 
    USER_LOAD_REQUEST, 
    USER_LOAD_RESET, 
    USER_LOAD_SUCCESS, 
    USER_LOGOUT_FAIL, 
    USER_LOGOUT_REQUEST, 
    USER_LOGOUT_SUCCESS, 
    USER_SIGNIN_FAIL, 
    USER_SIGNIN_REQUEST, 
    USER_SIGNIN_RESET, 
    USER_SIGNIN_SUCCESS } from '../constants/userConstant';




export const userSignInAction = (user) => async (dispatch) => {
    dispatch({ type: USER_SIGNIN_REQUEST });
    try {
        const { data } = await axios.post("/api/signin", user);
        let userInfo = { ...data };

        try {
            const profileRes = await axios.get("/api/me");
            const profileUser = profileRes?.data?.user;
            if (profileUser) {
                const fullName = `${profileUser.firstName || ""} ${profileUser.lastName || ""}`.trim();
                userInfo = {
                    ...data,
                    ...profileUser,
                    name: profileUser.name || fullName || profileUser.email || "User"
                };
            }
        } catch (profileError) {
            const fallbackName = `${data?.firstName || ""} ${data?.lastName || ""}`.trim();
            userInfo = {
                ...data,
                name: data?.name || fallbackName || data?.email || "User"
            };
        }

        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: userInfo
        });
        toast.success("Login Successfully!");
    } catch (error) {
        dispatch({
            type: USER_SIGNIN_FAIL,
            payload: error.response.data.error
        });
        toast.error(error.response.data.error);
    }
}

//log out action
export const userLogoutAction = () => async (dispatch) => {
    dispatch({ type: USER_LOGOUT_REQUEST });
    try {
        const { data } = await axios.get("/api/logout");
        dispatch({
            type: USER_LOGOUT_SUCCESS,
            payload: data
        });
        toast.success("Log out successfully!");
    } catch (error) {
        dispatch({
            type: USER_LOGOUT_FAIL,
            payload: error?.response?.data?.error || "Logout failed"
        });
        toast.warning("Logged out locally");
    } finally {
        localStorage.removeItem('userInfo');
        dispatch({ type: USER_SIGNIN_RESET });
        dispatch({ type: USER_LOAD_RESET });
    }
}


//user profile action
export const userProfileAction = () => async (dispatch) => {
    dispatch({ type: USER_LOAD_REQUEST });
    try {
        const { data } = await axios.get("/api/me");
        dispatch({
            type: USER_LOAD_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: USER_LOAD_FAIL,
            payload: error.response.data.error
        });
    }
}
