import { configureStore } from "@reduxjs/toolkit";

import AuthenticationSlice from "./Slice/Authentication/AuthenticationSlice";
import NavigationSlice from "./Slice/Navigation/NavigationSlice";
import ProjectDirectoryReducer from "./Slice/ProjectDirectory/ProjectDirectorySlice";
import SiteDirectorySlice from "./Slice/SiteDirectory/SiteDirectorySlice";
import UnitDirectorySlice from "./Slice/UnitDirectory/UnitDirectorySlice";
import AlertsSlice from "./Slice/Alerts/AlertsSlice";

export const store = configureStore({
  reducer: {
    authentication: AuthenticationSlice,
    navigation: NavigationSlice,
    projectDirectory: ProjectDirectoryReducer,
    siteDirectory: SiteDirectorySlice,
    unitDirectory: UnitDirectorySlice,
    alerts: AlertsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
