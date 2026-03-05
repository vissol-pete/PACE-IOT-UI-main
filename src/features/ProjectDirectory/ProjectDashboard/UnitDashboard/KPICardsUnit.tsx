import { useEffect, useState } from "react";
import { Box, CircularProgress, FormControlLabel, IconButton, Link, Paper, Switch, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import Chart from "react-apexcharts";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RootState } from "../../../../redux/store";
import { editUnit, fetchAlertStats } from "../../../../services/apis";
import { AlertStatsParams } from "../../../../types/Alerts/AlertTypes";
import { useParams } from "react-router-dom";
import { formatElectricDemand } from "../../../../utils/areacode";

const cardStyles = {
  height: "196px",
  boxShadow: "0px 1px 14px 0px #00071624",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
};

const typographyStyles = {
  fontSize: "40px",
  fontWeight: "700",
  color: "primary.main",
};

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

interface ChartDataType {
  options: {
    chart: {
      id: string;
      toolbar: any;
    };
    xaxis: {
      categories: string[];
      title: { text: string | undefined };
      labels: {
        style: {
          fontSize: string;
          fontFamily: string;
          fontWeight: number;
          colors: string;
        };
      };
    };
    yaxis: {
      title: {
        text: string;
        style: {
          fontSize: string;
          fontFamily: string;
          fontWeight: string;
          colors: string;
        };
      };
      labels: {
        style: {
          fontSize: string;
          fontFamily: string;
          fontWeight: number;
          colors: string;
        };
      };
    };
    colors: string[];
    dataLabels: {
      enabled: boolean;
    };
  };
  series: {
    name: string;
    data: number[];
  }[];
}

