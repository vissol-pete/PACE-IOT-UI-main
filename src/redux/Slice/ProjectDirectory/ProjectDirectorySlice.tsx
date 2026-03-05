import { createSlice } from "@reduxjs/toolkit";

export interface ProjectDirectoryState {
  // Project directory
  allProjectsData: any;
  addProjectState: string;
  selectedProjectId: string;

  // Project dashboard
  allSitesData: any;
  addSiteState: string;
  selectedSiteId: string;

  // User Management
  addUserState: string;
  selectedUserId: string;
}

const initialState: ProjectDirectoryState = {
  // Project directory
  allProjectsData: {},
  addProjectState: "new",
  selectedProjectId: "",

  // Project dashboard
  allSitesData: {},
  addSiteState: "new",
  selectedSiteId: "",

  // User Management
  addUserState: "new",
  selectedUserId: "",
};

export const ProjectDirectorySlice = createSlice({
  name: "projectDirectory",
  initialState,
  reducers: {
    // Project directory
    setAllProjectsData: (state, action) => {
      state.allProjectsData = action.payload;
    },
    setAddProjectState: (state, action) => {
      state.addProjectState = action.payload;
    },
    setSelectedProjectId: (state, action) => {
      state.selectedProjectId = action.payload;
    },

    // Project dashboard
    setAllSitesData: (state, action) => {
      state.allSitesData = action.payload;
    },
    setAddSiteState: (state, action) => {
      state.addSiteState = action.payload;
    },
    setSelectedSiteId: (state, action) => {
      state.selectedSiteId = action.payload;
    },

    // User Management
    setAddUserState: (state, action) => {
      state.addUserState = action.payload;
    },
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAllProjectsData,
  setAddProjectState,
  setSelectedProjectId,
  setAllSitesData,
  setAddSiteState,
  setSelectedSiteId,
  setAddUserState,
  setSelectedUserId,
} = ProjectDirectorySlice.actions;

// Project directory
export const selectAllProjectsData = (state: any) => state.projectDirectory.allProjectsData;
export const selectAddProjectState = (state: any) => state.projectDirectory.addProjectState;
export const selectProjectId = (state: any) => state.projectDirectory.selectedProjectId;

// Project dashboard
export const selectAllSitesData = (state: any) => state.projectDirectory.allSitesData;
export const selectAddSiteState = (state: any) => state.projectDirectory.addSiteState;
export const selectSiteId = (state: any) => state.projectDirectory.selectedSiteId;

// User Management
export const selectAddUserState = (state: any) => state.projectDirectory.addUserState;
export const selectUserId = (state: any) => state.projectDirectory.selectedUserId;

export default ProjectDirectorySlice.reducer;
