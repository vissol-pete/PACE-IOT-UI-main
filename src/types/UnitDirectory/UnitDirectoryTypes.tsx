export type UnitDataType = {
  unit_id: number;
  device_id: string;
  unit_name: string;
  unit_brand?: string;
  pace_ai_version: string;
  firmware_version: string;
  bin_data_last_15min: {
    timestamp: string;
    hvac_sn: string;
    current: number;
    kwh: number;
    therm_usage: number;
    temp1: number;
    temp2: number;
    temp3: number;
    kw: number;
    "kw/tonnage": string;
    running_status: boolean;
  };
  active_alerts_data: {
    active_alerts: number;
    monthly_alerts: {
      JAN: number;
      FEB: number;
      MAR: number;
      APR: number;
      MAY: number;
      JUN: number;
      JUL: number;
      AUG: number;
      SEP: number;
      OCT: number;
      NOV: number;
      DEC: number;
    };
    cmms_name: string;
    cmms_link: string;
  };
  electric_demand_last_15min: number;
  demand_response: boolean;
};

export type UpdateUnitType = {
  unit_id: number ;
  unit_name: string;
  unit_serial_num?: string;
  unit_brand?: string;
  unit_model_number?: string;
  device_id?: string | number;
  tonnage?: number;
  main_voltage?: number;
  main_phases?: number;
  stage1_btuh?: number;
  stage2_btuh?: number;
  settings?: boolean;
  pace_ai_device_action?: string;
  user?: string;
};


