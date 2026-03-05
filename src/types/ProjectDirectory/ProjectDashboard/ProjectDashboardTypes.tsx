export interface KPICardData {
  project_data: {
    project_name: string;
    logo_url: string;
    address_line_1: string;
    address_line_2: string;
    phone_number: string;
    total_sites: string;
    total_units: string;
  };
  active_alerts_data: {
    active_alerts: string;
    cmms_name: string;
    open_sky_spark_link: string;
    monthly_alerts: MonthlyData;
  };
  energy_savings_data: { total_savings: string; carbon_reduction_savings: string; monthly_usage: { [year: string]: MonthlyData } };
  electric_demand_last_15_min: string;
  sites_with_demand_response: string;
  dr_link: string;
}

interface MonthlyData {
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
}

export interface ProjectDashboardRequestData {
  projectId: string;
  search_substring?: string;
  pageNumber?: string;
  pageSize?: string;
  sortOrder?: string;
  sortField?: string;
}
export interface AddSite {
  site_id?: string;
  name: string;
  country: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  phone_number: string;
  dr_event_enrolled: boolean;
  project_id: number;
}

export interface AllSitesList {
  site_id?: string;
  project_id: string;
  site_name: string;
}
export interface SitesTableRow {
  id?: string;
  activeAlerts: string;
  units: string;
  name: string;
  country: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  phone_number: string;
  dr_event_enrolled: boolean;
  dr_link: string;
  project_id: string;
  units_dr_enrolled: number;
}

export interface UserAdminTableRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  // sites: string[];
  // sitesData: any;
}

export interface AddNewUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  project_id?: string;
  site?: string[];
}

export interface UserRequestData {
  search_substring?: string;
  pageNumber?: string;
  pageSize?: string;
  sortOrder?: string;
  sortField?: string;
  // role?: string;
  projectID: string;
}

// SiteDashboard

// UnitDashboard

export interface UnitsTableRow {
  id: string;
  unit_name: string;
  unit_serial_number: string;
  unit_brand: string;
  unit_model_number: string;
  dr_enrollment: string;
  dr_link: string;
  pace_ai_device_id: string;
  PACE_AIVersion: string;
  firmware: string;
  PACE_AIDeviceStatus: string;
  stage1_btuh: string;
  stage2_btuh: string;
  tonnage: string;
  main_voltage: string;
  main_phases: string;
}

export interface UnitsModelTableRow {
  id: string;
  unit_name: string;
  pace_ai_device_id: string;
  PACE_AIVersion: string;
  firmware: string;
}

export interface UnitsRequestData {
  search_substring?: string;
  pageNumber?: string;
  pageSize?: string;
  sortOrder?: string;
  sortField?: string;
  site_Id: string;
}
export interface UnitDashboardTableRow {
  id?: number;
  hvac_sn: string;
  current: string | number;
  kwh: string | number;
  therm_usage: string | number;
  temp_1: string | number;
  temp_2: string | number;
  temp_3: string | number;
  kw: string | number;
  kw_tonnage: string;
  running_status: string;
  timestamp: string;
  pace_ai_version: string;
  firmware_version: string;
  electric_demand_last_15min: number;
  device_id: string;
}

export interface AddUnit {
  unit_id?: string;
  name: string;
  serial_number: string;
  unit_brand: string;
  unit_model_number: string;
  stage_1_BTU?: string;
  stage_2_BTU?: string;
  tonnage?: string;
  main_voltage?: string;
  main_phases?: string;
  connectionStatus?: string;
  pace_ai_device_id?: string;
}
