import React, { useState } from "react";
import { Box, CircularProgress, Divider, FormControlLabel, Paper, Switch, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { RootState } from "../../../../redux/store";
import { SiteDashboardData } from "../../../../types/SiteDirectory/SiteDirectoryTypes";
import EnergySavingsSlidingMenuMobile from "../EnergySavingsSlidingMenuMobile";
import EnergyDataChart from "../EnergyDataChart";
import { formatElectricDemand } from "../../../../utils/areacode";
import { editSite } from "../../../../services/apis";

const leftCardStyles = {
  boxShadow: "0px 1px 14px 0px #00071624",
  padding: "20px",
};

const getcardStyles = (isSmallScreen: boolean) => ({
  height: "227px",
  boxShadow: "0px 1px 14px 0px #00071624",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: isSmallScreen ? "50%" : "100%",
});

const getRightCardStyles = (isSmallScreen: boolean) => ({
  height: "227px",
  boxShadow: "0px 1px 14px 0px #00071624",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: isSmallScreen ? "50%" : "100%",
});

const titleStyles = {
  fontSize: "40px",
  fontWeight: "700",
  color: "primary.main",
};

const subtitleStyles = {
  fontSize: "14px",
  fontWeight: "700",
  color: "text.secondary",
  textTransform: "uppercase",
};

export default function EnergyDataCardSite({
  energyType,
  setEnergyType,
  projectName,
  siteName,
  someUnitsEnrolledForDemandResponse,
  setEnableSearchQuery,
}: any) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  // Get the site data from the Redux store
  const siteData = useSelector((state: RootState) => state.siteDirectory.sitesData);
  // Get the total energy savings from the site data
  const totalEnergySavings = siteData?.energy_savings_data?.total_savings;
  // Get the carbon reduction savings from the site data
  const carbonReductionSavings = siteData?.energy_savings_data?.carbon_reduction_savings;
  // Get the electric demand from the site data
  const electricDemand = siteData?.electric_demand_last_15_min;
  // const [demandResponse, setDemandResponse] = useState(siteData?.dr_event_enrolled);
  const [loadingForDR, setLoadingForDR] = useState(false);

  const editSiteMutation = useMutation({
    mutationFn: editSite,
    onSuccess: (data) => {
      console.log("Site edited successfully:", data);
      queryClient.removeQueries({ queryKey: ["siteDashboardData"] });
      setLoadingForDR(false);
      setEnableSearchQuery(true);
    },
    onError: (error) => {
      setLoadingForDR(false);
      console.error("Error creating project:", error);
    },
  });

  const cleanPayload = (payload: Record<string, any>) => {
    return Object.fromEntries(Object.entries(payload).filter(([_, value]) => value !== ""));
  };

  const handleDrChange = () => {
    setLoadingForDR(true);
    editSiteMutation.mutate(
      cleanPayload({
        site_id: siteData?.site_data?.site_id,
        name: siteData?.site_data?.site_name,
        country: siteData?.site_data?.country,
        address_line1: siteData?.site_data?.address_line1,
        address_line2: siteData?.site_data?.address_line2 === "-" ? "" : siteData?.site_data?.address_line2,
        city: siteData?.site_data?.city,
        state: siteData?.site_data?.state,
        postal_code: siteData?.site_data?.postal_code,
        dr_event_enrolled: !siteData?.dr_event_enrolled,
        project_id: Number(siteData?.project_data?.project_id),
      })
    );
  };

  const handleChangeEnergyType = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setEnergyType("THERMS");
      localStorage.setItem("energyType", "THERMS");
    } else {
      setEnergyType("KWH");
      localStorage.setItem("energyType", "KWH");
    }
  };

  console.log("siteData", siteData);

  const returnKpiCards = () => {
    return (
      <Grid size={{ xs: 12, lg: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "row" : "column",
            gap: "22px",
          }}
        >
          <Paper sx={getRightCardStyles(isSmallScreen)}>
            <Typography sx={titleStyles}>{electricDemand ? formatElectricDemand(electricDemand) : 0}</Typography>
            <Typography sx={subtitleStyles} align="center">
              electric demand
              <br /> last 15 min (kw)
            </Typography>
          </Paper>
          {loadingForDR ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "40px",
                marginBottom: "10px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Paper sx={getcardStyles(isSmallScreen)}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <Typography variant="body1">Off</Typography>
                <Switch sx={{ "& .MuiSwitch-thumb": { color: "#193561" } }} checked={siteData?.dr_event_enrolled} onChange={handleDrChange} />
                <Typography variant="body1">On</Typography>
              </Box>
              {someUnitsEnrolledForDemandResponse ? (
                <RemoveCircleIcon sx={{ width: 80, height: 80, marginTop: "10px", color: "#0288D1" }} />
              ) : siteData?.dr_event_enrolled ? (
                <CheckCircleIcon sx={{ width: 80, height: 80, marginTop: "10px", color: "#2E7D32" }} />
              ) : (
                <CancelIcon sx={{ width: 80, height: 80, marginTop: "10px", color: "#D32F2F" }} />
              )}
              <Typography sx={{ color: "gray", textAlign: "center", marginTop: "10px" }} variant="h5">
                demand response enrollment
              </Typography>
              {someUnitsEnrolledForDemandResponse && (
                <Typography sx={{ color: "#687178", textAlign: "center", marginTop: "10px", fontSize: "12px", fontWeight: "400" }}>
                  *Some units enrolled
                </Typography>
              )}
            </Paper>
          )}
        </Box>
      </Grid>
    );
  };

  const returnChart = () => {
    return (
      <Grid size={{ xs: 12, lg: 10 }}>
        <Paper sx={leftCardStyles}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h3">year to date</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body1">kWh</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={energyType === "THERMS" ? true : false}
                    sx={{
                      "& .MuiSwitch-thumb": {
                        color: "#193561",
                      },
                    }}
                    onChange={handleChangeEnergyType}
                  />
                }
                label="therms"
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
            }}
          >
            {!isSmallScreen ? (
              <Grid
                container
                spacing={3}
                sx={{
                  marginTop: "10px",
                  width: "100%",
                }}
              >
                <Grid size={{ xs: 12, md: 2 }}>
                  <Box>
                    <Typography sx={titleStyles} align="center">
                      {totalEnergySavings}
                    </Typography>
                    <Typography sx={subtitleStyles} align="center">
                      energy savings
                    </Typography>
                  </Box>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid size={{ xs: 12, md: 2 }}>
                  <Box>
                    <Typography sx={titleStyles} align="center">
                      {carbonReductionSavings}
                    </Typography>
                    <Typography sx={subtitleStyles} align="center">
                      carbon reduction
                      <br />
                      savings (mTons)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <EnergySavingsSlidingMenuMobile kpiCardData={siteData} />
            )}
          </Box>
          <Box sx={{ marginTop: "20px" }} />
          <EnergyDataChart kpiCardData={siteData} projectName={projectName} siteName={siteName} />
        </Paper>
      </Grid>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h2">Energy data</Typography>
      <Grid
        container
        spacing={3}
        sx={{
          marginTop: "20px",
        }}
      >
        {isSmallScreen ? (
          <>
            {returnKpiCards()}
            {returnChart()}
          </>
        ) : (
          <>
            {returnChart()}
            {returnKpiCards()}
          </>
        )}
      </Grid>
    </Box>
  );
}
