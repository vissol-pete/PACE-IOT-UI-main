import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchAlerts } from "../../services/apis";
import { setBreadcrumbText, setHeaderText } from "../../redux/Slice/Navigation/NavigationSlice";
import { setAlertsData } from "../../redux/Slice/Alerts/AlertsSlice";
import AlertsTable from "../../features/Alerts/AlertsTable";
import { InfoFooter } from "../../features";
import { RootState } from "../../redux/store";
import { AlertsState } from "../../types/Alerts/AlertTypes";

export default function Alerts() {
  const dispatch = useDispatch();

  // Fetch alerts using useQuery with the correct type
  const { data: alertsData, isLoading, isError } = useQuery<AlertsState>({
    queryKey: ["alertsData"],
    queryFn: fetchAlerts,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Only dispatch if data is new
  useEffect(() => {
    if (alertsData) {
      console.log(alertsData.active_alerts);
      dispatch(setAlertsData(alertsData.active_alerts)); 
    }
  }, [alertsData, dispatch]);

  // Set breadcrumb and header text only once on mount
  useEffect(() => {
    dispatch(setBreadcrumbText(["Alerts"]));
    dispatch(setHeaderText("Alerts"));
  }, [dispatch]);

  // Access active alerts from Redux state
  const activeAlerts = useSelector((state: RootState) => state.alerts.active_alerts);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 64px)", // Adjust to account for the footer height
      }}
    >
      {isError && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <Typography variant="h6" color="error">
            Error fetching alerts data.
          </Typography>
        </Box>
      )}
      <Box sx={{ flex: 1, padding: "24px" }}>
        <Typography variant="h2" sx={{ marginTop: "20px", marginBottom: "10px" }}>
          Active Alerts ({activeAlerts.length || 0})
        </Typography>
        <AlertsTable />
      </Box>
      <Box sx={{ mt: "auto", width: "100%" }}>
        <InfoFooter />
      </Box>
    </Box>
  );
}
