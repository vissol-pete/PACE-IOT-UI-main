import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

export interface NavigationState {
  breadcrumbText: string[];
  headerText: string;
}

const initialState: NavigationState = {
  breadcrumbText: ["Project directory"],
  headerText: "Project directory",
};

export const NavigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
    setBreadcrumbText: (state, action) => {
      state.breadcrumbText = action.payload;
    },
    setHeaderText: (state, action) => {
      state.headerText = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setBreadcrumbText, setHeaderText } = NavigationSlice.actions;

export const selectBreadcrumbText = (state: any) =>
  state.navigation.breadcrumbText;
export const selectHeaderText = (state: any) => state.navigation.headerText;

export default NavigationSlice.reducer;
