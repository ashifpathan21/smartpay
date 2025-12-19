import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false
}

const pageSlice = createSlice({
    name: "Page",
    initialState,
    reducers: {
        setLoading(state) {
            state.isLoading = true;
        },
        removeLoading(state) {
            state.isLoading = false;
        }
    }
})


export const { setLoading, removeLoading } = pageSlice.actions;
export default pageSlice.reducer