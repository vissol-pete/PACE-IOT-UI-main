import { Box, Button, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { TensorIoTLogo } from "../../../../assets";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { saveAs } from "file-saver";

export default function LogoAddressComponentDownload() {
  // Get the site data from the Redux store
  const siteData = useSelector((state: RootState) => state.siteDirectory.sitesData);

  const handleDownload = () => {
    const { project_name } = siteData.project_data;
    const { site_name } = siteData.site_data;
    const date = new Date();
    const formattedDate = `${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}-${date.getFullYear().toString().slice(-2)}`;
    const fileName = `${project_name}_${site_name}_${formattedDate}.csv`.replace(/\s+/g, '_');

    const csvContent = `Total Units,Active Alerts,Energy Savings YTD (kwh),Carbon reduction savings (mtons),Electric demand last 15 min,Demand response\n${siteData.site_data.total_units
      },${siteData.active_alerts_data.active_alerts},${siteData.energy_savings_data.total_savings},${siteData.energy_savings_data.carbon_reduction_savings
      },${siteData.electric_demand_last_15_min},${siteData.dr_event_enrolled ? "In Progress" : "Not In Progress"}`;

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, fileName);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: {
          xs: "column", // Stack vertically on small screens
          sm: "row", // Side by side from sm breakpoint onwards
        },
        alignItems: {
          xs: "flex-start", // Align items to the start when stacked
          sm: "center", // Center items when side by side
        },
        gap: 2,
        marginBottom: {
          xs: 2,
        },
      }}
    >
      <Box>
        <img src={siteData?.project_data.logo_url || TensorIoTLogo} width="200" height="45" />
        <Typography id="modal-modal-title" variant="body1">
          {siteData ? (
            <>
              {siteData.site_data.address_line1} <br />
              {siteData.site_data.address_line2 ? (
                <>
                  {siteData.site_data.address_line2} <br />
                </>
              ) : null}
            </>
          ) : (
            <>
              625 S. The City Drive <br />
              Orange, CA 912345 <br />
              949-123-4567
            </>
          )}
        </Typography>
      </Box>
      <Box>
        <Button
          sx={{
            minWidth: {
              xs: "100%", // Full width on xs breakpoint
              sm: "auto", // Default width on sm and above
            },
          }}
          variant="outlined"
          color="primary"
          size="medium"
          endIcon={<DownloadIcon />}
          onClick={() => handleDownload()}
        >
          Download operations report
        </Button>
      </Box>
    </Box>
  );
}
