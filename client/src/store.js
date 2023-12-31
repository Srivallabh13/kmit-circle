import { configureStore } from "@reduxjs/toolkit";
import { userProfileReducer, userReducer } from "./Reducers/User";
import { postReducer, userPostReducer } from "./Reducers/Post";
import { blogReducer } from "./Reducers/Blog";

const store = configureStore({
    reducer: {
        user:userReducer,
        post: postReducer,
        userPosts: userPostReducer,
        userProfile: userProfileReducer,
        blog: blogReducer
    }
})

export default store