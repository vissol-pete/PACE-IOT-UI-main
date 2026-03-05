import React, { useState, useEffect } from "react";
import { Box, IconButton, Link, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Chart from "react-apexcharts";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { fetchAlertStats } from "../../../../services/apis";
import { AlertStatsParams } from "../../../../types/Alerts/AlertTypes";
import { SiteDashboardData, AlertsChartData } from "../../../../types/SiteDirectory/SiteDirectoryTypes";

const cardStyles = {
  height: "157px",
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

const subtitleStyles = {
  fontSize: "14px",
  fontWeight: "700",
  color: "text.secondary",
  textTransform: "uppercase",
};

export default function KPICardsSite({ projectName, siteName }: any) {
  const siteData = useSelector((state: RootState) => state.siteDirectory.sitesData);
  const currentDate = new Date();
  const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}-${String(
    currentDate.getFullYear()
  ).slice(-2)}`;
  const filename = `${projectName}_${siteName}_${formattedDate}`;

  const [chartData, setChartData] = useState<AlertsChartData>({
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
        title: { text: "" },
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
            fontWeight: 500,
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
    const loadAlertStats = async () => {
      if (!siteData?.site_data?.site_id) return; // Ensure.site_id exists before making the API call

      try {
        console.log("Site data:", siteData.site_data);

        const params: AlertStatsParams = {
          field: "site",
          id: siteData.site_data.site_id,
        };

        const response = await fetchAlertStats(params);

        const alertCountsByMonth = new Array(12).fill(0);
        response.stats.forEach((stat: { timestamp: string }) => {
          const date = new Date(stat.timestamp);
          const monthIndex = date.getUTCMonth();
          alertCountsByMonth[monthIndex]++;
        });

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
  }, [siteData?.site_data?.site_id, filename]);

  const activeAlertsData = siteData?.active_alerts_data;
  const totalAlerts = activeAlertsData ? Object.values(activeAlertsData.monthly_alerts).reduce((total, alerts) => total + alerts, 0) : 0;

  const totalUnits = siteData?.site_data?.total_units || 0;

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 2 }}>
          <Paper sx={cardStyles}>
            <Typography sx={typographyStyles}>{totalUnits}</Typography>
            <Typography sx={subtitleStyles}>total units</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 10 }} sx={{ width: "100%" }}>
          <Paper
            sx={{
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
                }}
              >
                <Typography sx={typographyStyles}>{totalAlerts}</Typography>
                <Typography sx={subtitleStyles}>Active alerts</Typography>
                {activeAlertsData.cmms_link && (
                  <IconButton
                    aria-label="open"
                    size="small"
                    onClick={() => {
                      const url = activeAlertsData.cmms_link;
                      const finalUrl = url.startsWith("http") ? url : `https://${url}`;
                      window.open(finalUrl, "_blank");
                    }}
                  >
                    <OpenInNewIcon sx={{ marginRight: "5px" }} />
                    <Link sx={{ fontSize: "16px", fontFamily: "Lato", fontWeight: 400 }} href="#">
                      Open {activeAlertsData.cmms_name}
                    </Link>
                  </IconButton>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Chart options={chartData.options} series={chartData.series} type="bar" width="100%" height="90%" />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
