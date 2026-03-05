import { useEffect, useState } from "react";
import { Box, Link, IconButton, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Chart from "react-apexcharts";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { fetchAlertStats } from "../../../services/apis";
import { AlertStatsParams } from "../../../types/Alerts/AlertTypes";

// Define a type for the chart data structure
interface ChartDataType {
  options: {
    chart: {
      id: string;
      toolbar: any;
    };
    xaxis: {
      categories: string[];
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

export default function KPICards({ kpiCardData, projectName }: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const currentDate = new Date();
  const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}-${String(
    currentDate.getFullYear()
  ).slice(-2)}`;
  const filename = `${projectName}_${formattedDate}`;

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
        categories: isSmallScreen
          ? ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
          : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
        name: "Alerts",
        data: [],
      },
    ],
  });

  // Fetch alert stats and update chart data
  useEffect(() => {
    const loadAlertStats = async () => {
      if (!kpiCardData?.project_data?.project_name) {
        console.warn("No project name found; skipping API call");
        return; // Exit function if project name is missing
      }

      try {
        console.log("KPI Card Data:", kpiCardData);
        const params: AlertStatsParams = {
          field: "project",
          id: kpiCardData.project_data.project_name,
        };

        const response = await fetchAlertStats(params);

        const alertCountsByMonth = new Array(12).fill(0);
        response.stats.forEach((stat: { timestamp: string }) => {
          const date = new Date(stat.timestamp);
          const monthIndex = date.getUTCMonth();
          alertCountsByMonth[monthIndex]++;
        });

        setChartData((prev) => ({
          ...prev,
          series: [{ ...prev.series[0], data: alertCountsByMonth }],
        }));
      } catch (error) {
        console.error("Error fetching alert stats:", error);
      }
    };

    loadAlertStats();
  }, [kpiCardData]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, lg: 2 }}>
          <Paper sx={cardStyles}>
            <Typography sx={typographyStyles}>{kpiCardData?.project_data?.total_sites}</Typography>
            <Typography sx={subtitleStyles}>total sites</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, lg: 2 }}>
          <Paper sx={cardStyles}>
            <Typography sx={typographyStyles}>{kpiCardData?.project_data?.total_units}</Typography>
            <Typography sx={subtitleStyles}>total units</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }} sx={{ width: "100%" }}>
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
                <Typography sx={typographyStyles}>{kpiCardData?.active_alerts_data?.active_alerts}</Typography>
                <Typography sx={subtitleStyles}>Active alerts</Typography>
                {kpiCardData?.active_alerts_data?.open_sky_spark_link && (
                  <Link
                    href={`${kpiCardData?.active_alerts_data?.open_sky_spark_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#193561", cursor: "pointer", fontSize: "16px" }}
                    sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <OpenInNewIcon sx={{ marginRight: "5px", alignSelf: "center" }} />
                    Open {kpiCardData?.active_alerts_data?.cmms_name}
                  </Link>
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