export default function KPICardsUnit({ projectName, siteName, unitName, userRole, setEnableSearchQuery }: any) {
  const theme = useTheme();
  const unitData = useSelector((state: RootState) => state.unitDirectory.unitData);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const isXs = useMediaQuery(theme.breakpoints.down("lg"));
  const pageParams = useParams();
  const [loadingForDR, setLoadingForDR] = useState(false);
  const queryClient = useQueryClient();

  const editUnitMutation = useMutation({
    mutationFn: editUnit,
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ["unitDashboardData"] });
      console.log("Unit edited successfully:", data);
      setEnableSearchQuery(true);
      setLoadingForDR(false);
    },
    onError: (error) => {
      setLoadingForDR(false);
      console.error("Error editing Unit:", error);
    },
  });

  const handleDrChange = () => {
    setLoadingForDR(true);
    editUnitMutation.mutate({
      unit_id: unitData?.unit_id,
      demand_response: !unitData?.demand_response,
    });
  };

  console.log("unitData", unitData);
  const currentDate = new Date();
  const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}-${String(
    currentDate.getFullYear()
  ).slice(-2)}`;
  const filename = `${projectName}_${siteName}_${unitName}_${formattedDate}`;

  const [chartData, setChartData] = useState<ChartDataType>({
    options: {
      chart: {
        id: "basic-bar",
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
          export: {
            csv: {
              filename: filename,
            },
            svg: {
              filename: filename,
            },
            png: {
              filename: filename,
            },
          },
        },
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        title: { text: undefined },
        labels: {
          style: {
            fontSize: "12px",
            fontFamily: "Lato",
            fontWeight: 400,
            colors: "#687178",
          },
        },
      },
      yaxis: {
        title: {
          text: "Total alerts",
          style: {
            fontSize: "14px",
            fontFamily: "Lato",
            fontWeight: "500",
            colors: "#37393C",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            fontFamily: "Lato",
            fontWeight: 400,
            colors: "#687178",
          },
        },
      },
      colors: ["#193561"],
      dataLabels: {
        enabled: false,
      },
    },
    series: [
      {
        name: "Monthly Alerts",
        data: [],
      },
    ],
  });

  useEffect(() => {
    console.log("Unit Data:", unitData);
    const loadAlertStats = async () => {
      if (!pageParams.unitId) return; // Ensure unit name exists before making the API call

      try {
        const params: AlertStatsParams = {
          field: "unit",
          id: pageParams.unitId,
        };

        const response = await fetchAlertStats(params);

        const alertCountsByMonth = new Array(12).fill(0);
        response.stats.forEach((stat: { timestamp: string }) => {
          const date = new Date(stat.timestamp);
          const monthIndex = date.getUTCMonth();
          alertCountsByMonth[monthIndex]++;
        });

        const totalAlertsCount = alertCountsByMonth.reduce((sum, count) => sum + count, 0);
        setTotalAlerts(totalAlertsCount);
        setChartData((prevData) => ({
          ...prevData,
          series: [
            {
              ...prevData.series[0],
              data: alertCountsByMonth,
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching alert stats:", error);
      }
    };

    loadAlertStats();
  }, [pageParams.unitId]);

  useEffect(() => {
    const categories = isXs
      ? ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    setChartData((prevData) => ({
      ...prevData,
      options: {
        ...prevData.options,
        xaxis: {
          ...prevData.options.xaxis,
          categories,
        },
      },
    }));
  }, [isXs]);

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Chart Section */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ width: "100%", order: { xs: 2, md: 1 } }}>
          <Paper
            sx={{
              minHeight: "196px",
              boxShadow: "0px 1px 14px 0px #00071624",
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingX: "20px",
              paddingY: "10px",
              width: "100%",
            }}
          >
            <Grid container spacing={2} sx={{ width: "100%" }}>
              <Grid
                size={{ xs: 12, md: 4 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ ...typographyStyles }}>{totalAlerts}</Typography>
                <Typography sx={{ ...subtitleStyles }}>Active alerts</Typography>
                {unitData?.active_alerts_data?.cmms_link && (
                  <IconButton
                    aria-label="open"
                    size="small"
                    onClick={() => {
                      const url = unitData.active_alerts_data.cmms_link;
                      const finalUrl = url.startsWith("http") ? url : `https://${url}`;
                      window.open(finalUrl, "_blank");
                    }}
                  >
                    <OpenInNewIcon sx={{ marginRight: "5px" }} />
                    <Link sx={{ fontSize: "16px", fontFamily: "Lato", fontWeight: 400 }}>Open {unitData?.active_alerts_data?.cmms_name}</Link>
                  </IconButton>
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Chart options={chartData.options} series={chartData.series} type="bar" width="100%" height="90%" />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Additional KPI Cards */}
        <Grid size={{ xs: 6, md: 2 }} sx={{ order: { xs: 1, md: 2 } }}>
          <Paper sx={cardStyles}>
            <Typography sx={titleStyles}>
              {unitData?.electric_demand_last_15min ? formatElectricDemand(unitData.electric_demand_last_15min) : 0}
            </Typography>
            <Typography sx={subtitleStyles} align="center">
              electric demand
              <br /> last 15 min (kw)
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 2 }} sx={{ order: { xs: 1, md: 3 }, marginBottom: "20px" }}>
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
            <Paper sx={cardStyles}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <Typography variant="body1">Off</Typography>
                <Switch
                  sx={{ "& .MuiSwitch-thumb": { color: "#193561" } }}
                  checked={unitData?.demand_response}
                  onChange={handleDrChange}
                  disabled={userRole == "TECHNICIAN"}
                />
                <Typography variant="body1">On</Typography>
              </Box>
              {unitData?.demand_response ? (
                <CheckCircleIcon sx={{ width: 80, height: 80, marginTop: "10px", color: "#2E7D32" }} />
              ) : (
                <CancelIcon sx={{ width: 80, height: 80, marginTop: "10px", color: "#D32F2F" }} />
              )}
              <Typography sx={{ color: "gray", textAlign: "center" }} variant="h5">
                demand response
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
