import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        name: null,
        email: null,
        userID: null,
        user_type: null,
        profile_image: null,
    },
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },

        setEmail : (state, action) => {
            state.email = action.payload;
        },

        setUserID: (state, action) => {
            state.userID = action.payload;
        },

        setUserType: (state, action) => {
            state.user_type = action.payload;
        },

        setProfileImage: (state, action) => {
            state.profile_image = action.payload;
        },
    },
});

export const {setName,setEmail,setUserID,setUserType,setProfileImage} = userSlice.actions;
export default userSlice.reducer;