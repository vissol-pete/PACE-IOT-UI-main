import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Paper, TextField, InputAdornment, useTheme, Box, Stack, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { RootState } from "../../redux/store";
import { formatDate } from "../../utils/timestamp";

const AlertsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();

  // Select alerts data from Redux and format the timestamp
  const alerts = useSelector((state: RootState) => state.alerts.active_alerts);
  const [sortModel, setSortModel] = useState(() => {
    const savedSortModel = localStorage.getItem("alertSortModel");
    return savedSortModel ? JSON.parse(savedSortModel) : [{field:"project_name",sort:'asc'}];
  });

  const [paginationModel, setPaginationModel] = useState<any>(() => {
    const savedPaginationModel = localStorage.getItem("alertPaginationModel");
    return savedPaginationModel ? JSON.parse(savedPaginationModel) : {
      page: 0,
      pageSize: 10,
    };
  });

  useEffect(()=>{
   localStorage.setItem('alertPaginationModel',JSON.stringify(paginationModel))
  },[paginationModel])

const [isInitialRender, setInitialRender] = useState(true)

useEffect(()=>{
 if(isInitialRender) {
  setInitialRender(false)
 }
},[isInitialRender])

  const handleSortModelChange = (e: any) => {
    if(e?.length<=0) return
    setSortModel(e);
    localStorage.setItem("alertSortModel", JSON.stringify(e)); // Save the sort model
  };
  // Format timestamps only once using useMemo
  const formattedAlerts = useMemo(
    () =>
      alerts.map((alert) => ({
        ...alert,
        formattedTimestamp: formatDate(alert.timestamp),
      })),
    [alerts]
  );


const handleExport = () => {
  if (formattedAlerts.length === 0) {
    console.error("No alerts to export.");
    return;
  }

  // Map the alerts to match the desired headers
  const convertedAlerts = formattedAlerts.map((alert) => ({
    Date: alert.formattedTimestamp || "N/A", // Map the "formattedTimestamp" field to "Date"
    "Alert Description": alert.alert_id || "N/A", // Map the "alert_id" field to "Alert Description"
    Project: alert.project_name || "N/A", // Map the "project_name" field to "Project"
    Site: alert.site_name || "N/A", // Map the "site_name" field to "Site"
    Unit: alert.unit_name || "N/A", // Map the "unit_name" field to "Unit"
  }));


  // Format the file name with the current date and time
  const now = new Date();
  const formattedDate = now
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    })
    .replace(/\//g, "-");
  const formattedTime = now
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(":", "-");

  const fileName = `Activealerts_${formattedTime}_${formattedDate}.xlsx`;

  // Create a worksheet from the converted data
  const worksheet = XLSX.utils.json_to_sheet(convertedAlerts);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Active Alerts");

  // Write the workbook to a Blob and trigger the download
  const blob = new Blob([XLSX.write(workbook, { bookType: "xlsx", type: "array" })], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, fileName);
};


  // Filtered data based on search term
  const filteredData = formattedAlerts.filter(
    (row) =>
      row.formattedTimestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.alert_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.unit_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: "formattedTimestamp", headerName: "Date", flex: 1 },
    {
      field: "alert_id",
      headerName: "Alert Description",
      flex: 1,
    },
    {
      field: "project_name",
      headerName: "Project",
      flex: 1,
      renderCell: (params: any) => (
        <a
          href={`project-directory/project-dashboard/${params.row.project_name}/${params.row.project_id}`} 
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "underline", color: "#193561" }}
        >
          {params.value}
        </a>
      ),
    },
    {
      field: "site_name",
      headerName: "Site",
      flex: 1,
      renderCell: (params: any) => (
        <a
          href={`project-directory/project-dashboard/site-dashboard/${params.row.project_name}/${params.row.project_id}/${params.row.site_name}/${params.row.site_id}`} 
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "underline", color: "#193561" }}
        >
          {params.value}
        </a>
      ),
    },
    {
      field: "unit_name",
      headerName: "Unit",
      flex: 1,
      renderCell: (params: any) => (
        console.log(params),
        <a
          href={`project-directory/project-dashboard/site-dashboard/unit-dashboard/${params.row.project_name}/${params.row.project_id}/${params.row.site_name}/${params.row.site_id}/${params.row.unit_name}/${params.row.unit_id}`} 
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "underline", color: "#193561" }}
        >
          {params.value}
        </a>
      ),
    },
  ];
  

  return (
    <Paper style={{ padding: "16px", overflow: "hidden" }}>
      <Stack
        spacing={2}
        mb={2}
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent={{ sm: "space-between" }}
        sx={{ "& > :first-of-type": { alignSelf: { xs: "flex-start", sm: "center" } } }}
      >
        <Button
          variant="text"
          color="primary"
          startIcon={<SaveAltIcon />}
          onClick={handleExport}
          style={{ border: "none", color: theme.palette.primary.main }}
          disabled={formattedAlerts.length === 0} // Disable export if no data
        >
          EXPORT
        </Button>
        <TextField
          variant="standard"
          placeholder="Search..."
          label={searchTerm ? "Search" : ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ height: 40 }}
        />
      </Stack>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Box sx={{ minWidth: 800 }}>
          {formattedAlerts.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ padding: "20px" }}>
              No alerts available.
            </Typography>
          ) : (
            <DataGrid
              rows={filteredData}
              columns={columns}
              getRowId={(row) => row.alert_id} // Specify alert_id as the unique identifier for each row
              initialState={{
                sorting: {
                  sortModel: sortModel,
                },
              }}
              onPaginationModelChange={(model:any)=>{
                if(!isInitialRender)
                setPaginationModel(model)
              }}
              paginationModel={paginationModel}
              onSortModelChange={handleSortModelChange}
              pageSizeOptions={[5, 10, 15, 50, 100]}
              disableColumnMenu
              autoHeight
              sx={{
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid rgba(224, 224, 224, 1)",
                },
                "& .MuiDataGrid-columnHeaders": {
                  borderBottom: "1px solid rgba(224, 224, 224, 1)",
                },
                "& .MuiDataGrid-virtualScroller": {
                  overflowX: "auto",
                },
              }}
              disableColumnFilter
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default AlertsTable;
