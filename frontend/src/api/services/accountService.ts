import toast from "react-hot-toast";
import { ACCOUNT_ENDPOINTS } from "../api";
import { apiConnector } from "../apiConnector";
import type { AppDispatch } from "../../redux/store";
import type {  NavigateFunction } from "react-router-dom";
import type { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";



export const createAccount = async (token: String) => {
    const toastId = toast.loading("Creating an Account for you")
    try {
        const response = await apiConnector({ method: "POST", url: ACCOUNT_ENDPOINTS.CREATE, headers: { Authorization: `Bearer ${token}` } })
        toast.success(response.data.message)
    } catch (error: any) {
        toast.error(error.response.message)
    } finally {
        toast.dismiss(toastId)
    }
}

export const getBalance = async (token: String) => {
    const toastId = toast.loading("Fetching Your Balance")
    try {
        const response = await apiConnector({ method: "GET", url: ACCOUNT_ENDPOINTS.GET_BALANCE, headers: { Authorization: `Bearer ${token}` } })
        toast.success(response.data.message)
        return response.data.data
    } catch (error: any) {
        toast.error(error.response.message)
    } finally {
        toast.dismiss(toastId)
    }
}

export interface TRANSER_DATA {
    to: String,
    amount: Number,
    tag?: String
}

export const transferMoney = (token: String, data: TRANSER_DATA, removeLoading: ActionCreatorWithoutPayload, navigate: NavigateFunction) => async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Transfering Money")
    try {
        const res = await apiConnector({ method: "POST", url: ACCOUNT_ENDPOINTS.TRANSFER_AMOUNT, data, headers: { Authorization: `Bearer ${token}` } });
        toast.success(res.data.message);
    } catch (error: any) {
        toast.error(error.response.message)
    } finally {
        navigate("/")
        dispatch(removeLoading())
        toast.dismiss(toastId)
    }
}




export const getTranscations = async (token: String, friendId?: String) => {
    try {
        const response = await apiConnector({ method: "GET", url: `${ACCOUNT_ENDPOINTS.GET_TRANSACTIONS}/${friendId ?? ""}`, headers: { Authorization: `Bearer ${token}` } });
        return response.data
    } catch (error: any) {
        toast.error(error.response.message)
    }
}