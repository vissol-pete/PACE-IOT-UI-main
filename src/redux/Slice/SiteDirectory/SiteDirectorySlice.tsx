import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SiteDashboardData } from "../../../types/SiteDirectory/SiteDirectoryTypes";

const defaultSiteData = {
  project_data: {
    project_name: "",
    logo_filename: "",
    logo_url: "",
    project_id: "",
  },
  site_data: {
    site_id: 0,
    site_name: "",
    address_line1: "",
    address_line2: "",
    total_units: 0,
    country: "",
  },
  energy_savings_data: {
    monthly_usage: {},
    total_savings: 0,
    carbon_reduction_savings: 0,
  },
  active_alerts_data: {
    active_alerts: 0,
    monthly_alerts: {
      JAN: 0,
      FEB: 0,
      MAR: 0,
      APR: 0,
      MAY: 0,
      JUN: 0,
      JUL: 0,
      AUG: 0,
      SEP: 0,
      OCT: 0,
      NOV: 0,
      DEC: 0,
    },
    cmms_name: "",
    cmms_link: "",
  },
  electric_demand_last_15_min: 0,
  dr_event_enrolled: false,
  download_operations_report: "",
};

export interface SiteDirectoryState {
  sitesData: SiteDashboardData;
  allUnitsData: any;
  addUnitState: string;
  selectedUnitId: string;
}

const initialState: SiteDirectoryState = {
  sitesData: defaultSiteData,
  allUnitsData: {},
  addUnitState: "new",
  selectedUnitId: "",
};

export const SiteDirectorySlice = createSlice({
  name: "siteDirectory",
  initialState,
  reducers: {
    setAllSitesData: (state, action: PayloadAction<SiteDashboardData>) => {
      state.sitesData = action.payload;
    },
    setAllUnitsData: (state, action) => {
      state.allUnitsData = action.payload;
    },
    setAddUnitState: (state, action) => {
      state.addUnitState = action.payload;
    },
    setSelectedUnitId: (state, action) => {
      state.selectedUnitId = action.payload;
    },
  },
});

export const { setAllSitesData, setAllUnitsData, setAddUnitState, setSelectedUnitId } = SiteDirectorySlice.actions;

export const selectAllSitesData = (state: { siteDirectory: SiteDirectoryState }) => state.siteDirectory.sitesData;
export const selectAllUnitsData = (state: { siteDirectory: SiteDirectoryState }) => state.siteDirectory.allUnitsData;
export const selectAddUnitState = (state: { siteDirectory: SiteDirectoryState }) => state.siteDirectory.addUnitState;
export const selectUnitId = (state: { siteDirectory: SiteDirectoryState }) => state.siteDirectory.selectedUnitId;

export default SiteDirectorySlice.reducer;
