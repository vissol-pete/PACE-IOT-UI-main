import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Collapse, Switch, TextField, MenuItem, Select, CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { getAlertConfig } from "../../../../../services/apis";
import { AlertConfigResponse, DeltaTConfig, DeltaTSensorConfig } from "../../../../../types/Alerts/AlertTypes";
import AlertRecipients from "./AlertRecipients";
import { defaultAlertConfig } from "./AlertHelper";

const AlertsSection = ({
  unitId,
  alertConfig,
  setAlertConfig,
  setUserChangesFlag,
}: {
  unitId: number;
  alertConfig: AlertConfigResponse;
  setAlertConfig: Function;
  setUserChangesFlag: Function;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Extract alert types from the alert config
  const connectiviyLossAlert = alertConfig.alerts.loss_connection.enabled;
  const demandResponse = alertConfig.alerts.demand_response.enabled;
  const deltaEnabled = alertConfig.alerts.delta_t.enabled;
  const deltaBelowF = alertConfig.alerts.delta_t.config?.below_degF;
  const deltaWindow = alertConfig.alerts.delta_t.config?.window_hr;
  const pressureEnabled = alertConfig.alerts.pressure.enabled;
  const pressureBelow = alertConfig.alerts.pressure.config.below_psi;
  const pressureAbove = alertConfig.alerts.pressure.config.above_psi;
  const pressureWindowBelow = alertConfig.alerts.pressure.config.below_window_hr;
  const pressureWindowAbove = alertConfig.alerts.pressure.config.above_window_hr;

  const refrigerationLineTempEnabled = alertConfig.alerts.refrigeration_line_temp.enabled;
  const refrigerationLineTempBelow = alertConfig.alerts.refrigeration_line_temp.config.below_degf;
  const refrigerationLineTempAbove = alertConfig.alerts.refrigeration_line_temp.config.above_degf;
  const refrigerationLineTempWindowBelow = alertConfig.alerts.refrigeration_line_temp.config.below_window_hr;
  const refrigerationLineTempWindowAbove = alertConfig.alerts.refrigeration_line_temp.config.above_window_hr;

  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    const fetchAlertConfig = async () => {
      setLoading(true);
      try {
        const response = await getAlertConfig(unitId);
        setAlertConfig(response);
      } catch (err) {
        console.error("Error fetching alert config", err);
        setAlertConfig({ ...defaultAlertConfig, unit_id: unitId }); // Fallback to default values
      } finally {
        setLoading(false);
      }
    };

    // If unitId is valid, fetch data, else set to default
    if (unitId !== 0) {
      fetchAlertConfig();
    } else {
      setAlertConfig({ ...defaultAlertConfig, unit_id: unitId });
    }

    // Reset alertConfig on unmount or when unitId changes
    return () => setAlertConfig({ ...defaultAlertConfig, unit_id: unitId });
  }, [unitId]);

  // Update sense values
  const senseKeys: Array<keyof DeltaTConfig> = ["sense_1", "sense_2", "sense_3"];

  // Update sense values
  const handleSenseChange = (senseKey: keyof DeltaTConfig, field: keyof DeltaTSensorConfig, value: string) => {
    setAlertConfig((prev: any) => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        delta_t: {
          ...prev.alerts.delta_t,
          config: {
            ...prev.alerts.delta_t.config,
            [senseKey]: {
              ...((prev.alerts.delta_t.config?.[senseKey] as DeltaTSensorConfig) || {}),
              [field]: value,
            },
          },
        },
      },
    }));
    setUserChangesFlag(true);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Alerts</Typography>
        <IconButton onClick={handleToggleExpand} size="small">
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        <Typography variant="caption" sx={{ fontSize: "12px", color: "text.secondary", mb: 2 }}>
          Note: Changing alerts will replace your current ones, and any active alerts will be deleted.
        </Typography>

        {/* Site-wide Notifications */}
        <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "normal", mt: 3 }}>
          Send site-wide notifications when:
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Switch
            checked={connectiviyLossAlert}
            onChange={() => {
              setAlertConfig({
                ...alertConfig,
                alerts: { ...alertConfig.alerts, loss_connection: { ...alertConfig.alerts.loss_connection, enabled: !connectiviyLossAlert } },
              });
              setUserChangesFlag(true);
            }}
          />
          <Typography>The device loses connectivity</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Switch
            checked={demandResponse}
            onChange={() => {
              setAlertConfig({
                ...alertConfig,
                alerts: { ...alertConfig.alerts, demand_response: { ...alertConfig.alerts.demand_response, enabled: !demandResponse } },
              });
              setUserChangesFlag(true);
            }}
          />
          <Typography>The device is experiencing a demand response event</Typography>
        </Box>

        {/* Individual Unit Notifications */}
        <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "normal", mt: 2 }}>
          Send individual unit notifications when:
        </Typography>

        {/* Delta T Condition */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Switch
            checked={deltaEnabled}
            onChange={() => {
              setUserChangesFlag(true);
              setAlertConfig({
                ...alertConfig,
                alerts: { ...alertConfig.alerts, delta_t: { ...alertConfig.alerts.delta_t, enabled: !deltaEnabled } },
              });
            }}
          />
          <Typography>Delta T drops below</Typography>
          <TextField
            disabled={!deltaEnabled}
            value={deltaBelowF}
            onChange={(e) => {
              setUserChangesFlag(true);
              setAlertConfig({
                ...alertConfig,
                alerts: {
                  ...alertConfig.alerts,
                  delta_t: { ...alertConfig.alerts.delta_t, config: { ...alertConfig.alerts.delta_t.config, below_degF: e.target.value } },
                },
              });
            }}
            variant="standard"
            size="small"
            sx={{ mx: 1, width: 50 }}
          />
          <Typography>°F for</Typography>
          <Select
            disabled={!deltaEnabled}
            value={deltaWindow}
            onChange={(e) => {
              setUserChangesFlag(true);
              setAlertConfig({
                ...alertConfig,
                alerts: {
                  ...alertConfig.alerts,
                  delta_t: { ...alertConfig.alerts.delta_t, config: { ...alertConfig.alerts.delta_t.config, window_hr: e.target.value } },
                },
              });
            }}
            variant="standard"
            size="small"
            sx={{ mx: 1, width: 60 }}
          >
            <MenuItem value="1">1 hr</MenuItem>
            <MenuItem value="2">2 hr</MenuItem>
          </Select>
        </Box>

        {/* Sense Configurations */}
        {senseKeys.map((senseKey) => (
          <Box key={senseKey} sx={{ display: "flex", alignItems: "center", pl: 8, mt: 1 }}>
            <Typography>{senseKey.replace("sense_", "Sense ")} is below</Typography>
            <TextField
              disabled={!deltaEnabled}
              variant="standard"
              size="small"
              sx={{ mx: 1, width: 50 }}
              value={(alertConfig.alerts.delta_t.config?.[senseKey] as DeltaTSensorConfig)?.below_degF || ""}
              onChange={(e) => handleSenseChange(senseKey, "below_degF", e.target.value)}
            />
            <Typography>°F is above</Typography>
            <TextField
              disabled={!deltaEnabled}
              variant="standard"
              size="small"
              sx={{ mx: 1, width: 50 }}
              value={(alertConfig.alerts.delta_t.config?.[senseKey] as DeltaTSensorConfig)?.above_degF || ""}
              onChange={(e) => handleSenseChange(senseKey, "above_degF", e.target.value)}
            />
            <Typography>°F</Typography>
          </Box>
        ))}

        {/* Pressure Condition */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Switch
            checked={pressureEnabled}
            onChange={() => {
              setUserChangesFlag(true);
              setAlertConfig((prev: any) => ({
                ...prev,
                alerts: {
                  ...prev.alerts,
                  pressure: {
                    ...prev.alerts.pressure,
                    enabled: !prev.alerts.pressure.enabled,
                  },
                },
              }));
            }}
          />

          <Typography>The pressure is below</Typography>
          <TextField
            disabled={!pressureEnabled}
            value={pressureBelow}
            onChange={(e) =>
              setAlertConfig({
                ...alertConfig,
                alerts: {
                  ...alertConfig.alerts,
                  pressure: { ...alertConfig.alerts.pressure, config: { ...alertConfig.alerts.pressure.config, below_psi: e.target.value } },
                },
              })
            }
            variant="standard"
            size="small"
            sx={{ mx: 1, width: 50 }}
          />
          <Typography>PSI for</Typography>
          <Select
            disabled={!pressureEnabled}
            value={pressureWindowBelow}
            onChange={(e) =>
              setAlertConfig({
                ...alertConfig,
                alerts: {
                  ...alertConfig.alerts,
                  pressure: { ...alertConfig.alerts.pressure, config: { ...alertConfig.alerts.pressure.config, below_window_hr: e.target.value } },
                },
              })
            }
            variant="standard"
            size="small"
            sx={{ mx: 1, width: 60 }}
          >
            <MenuItem value="1">1 hr</MenuItem>
            <MenuItem value="2">2 hr</MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1, pl: { xs: 8, sm: 19 } }}>
          <Typography>is above</Typography>
          <TextField
            disabled={!pressureEnabled}
            value={pressureAbove}
            onChange={(e) => {
              setUserChangesFlag(true);
              setAlertConfig({
                ...alertConfig,
                alerts: {
                  ...alertConfig.alerts,
                  pressure: { ...alertConfig.alerts.pressure, config: { ...alertConfig.alerts.pressure.config, above_psi: e.target.value } },
                },
              });
            }}
            variant="standard"
            size="small"
            sx={{ mx: 1, width: 50 }}
          />
          <Typography>PSI for</Typography>
          <Select
            disabled={!pressureEnabled}
            value={pressureWindowAbove}
            onChange={(e) => {
              setUserChangesFlag(true);
              setAlertConfig({
                ...alertConfig,
                alerts: {
                  ...alertConfig.alerts,
                  pressure: { ...alertConfig.alerts.pressure, config: { ...alertConfig.alerts.pressure.config, above_window_hr: e.target.value } },
                },
              });
            }}
            variant="standard"
            size="small"
            sx={{ mx: 1, width: 60 }}
          >
            <MenuItem value="1">1 hr</MenuItem>
            <MenuItem value="2">2 hr</MenuItem>
          </Select>
        </Box>

        {/* Refrigeration line temp */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Switch
            checked={refrigerationLineTempEnabled}
            onChange={() => {
              setUserChangesFlag(true);
              setAlertConfig((prev: any) => ({
                ...prev,
                alerts: {
                  ...prev.alerts,
                  refrigeration_line_temp: {
                    ...prev.alerts.refrigeration_line_temp,
                    enabled: !prev.alerts.refrigeration_line_temp.enabled,
                  },
                },
              }));
            }}
          />

          <Typography>Refrigeration line temp is below</Typography>
          <TextField
            disabled={!refrigerationLineTempEnabled}
            value={refrigerationLineTempBelow}
            onChange={(e) => {
              setUserChangesFlag(true);
              setAlertConfig({
                ...alertConfig,
                alerts: {
                  ...alertConfig.alerts,
                  refrigeration_line_temp: {
                    ...alertConfig.alerts.refrigeration_line_temp,
                    config: { ...alertConfig.alerts.refrigeration_line_temp.config, below_degf: e.target.value },
                  },
                },
              });
            }}
            variant="standard"
            size="small"
            sx={{ mx: 1, width: 50 }}
          />
          <Typography>°F for</Typography>
          <Select
            disabled={!refrigerationLineTempEnabled}
            value={refrigerationLineTempWindowBelow}
            onChange={(e) => {
              setUserChangesFlag(true);
              setAlertConfig({
                ...alertConfig,
                alerts: {
                  ...alertConfig.alerts,
                  refrigeration_line_temp: {
                    ...alertConfig.alerts.refrigeration_line_temp,
                    config: { ...alertConfig.alerts.refrigeration_line_temp.config, below_window_hr: e.target.value },
                  },
                },
              });
            }}
            variant="standard"
            size="small"
            sx={{ mx: 1, width: 60 }}
          >
            <MenuItem value="1">1 hr</MenuItem>
            <MenuItem value="2">2 hr</MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1, pl: { xs: 11, sm: 28 } }}>
          <Typography>is above</Typography>
          <TextField
            disabled={!refrigerationLineTempEnabled}
            value={refrigerationLineTempAbove}
            onChange={(e) => {
              setUserChangesFlag(true);
              setAlertConfig({
                ...alertConfig,
                alerts: {
                  ...alertConfig.alerts,
                  refrigeration_line_temp: {
                    ...alertConfig.alerts.refrigeration_line_temp,
                    config: { ...alertConfig.alerts.refrigeration_line_temp.config, above_degf: e.target.value },
                  },
                },
              });
            }}
            variant="standard"
            size="small"
            sx={{ mx: 1, width: 50 }}
          />
          <Typography>°F for</Typography>
          <Select
            disabled={!refrigerationLineTempEnabled}
            value={refrigerationLineTempWindowAbove}
            onChange={(e) => {
              setUserChangesFlag(true);
              setAlertConfig({
                ...alertConfig,
                alerts: {
                  ...alertConfig.alerts,
                  refrigeration_line_temp: {
                    ...alertConfig.alerts.refrigeration_line_temp,
                    config: { ...alertConfig.alerts.refrigeration_line_temp.config, above_window_hr: e.target.value },
                  },
                },
              });
            }}
            variant="standard"
            size="small"
            sx={{ mx: 1, width: 60 }}
          >
            <MenuItem value="1">1 hr</MenuItem>
            <MenuItem value="2">2 hr</MenuItem>
          </Select>
        </Box>

        {/* Recipients Section */}
        <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "normal", mt: 3 }}>
          Recipients
        </Typography>
        <Typography variant="caption" sx={{ fontSize: "12px", color: "text.secondary", mt: 1 }}>
          Note: Reminder emails are sent again based on frequency selection{" "}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <AlertRecipients recipients={alertConfig.reminder_recipients} alertConfig={alertConfig} setAlertConfig={setAlertConfig} />
        </Box>
      </Collapse>
    </Box>
  );
};

export default AlertsSection;
