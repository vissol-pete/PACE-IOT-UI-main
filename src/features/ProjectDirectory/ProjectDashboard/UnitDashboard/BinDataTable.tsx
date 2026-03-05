import { Box, Chip, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UnitDashboardTableRow } from "../../../../types";

const cardStyles = {
  boxShadow: "0px 1px 14px 0px #00071624",
  display: "flex",
  paddingX: "16px",
  paddingY: "16px",
  width: "100%",
  maxWidth: "100%", // Ensures it stays within parent container
  flexDirection: "column",
  overflow: "hidden", // Prevents content from overflowing outside the box
};

export default function BinData({ unit } : any) {
    const unitData = useSelector((state: RootState) => state.unitDirectory.unitData);
    console.log(unitData, "bin table", unitData.bin_data_last_15min["kw/tonnage"])

  const rows: UnitDashboardTableRow[] = [
    {
      id: unitData.unit_id,
      hvac_sn: unitData.bin_data_last_15min.hvac_sn,
      current: unitData.bin_data_last_15min.current || 0,
      kwh: unitData.bin_data_last_15min.kwh || 0,
      therm_usage: unitData.bin_data_last_15min.therm_usage || 0,
      temp_1: unitData.bin_data_last_15min.temp1 || 0,
      temp_2: unitData.bin_data_last_15min.temp2 || 0,
      temp_3: unitData.bin_data_last_15min.temp3 || 0,
      kw: unitData.bin_data_last_15min.kw || 0,
      kw_tonnage: unitData.bin_data_last_15min["kw/tonnage"] || "-",
      running_status: unitData.bin_data_last_15min.running_status ? "Online" : "Stopped",
      timestamp: unitData.bin_data_last_15min.timestamp || "-",
      pace_ai_version: unitData.pace_ai_version || "-",
      firmware_version: unitData.firmware_version || "-",
      electric_demand_last_15min: unitData.electric_demand_last_15min || 0,
      device_id: unitData.device_id || "-",
    },
  ];

  const columns: GridColDef<UnitDashboardTableRow>[] = [
    {
      field: "timestamp",
      headerName: "Timestamp",
      minWidth: 150,
    },
    {
      field: "hvac_sn",
      headerName: "HVAC SN",
      minWidth: 150,
    },
    {
      field: "device_id",
      headerName: "PACE AI device ID",
      minWidth: 150,
    },
    {
      field: "pace_ai_version",
      headerName: "PACE AI VERSION",
      minWidth: 150,
    },
    {
      field: "firmware_version",
      headerName: "Firmware",
      minWidth: 150,
    },
    {
      field: "current",
      headerName: "Current (A)",
      minWidth: 150,
    },
    {
      field: "kwh",
      headerName: "kWh",
      minWidth: 150,
    },
    {
      field: "therm_usage",
      headerName: "Therm usage",
      minWidth: 150,
    },
    {
      field: "temp_1",
      headerName: "Temp 1",
      minWidth: 150,
    },
    {
      field: "temp_2",
      headerName: "Temp 2",
      minWidth: 150,
    },
    {
      field: "temp_3",
      headerName: "Temp 3",
      minWidth: 150,
    },
    {
      field: "kw",
      headerName: "kW",
      minWidth: 150,
    },
    {
      field: "kw_tonnage",
      headerName: "kW/Tonnage",
      minWidth: 150,
    },
    {
      field: "running_status",
      headerName: "Running status",
      minWidth: 150,
      renderCell: (params) => <Chip label={params.value} variant="filled" color={params.value === "Online" ? "success" : "default"} />,
    },
  ];

  return (
    <Box>
      <Paper
        sx={{
          ...cardStyles,
          overflowX: "auto", // Allow horizontal scrolling
        }}
      >
        <Typography variant="h5">Bin data last 15 min</Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Box sx={{ width: "100%" }}>
          {" "}
          {/* Wrapper Box for horizontal scrolling */}
          <DataGrid
            sx={{
              width: "100%",
              "& .MuiDataGrid-cell": {
                border: 1,
                borderRight: 0,
                borderTop: 1,
                borderLeft: 0,
                borderColor: "#E2E9F4",
                whiteSpace: "nowrap", // Prevents text wrapping
              },
              "& .MuiDataGrid-footerContainer": {
                display: "none",
              },
            }}
            autoHeight // Ensure vertical expansion
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            hideFooterPagination
            disableColumnFilter
            disableColumnMenu
          />
        </Box>
      </Paper>
    </Box>
  );
}
