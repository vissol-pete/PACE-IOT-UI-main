export interface AlertType {
  alert_id: string;
  project_name: string;
  unit_name: string;
  timestamp: string;
  unit_id: string;
  message: string;
  project_id: string;
  site_id: string;
  site_name: string;
}

export interface AlertsState {
  active_alerts: AlertType[];
}


export interface AlertStatsParams {
  field: "unit" | "site" | "project";
  id: string | number;
}

// ALL TYPES FOR ALERT CONFIG UNDER

// Define a type for individual reminder recipients
export interface PhoneNumber {
  country_code: string;
  base: string;
}

export interface ReminderRecipient {
  reminders: string | null;
  email: string;
  phone_number: PhoneNumber;
}

// Define config for pressure and refrigeration_line_temp alerts
export interface PressureConfig {
  above_psi: string;
  below_psi: string;
  below_window_hr: string;
  above_window_hr: string;
}

export interface RefrigerationConfig {
  above_degf: string;
  below_degf: string;
  below_window_hr: string;
  above_window_hr: string;
}

// Define config for delta_t alert
export interface DeltaTConfig {
  sense_1: DeltaTSensorConfig;
  sense_2: DeltaTSensorConfig;
  sense_3: DeltaTSensorConfig;
  window_hr: string;
  below_degF: string;
}

export interface DeltaTSensorConfig {
  below_degF: string;
  above_degF: string;
}

// Use discriminated union for type-specific configurations
export type AlertConfig =
  | { type: "pressure"; config: PressureConfig; enabled: boolean }
  | { type: "refrigeration_line_temp"; config: RefrigerationConfig; enabled: boolean }
  | { type: "delta_t"; config: DeltaTConfig; enabled: boolean }
  | { type: "loss_connection"; enabled: boolean }
  | { type: "demand_response"; enabled: boolean };

// Define the full Alerts structure
export interface Alerts {
  pressure: Extract<AlertConfig, { type: "pressure" }>;
  refrigeration_line_temp: Extract<AlertConfig, { type: "refrigeration_line_temp" }>;
  loss_connection: Extract<AlertConfig, { type: "loss_connection" }>;
  demand_response: Extract<AlertConfig, { type: "demand_response" }>;
  delta_t: Extract<AlertConfig, { type: "delta_t" }>;
}

// Main type definition for the alert configuration response
export interface AlertConfigResponse {
  unit_id: string;
  alerts: Alerts;
  reminder_recipients: ReminderRecipient[];
}
