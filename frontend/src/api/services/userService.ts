import toast from "react-hot-toast";
import { USER_ENDPOINTS } from "../api";
import { apiConnector } from "../apiConnector";
import type { AxiosResponse } from "axios";
import type { AppDispatch } from "../../redux/store";
import { setToken, setUser } from "../../redux/slices/userSlice";
import type { NavigateFunction } from "react-router-dom";
import type { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";


export interface SIGN_IN_DATA {
    username: string,
    password: string,
    firstName: string,
    lastName: string
}


export const signin = (data: SIGN_IN_DATA, navigate: NavigateFunction, removeLoading: ActionCreatorWithoutPayload) => async (dispatch: AppDispatch) => {
    try {
        console.log(data)
        const response: AxiosResponse = await apiConnector({ method: "POST", url: USER_ENDPOINTS.SIGNIN, data });
        toast.success(response.data.message);
        dispatch(setToken(response.data.data));
        navigate('/')
    } catch (error: any) {
        toast.error(error.response.message)
    } finally {
        dispatch(removeLoading())
    }
}

export interface LOG_IN_DATA {
    username: string,
    password: string
}

export const login = (data: LOG_IN_DATA, navigate: NavigateFunction, removeLoading: ActionCreatorWithoutPayload) => async (dispatch: AppDispatch) => {
    try {
        const response: AxiosResponse = await apiConnector({ method: "POST", url: USER_ENDPOINTS.LOGIN, data });
        toast.success(response.data.message);
        console.log(response)
        dispatch(setToken(response.data.data));
        navigate('/')
    } catch (error: any) {
        toast.error(error.response.message)
    } finally {
        dispatch(removeLoading())
    }
}


export const getProfile = (token: String) => async (dispatch: AppDispatch) => {
    try {
        const response = await apiConnector({ method: "GET", url: USER_ENDPOINTS.GET_PROFILE, headers: { Authorization: `Bearer ${token}` } });
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
    } catch (error: any) {
        toast.error(error.response.message)
    }
}


export interface UPDATE_DATA {
    firstName: String,
    lastName: String,
    password: String
}


export const updateUser = async (data: UPDATE_DATA, token: String) => {
    try {
        const response = await apiConnector({ method: "PUT", url: USER_ENDPOINTS.UPDATE, data, headers: { Authorization: `Bearer ${token}` } });
        toast.success(response.data.message);
    } catch (error: any) {
        toast.error(error.response.message)
    }
}

export const findUser = async (query: String, token: String) => {
    try {
        const response = await apiConnector({ method: "GET", url: `${USER_ENDPOINTS.FIND_USER}/${query}`, headers: { Authorization: `Bearer ${token}` } });
        return response.data.data;
    } catch (error: any) {
        toast.error(error.response.message)
    }
}


export const findUsername = async (username: String) => {
    try {
        const response = await apiConnector({ method: "GET", url: USER_ENDPOINTS.USERNAME_CHECK, data: { username } })
        return response.data
    } catch (error: any) {
        toast.error(error.response.message)
    }
}