import toast from "react-hot-toast";
import { USER_ENDPOINTS } from "../api";
import { apiConnector } from "../apiConnector";
import type { AxiosResponse } from "axios";
import type { AppDispatch } from "../../redux/store";
import { deleteToken, setToken, setUser } from "../../redux/slices/userSlice";
import type { NavigateFunction } from "react-router-dom";
import type { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";


export interface SIGN_IN_DATA {
    username: string,
    password: string,
    firstName: string,
    lastName: string
}


export const signin = (data: SIGN_IN_DATA, navigate: NavigateFunction, removeLoading: ActionCreatorWithoutPayload) => async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Creating Account")
    try {
        const response: AxiosResponse = await apiConnector({ method: "POST", url: USER_ENDPOINTS.SIGNIN, data });
        toast.success(response.data.message);
        dispatch(setToken(response.data.data));
        navigate('/login')
    } catch (error: any) {
        toast.error(error.response.data.message)
    } finally {
        dispatch(removeLoading())
        toast.dismiss(toastId)
    }
}

export interface LOG_IN_DATA {
    username: string,
    password: string
}

export const login = (data: LOG_IN_DATA, navigate: NavigateFunction, removeLoading: ActionCreatorWithoutPayload) => async (dispatch: AppDispatch) => {
    const toastId = toast.loading("logging In")
    try {
        const response: AxiosResponse = await apiConnector({ method: "POST", url: USER_ENDPOINTS.LOGIN, data });
        toast.success(response.data.message);
        dispatch(setToken(response.data.data));
        navigate('/')
    } catch (error: any) {
        toast.error(error.response.data.message)
    } finally {
        dispatch(removeLoading())
        toast.dismiss(toastId)
    }
}


export const getProfile = (token: string, navigate: NavigateFunction) => async (dispatch: AppDispatch) => {
    try {
        const response = await apiConnector({ method: "GET", url: USER_ENDPOINTS.GET_PROFILE, headers: { Authorization: `Bearer ${token}` } });
        dispatch(setUser(response.data.data));
        navigate('/dashboard')
    } catch (error: any) {
        dispatch(deleteToken())
        navigate("/")
        toast.error(error.response.data.message)
    }
}


export interface UPDATE_DATA {
    firstName: String,
    lastName: String,
    password: String
}


export const updateUser = (data: UPDATE_DATA, token: String, removeLoading: ActionCreatorWithoutPayload) => async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Updating your details")
    try {
        const response = await apiConnector({ method: "PUT", url: USER_ENDPOINTS.UPDATE, data, headers: { Authorization: `Bearer ${token}` } });
        toast.success(response.data.message);
    } catch (error: any) {
        toast.error(error.response.data.message)
    } finally {
        dispatch(removeLoading())
        toast.dismiss(toastId)
    }
}

export const findUser = async (query: String, token: String) => {
    try {
        const response = await apiConnector({ method: "GET", url: `${USER_ENDPOINTS.FIND_USER}/${query}`, headers: { Authorization: `Bearer ${token}` } });
        return response.data.data;
    } catch (error: any) {
        toast.error(error.response.data.message)
    }
}


export const findUsername = async (username: String) => {
    try {
        const response = await apiConnector({ method: "POST", url: USER_ENDPOINTS.USERNAME_CHECK, data: { username } })
        return response.data
    } catch (error: any) {
        toast.error(error.response.data.message)
    }
}

