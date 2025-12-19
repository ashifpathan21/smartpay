import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./slices/userSlice"
import PageReducer from "./slices/pageSlice"


const store = configureStore({
    reducer: {
        user: UserReducer,
        page: PageReducer
    }
})

export default store;
export type Store = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
