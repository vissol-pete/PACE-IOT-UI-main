import { AlertConfigResponse } from "../../../../../types/Alerts/AlertTypes";

export const defaultAlertConfig: AlertConfigResponse = {
  unit_id: "",
  alerts: {
    pressure: { type: "pressure", config: { above_psi: "", below_psi: "", below_window_hr: "", above_window_hr: "" }, enabled: false },
    refrigeration_line_temp: {
      type: "refrigeration_line_temp",
      config: { above_degf: "", below_degf: "", below_window_hr: "", above_window_hr: "" },
      enabled: false,
    },
    loss_connection: { type: "loss_connection", enabled: false },
    demand_response: { type: "demand_response", enabled: false },
    delta_t: {
      type: "delta_t",
      config: {
        sense_1: { below_degF: "", above_degF: "" },
        sense_2: { below_degF: "", above_degF: "" },
        sense_3: { below_degF: "", above_degF: "" },
        window_hr: "",
        below_degF: "",
      },
      enabled: false,
    },
  },
  reminder_recipients: [
    { reminders: null, email: "", phone_number: { country_code: "", base: "" } },
    { reminders: null, email: "", phone_number: { country_code: "", base: "" } },
    { reminders: null, email: "", phone_number: { country_code: "", base: "" } },
  ],
};