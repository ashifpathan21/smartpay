import toast from "react-hot-toast";
import { ACCOUNT_ENDPOINTS } from "../api";
import { apiConnector } from "../apiConnector";
import type { AppDispatch } from "../../redux/store";
import { setTransactions } from "../../redux/slices/userSlice";



export const createAccount = async (token: String) => {
    try {
        const response = await apiConnector({ method: "POST", url: ACCOUNT_ENDPOINTS.CREATE, headers: { Authorization: `Bearer ${token}` } })
        toast.success(response.data.message)
    } catch (error: any) {
        toast.error(error.response.message)
    }
}

export const getBalance = async (token: String) => {
    try {
        const response = await apiConnector({ method: "GET", url: ACCOUNT_ENDPOINTS.GET_BALANCE, headers: { Authorization: `Bearer ${token}` } })
        return response.data
    } catch (error: any) {
        toast.error(error.response.message)
    }
}

export interface TRANSER_DATA {
    to: String,
    amount: Number,
    tag?: String
}

export const transferMoney = async (token: String, data: TRANSER_DATA) => {
    try {
        const res = await apiConnector({ method: "POST", url: ACCOUNT_ENDPOINTS.TRANSFER_AMOUNT, data, headers: { Authorization: `Bearer ${token}` } });
        toast.success(res.data.message);
    } catch (error: any) {
        toast.error(error.response.message)
    }
}


export const getTranscations = (token: String) => async (dispatch: AppDispatch) => {
    try {
        const response = await apiConnector({ method: "GET", url: ACCOUNT_ENDPOINTS.GET_TRANSACTIONS, headers: { Authorization: `Bearer ${token}` } });
        dispatch(setTransactions(response.data.data));
        toast.success(response.data.message)
    } catch (error: any) {
        toast.error(error.response.message)
    }
}

export const getTranscationsWithFriends = async (token: String, friendId: String) => {
    try {
        const response = await apiConnector({ method: "GET", url: `${ACCOUNT_ENDPOINTS.GET_TRANSACTIONS_WITH_FRIEND}/${friendId}`, headers: { Authorization: `Bearer ${token}` } });
        return response.data
    } catch (error: any) {
        toast.error(error.response.message)
    }
}