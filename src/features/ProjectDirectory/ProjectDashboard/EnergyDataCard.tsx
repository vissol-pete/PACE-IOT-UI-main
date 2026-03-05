import { Box, Divider, FormControlLabel, Paper, Switch, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";

import EnergyDataChart from "./EnergyDataChart";
import EnergySavingsSlidingMenuMobile from "./EnergySavingsSlidingMenuMobile";
import { formatElectricDemand } from "../../../utils/areacode";

const leftCardStyles = {
  // height: "479px",
  boxShadow: "0px 1px 14px 0px #00071624",
  padding: "16px",
};

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

export default function EnergyDataCard({
  kpiCardData,
  energyType,
  setEnergyType,
  setEnableFetchProjectDashboardKPICardData,
  projectName,
  siteName,
}: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const handleChangeEnergyType = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("handleChangeEnergyType", event.target.checked);
    if (event.target.checked) {
      setEnergyType("THERMS");
      localStorage.setItem("energyType", "THERMS");
    } else {
      setEnergyType("KWH");
      localStorage.setItem("energyType", "KWH");
    }
    setEnableFetchProjectDashboardKPICardData(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h2">Energy data</Typography>
      <Grid
        container
        spacing={3}
        sx={{
          marginTop: isSmallScreen ? "8px" : "16px",
        }}
      >
        {isSmallScreen && <EnergyDataDemandResponse isSmallScreen={isSmallScreen} kpiCardData={kpiCardData} />}
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
                alignItems: "center",
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
                        {kpiCardData?.energy_savings_data?.total_savings}
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
                        {kpiCardData?.energy_savings_data?.carbon_reduction_savings}
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
                <EnergySavingsSlidingMenuMobile kpiCardData={kpiCardData} />
              )}
            </Box>
            <Box
              sx={{
                marginTop: "20px",
              }}
            />
            <EnergyDataChart kpiCardData={kpiCardData} projectName={projectName} siteName={siteName} />
          </Paper>
        </Grid>
        {!isSmallScreen && <EnergyDataDemandResponse isSmallScreen={isSmallScreen} kpiCardData={kpiCardData} />}
      </Grid>
    </Box>
  );
}

function EnergyDataDemandResponse({ isSmallScreen, kpiCardData }: any) {
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
          <Typography sx={titleStyles}>
            {kpiCardData?.electric_demand_last_15_min ? formatElectricDemand(kpiCardData.electric_demand_last_15_min) : 0}
          </Typography>
          <Typography sx={subtitleStyles} align="center">
            electric demand
            <br /> last 15 min (kw)
          </Typography>
        </Paper>

        <Paper sx={getRightCardStyles(isSmallScreen)}>
          <Typography sx={titleStyles}>{kpiCardData?.sites_with_demand_response}</Typography>
          <Typography sx={subtitleStyles} align="center">
            sites with <br />
            demand response
          </Typography>
        </Paper>
      </Box>
    </Grid>
  );
}
