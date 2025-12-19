const BASE_URL = import.meta.env.VITE_BASE_URL





export const USER_ENDPOINTS = {
    LOGIN: `${BASE_URL}/user/login`,
    SIGNIN: `${BASE_URL}/user/signin`,
    UPDATE: `${BASE_URL}/user/update`,
    USERNAME_CHECK: `${BASE_URL}/user/usernama`,
    GET_PROFILE: `${BASE_URL}/user/`,
    //:QUERY
    FIND_USER: `${BASE_URL}/user/find`,
}


export const ACCOUNT_ENDPOINTS = {
    CREATE: `${BASE_URL}/account/create`,
    GET_BALANCE: `${BASE_URL}/account/balance`,
    TRANSFER_AMOUNT: `${BASE_URL}/account/transfer`,
    GET_TRANSACTIONS: `${BASE_URL}/account/transactions`,
    //:ID
    GET_TRANSACTIONS_WITH_FRIEND: `${BASE_URL}/account/transactions`,
}