import { createSlice } from "@reduxjs/toolkit";

const initialState: {
    user: object,
    token: string,
    transactions: object[]
} = {
    user: {},
    token: localStorage.getItem("token") || "",
    transactions: []
}

const userSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setToken(state, action) {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        deleteToken(state) {
            state.token = "";
            localStorage.removeItem("token");
        },
        setTransactions(state, action) {
            state.transactions = action.payload
        }
    }
})

export const { setUser, setToken, deleteToken, setTransactions } = userSlice.actions
export default userSlice.reducer;