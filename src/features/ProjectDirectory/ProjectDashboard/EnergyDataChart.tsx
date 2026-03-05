import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

export default function EnergyDataChart({ kpiCardData, projectName, siteName }: any) {
  const currentDate = new Date();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}-${String(
    currentDate.getFullYear()
  ).slice(-2)}`;

  var filename = "";
  if (kpiCardData?.site_data?.site_name !== undefined) filename = `${projectName}_${siteName}_${formattedDate}`;
  else filename = `${projectName}_${formattedDate}`;

  const monthlyUsageData = kpiCardData?.energy_savings_data?.monthly_usage;
  const series = monthlyUsageData
    ? Object.keys(monthlyUsageData).map((year) => ({
      name: year,
      data: Object.values(monthlyUsageData[year]).map((value) => Number(value)),
    }))
    : [];

  const formatYAxisLabels = (value: any) => {
    if (value >= 1000000) {
      return `${value / 1000000}M`;
    } else if (value >= 1000) {
      return `${value / 1000}K`;
    } else {
      return value;
    }
  };

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: "bar",
      height: 350,
      stacked: false,
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
      },
    },
    grid: {
      strokeDashArray: 0,
      borderColor: "#E2E9F4",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Lato",
          fontWeight: 400,
          colors: "#687178",
        },
      },
      axisBorder: {
        show: true,
        color: "#E2E9F4",
      },
      axisTicks: {
        show: true,
        color: "#E2E9F4",
      },
    },
    yaxis: {
      title: {
        text: "Total electricity usage",
        style: {
          fontSize: "14px",
          fontFamily: "Lato",
          fontWeight: "bold",
          cssClass: "apexcharts-yaxis-title",
        },
      },
      labels: {
        formatter: (value: number) => formatYAxisLabels(value),
        style: {
          fontSize: "12px",
          fontFamily: "Lato",
          fontWeight: 400,
          colors: "#687178",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#00A5B8", "#193561"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      markers: {
        size: 13,
        shape: "square",
      },
      fontFamily: "Lato",
      fontSize: "14px",
      fontWeight: 500,
      labels: {
        colors: "#687178",
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["#00A5B8", "#193561"],
    },
    dataLabels: {
      enabled: false,
    },
  });

  useEffect(() => {
    const categories = isSmallScreen
      ? ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    setOptions((prevData) => ({
      ...prevData,
      xaxis: {
        ...prevData.xaxis,
        categories,
      },
    }));
  }, [isSmallScreen]);

  // console.log("formattedDate", formattedDate);

  return (
    <div>
      <div id="chart">
        <ApexCharts options={options} series={series} type="bar" height={250} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}
