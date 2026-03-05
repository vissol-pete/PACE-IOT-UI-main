import { createSlice } from "@reduxjs/toolkit";

export interface AuthenticationState {
  userRole: string;
  email: string;
}

const initialState: AuthenticationState = {
  userRole: "",
  email: "",
};

export const AuthenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserRole, setUserEmail } = AuthenticationSlice.actions;

export const selectUserRole = (state: any) => state.authentication.userRole;
export const selectUserEmail = (state: any) => state.authentication.email;

export default AuthenticationSlice.reducer;
