import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertType, AlertsState } from "../../../types/Alerts/AlertTypes";

// Default state for alerts
const initialState: AlertsState = {
  active_alerts: [],
};

export const AlertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlertsData: (state, action: PayloadAction<AlertType[]>) => {
      state.active_alerts = action.payload;
    },
  },
});

export const { setAlertsData } = AlertsSlice.actions;

export const selectActiveAlerts = (state: { alerts: AlertsState }) => state.alerts.active_alerts;

export default AlertsSlice.reducer;
