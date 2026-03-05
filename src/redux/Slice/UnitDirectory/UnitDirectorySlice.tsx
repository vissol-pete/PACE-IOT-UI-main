import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UnitDataType } from "../../../types/UnitDirectory/UnitDirectoryTypes";

const defaultUnitData: UnitDataType = {
  unit_id: 0,
  unit_name: "Default Unit",
  bin_data_last_15min: {
    timestamp: "N/A",
    hvac_sn: "HVAC-0000",
    current: 0,
    kwh: 0,
    therm_usage: 0,
    temp1: 0,
    temp2: 0,
    temp3: 0,
    kw: 0,
    "kw/tonnage": "N/A",
    running_status: false,
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
  pace_ai_version: "N/A",
  firmware_version: "N/A",
  electric_demand_last_15min: 0,
  demand_response: false,
  device_id: "N/A"
};

export interface UnitDirectoryState {
  unitData: UnitDataType;
}

const initialState: UnitDirectoryState = {
  unitData: defaultUnitData,
};

export const UnitDirectorySlice = createSlice({
  name: "unitDirectory",
  initialState,
  reducers: {
    setAllUnitData: (state, action: PayloadAction<UnitDataType>) => {
      state.unitData = action.payload;
    },
  },
});

export const { setAllUnitData } = UnitDirectorySlice.actions;

export const selectAllUnitData = (state: { unitDirectory: UnitDirectoryState }) => state.unitDirectory.unitData;

export default UnitDirectorySlice.reducer;
