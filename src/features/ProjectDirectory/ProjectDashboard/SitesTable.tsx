import { useEffect, useState } from "react";
import {
  Box,
  Link,
  Paper,
  Tooltip,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridOverlay, GridRowSelectionModel } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import { SitesTableRow } from "../../../types";
import { selectAllSitesData, setAddSiteState, setSelectedSiteId } from "../../../redux/Slice/ProjectDirectory/ProjectDirectorySlice";
import { setBreadcrumbText, setHeaderText, selectBreadcrumbText } from "../../../redux/Slice/Navigation/NavigationSlice";
import { editSite } from "../../../services/apis";

export default function SitesTable({
  setOpenAddNewSiteModel,
  setOpenDeleteSiteModel,
  setOpenBypassUnitsModel,
  setTakeUnitsOnlineModel,
  isSearchedAllSitesLoading,
  projectDashboardSitesFilteredRows,
  setProjectDashboardSitesFilteredRows,
  setPaginationModel,
  paginationModel,
  setEnableSearchQuery,
  setAddSite,
  projectName,
  projectDashboardRequestData,
  setProjectDashboardRequestData,
  projectId,
  selectedSitesRows,
  setSelectedSitesRows,
  userRole,
}: any) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const allSitesData = useSelector(selectAllSitesData);
  const breadcrumbText = useSelector(selectBreadcrumbText);
  const [totalRows, setTotalRows] = useState(10);
  // const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortModel, setSortModel] = useState<any>(() => {
    const savedSortModel = localStorage.getItem("siteSortModel");
    return savedSortModel ? JSON.parse(savedSortModel) : [{field:'name',sort:'asc'}];
  });
  const [isInitialRender, setInitialRender] = useState(true)
  useEffect(()=>{
   if(isInitialRender) {
    setInitialRender(false)
   }
  },[isInitialRender])
  const [loadingForDR, setLoadingForDR] = useState(false);

  const leftCardStyles = {
    // height: "696px",
    boxShadow: "0px 1px 14px 0px #00071624",
    padding: "16px",
    marginTop: isSmallScreen ? "8px" : "16px",
  };
  const columns: GridColDef<SitesTableRow>[] = [
    {
      field: "name",
      headerName: "Site name",
      flex: isSmallScreen ? undefined : 1,
      renderCell: (params) => (
        <Tooltip title={params.value} placement="bottom-start">
          <Link
            // href="#"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#193561", cursor: "pointer", fontSize: "16px" }}
            onClick={() => handleSiteNameClick(params.row)}
          >
            {params.value}
          </Link>
        </Tooltip>
      ),
    },
    {
      field: "dr_event_enrolled",
      headerName: "Demand response enrollment",
      minWidth: 130,
      flex: isSmallScreen ? undefined : 1,
      renderCell: (params) => {
        // console.log(params);
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginTop: "5px",
            }}
          >
            <Typography variant="body1">Off</Typography>
            <FormControlLabel
              disabled={params?.row?.dr_link === null || userRole === "TECHNICIAN"}
              control={
                <Switch
                  sx={{
                    "& .MuiSwitch-thumb": {
                      color: params?.value ? "#193561" : "#grey", // Different colors for ON/OFF states
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: params?.value ? "#193561 !important" : "#grey !important", // Track color
                      opacity: params?.value ? 0.5 : 0.2,
                    },
                    "&.Mui-checked": {
                      "& .MuiSwitch-thumb": {
                        color: "#193561",
                      },
                      "& + .MuiSwitch-track": {
                        backgroundColor: "#193561 !important",
                        opacity: 0.5,
                      },
                    },
                  }}
                  checked={params.value}
                  onChange={() => handleToggle(params?.row)}
                />
              }
              label={"On" + (params?.row?.units_dr_enrolled === -1 ? "*" : "")}
            />
          </Box>
        );
      },
    },
    {
      field: "activeAlerts",
      headerName: "Active alerts",
      flex: isSmallScreen ? undefined : 1,
      sortable: false,
    },
    {
      field: "units",
      headerName: "Units",
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "actions",
      type: "actions",
      flex: isSmallScreen ? undefined : 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <GridActionsCellItem
            disabled={userRole === "TECHNICIAN"}
            sx={{
              padding: 1,
              "& .MuiSvgIcon-root": {
                fontSize: "24px",
              },
            }}
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditClick(params.row)}
          />
          <GridActionsCellItem
            disabled={userRole === "TECHNICIAN"}
            sx={{
              padding: 1,
              "& .MuiSvgIcon-root": {
                fontSize: "24px",
              },
            }}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(params.row)}
          />
        </div>
      ),
    },
  ];

  const editSiteMutation = useMutation({
    mutationFn: editSite,
    onSuccess: (data) => {
      console.log("Site edited successfully:", data);
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

  const handleToggle = (row: any) => {
    console.log("Toggle", row);
    setLoadingForDR(true);
    editSiteMutation.mutate(
      cleanPayload({
        site_id: row?.id,
        name: row?.name,
        country: row?.country,
        address_line1: row?.address_line1,
        address_line2: row?.address_line2 === "-" ? "" : row?.address_line2,
        city: row?.city,
        state: row?.state,
        postal_code: row?.postal_code,
        phone_number: row?.phone_number,
        dr_event_enrolled: !row?.dr_event_enrolled,
        project_id: Number(row?.project_id),
      })
    );
  };

  const handleSiteNameClick = (row: SitesTableRow) => {
    // console.log("Site Name clicked:", row);
    let updatedBreadcrumbText = [...breadcrumbText, row?.name]; //breadcrumbText.push(row?.siteName);
    // console.log("updatedBreadcrumbText:", updatedBreadcrumbText);
    dispatch(setBreadcrumbText(updatedBreadcrumbText));
    dispatch(setHeaderText(row?.name));
    // dispatch(setSelectedProjectId(row?.id));
    navigate(
      `/project-directory/project-dashboard/site-dashboard/${encodeURIComponent(projectName)}/${row?.project_id}/${encodeURIComponent(row?.name)}/${
        row?.id
      }`
    );
  };

  const handleEditClick = (row: any) => {
    console.log("Row details for edit:", row);
    dispatch(setAddSiteState("edit"));
    setAddSite({
      site_id: row?.id,
      name: row?.name,
      country: row?.country,
      address_line1: row?.address_line1,
      address_line2: row?.address_line2 === "-" ? "" : row?.address_line2,
      city: row?.city,
      state: row?.state,
      postal_code: row?.postal_code,
      phone_number: row?.phone_number,
      dr_event_enrolled: row?.dr_event_enrolled,
      project_id: Number(row?.project_id),
    });
    setOpenAddNewSiteModel(true);
  };

  const handleDeleteClick = (row: any) => {
    console.log("Row details for delete:", row);
    dispatch(setSelectedSiteId(row?.id));
    setOpenDeleteSiteModel(true);
  };

  const handleSelectionChange = (newSelectionModel: GridRowSelectionModel) => {
    // setSelectedRows(newSelectionModel as number[]);

    // const selectedRowData = projectDashboardSitesFilteredRows.filter((row: SitesTableRow) => newSelectionModel.includes(row?.id));
    const selectedRowData = projectDashboardSitesFilteredRows.filter(
      (row: SitesTableRow) => row.id !== undefined && (newSelectionModel as Array<number | string>).includes(row.id)
    );
    const updatedSelectedRows = [...selectedSitesRows];

    // Find newly selected rows and add them
    selectedRowData.forEach((newRow: SitesTableRow) => {
      if (!updatedSelectedRows.some((row) => row.id === newRow.id)) {
        updatedSelectedRows.push(newRow); // Add new rows
      }
    });

    // Remove deselected rows
    const deselectedRowIds = selectedSitesRows.map((row: any) => row.id).filter((id: any) => !newSelectionModel.includes(id));
    deselectedRowIds.forEach((id: any) => {
      const indexToRemove = updatedSelectedRows.findIndex((row) => row.id === id);
      if (indexToRemove > -1) {
        updatedSelectedRows.splice(indexToRemove, 1); // Remove deselected rows
      }
    });

    setSelectedSitesRows(selectedRowData);
  };

  useEffect(() => {
    if (allSitesData !== null && allSitesData !== undefined) {
      const updatedData: SitesTableRow[] = [];
      for (const i in allSitesData?.data) {
        const itemSub = allSitesData?.data[i];
        // console.log("itemSub", itemSub);
        const {
          site_id,
          name,
          dr_event_enrolled,
          dr_link,
          active_alerts,
          units,
          country,
          address_line1,
          address_line2,
          city,
          state,
          postal_code,
          phone_number,
          units_dr_enrolled,
        } = itemSub;
        const sortedItem: SitesTableRow = {
          id: site_id,
          name: name === "" ? "-" : name,
          dr_event_enrolled: dr_event_enrolled,
          dr_link: dr_link,
          activeAlerts: active_alerts,
          units: units,
          country: country === "" ? "-" : country,
          address_line1: address_line1 === "" ? "-" : address_line1,
          address_line2: address_line2 === "" ? "-" : address_line2,
          city: city === "" ? "-" : city,
          state: state === "" ? "-" : state,
          postal_code: postal_code === "" ? "-" : postal_code,
          phone_number: phone_number === "" ? "-" : phone_number,
          project_id: projectId === "" ? "-" : projectId,
          units_dr_enrolled: units_dr_enrolled,
        };
        updatedData.push(sortedItem);
        // console.log("sortedItem", sortedItem);
      }
      setTotalRows(allSitesData?.site_count);
      setLoadingForDR(false);
      setProjectDashboardSitesFilteredRows(updatedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSitesData]);

  useEffect(() => {
    setProjectDashboardRequestData({ ...projectDashboardRequestData, pageNumber: paginationModel?.page, pageSize: paginationModel?.pageSize, sortOrder: sortModel[0].sort, sortField: sortModel[0].field  });
    setEnableSearchQuery(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel]);

  const handleProjectDashboardSearchText = (e: any) => {
    // console.log("handleProjectDashboardSearchText", e.target.value);
    setProjectDashboardRequestData({ ...projectDashboardRequestData, search_substring: e.target.value });
  };

  const handleSortModelChange = (e: any) => {
    if (e?.length <= 0) return;
    const { field, sort } = e[0];
    if (field !== "activeAlerts") {
      setProjectDashboardRequestData({ ...projectDashboardRequestData, sortOrder: sort ?? "", sortField: field ?? "" });
    }
    setSortModel(e);
    localStorage.setItem("siteSortModel", JSON.stringify(e)); // Save the sort model
  };

  // console.log("allSitesData", allSitesData);
  // console.log("breadcrumbText", breadcrumbText);
  // console.log("projectDashboardSitesFilteredRows", projectDashboardSitesFilteredRows);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h2">Sites ({totalRows ? totalRows : "0"})</Typography>
      <Paper sx={leftCardStyles}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: isSmallScreen ? "flex-start" : "center",
            justifyContent: "space-between",
          }}
        >
          {(userRole === "SUPERADMIN" || userRole === "ADMIN") && (
            <Box
              sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                gap: isSmallScreen ? "10px" : "0",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="medium"
                sx={{
                  marginRight: "10px",
                }}
                onClick={() => setOpenAddNewSiteModel(true)}
              >
                add new site
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                sx={{
                  marginRight: "10px",
                }}
                onClick={() => setOpenBypassUnitsModel(true)}
                disabled={selectedSitesRows?.length <= 0}
              >
                bypass units
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                onClick={() => setTakeUnitsOnlineModel(true)}
                disabled={selectedSitesRows?.length <= 0}
              >
                take units online
              </Button>
            </Box>
          )}
          <TextField
            placeholder="Search..."
            label={projectDashboardRequestData?.search_substring ? "Search" : ""}
            variant="standard"
            size="small"
            sx={{
              marginTop: isSmallScreen ? "10px" : "0",
              width: isSmallScreen ? "100%" : "auto",
            }}
            onChange={handleProjectDashboardSearchText}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <DataGrid
          loading={isSearchedAllSitesLoading || loadingForDR}
          sx={{
            border: "none",
            boxShadow: "none",
            "& .MuiDataGrid-cell": {
              border: 1,
              borderRight: 0,
              borderTop: 1,
              borderLeft: 0,
              borderColor: "#E2E9F4",
              whiteSpace: "pre-wrap",
            },
            "& .MuiDataGrid-columnHeader": {
              border: "none",
            },
            "& .MuiDataGrid-root": {
              boxShadow: "none",
            },
          }}
          autoHeight
          rows={projectDashboardSitesFilteredRows ?? []}
          columns={columns}
          paginationMode="server"
          rowCount={Math.ceil(totalRows)}
          onPaginationModelChange={(model:any)=>{
            if(!isInitialRender)
            setPaginationModel(model)
          }}
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10, 15, 50, 100]}
          initialState={{
            sorting: {
              sortModel: sortModel,
            },
          }}
          checkboxSelection
          disableRowSelectionOnClick
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          onSortModelChange={handleSortModelChange}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay, // use 'noRowsOverlay' in 'slots'
          }}
          rowSelectionModel={selectedSitesRows.map((row: any) => row.id)}
          onRowSelectionModelChange={(newSelectionModel) => handleSelectionChange(newSelectionModel)}
          disableColumnFilter
          disableColumnMenu
          keepNonExistentRowsSelected
        />
      </Paper>
      <Box sx={{ textAlign: "right" }}>
        <Typography variant="body1">*Some units enrolled in demand response</Typography>
      </Box>
    </Box>
  );
}

const CustomNoRowsOverlay = () => (
  <GridOverlay>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "grey.500",
        p: 3,
      }}
    >
      <Typography variant="h2" color="text.primary">
        No sites found
      </Typography>
      <Typography variant="body1" color="text.primary">
        Please add some sites or adjust your search criteria.
      </Typography>
    </Box>
  </GridOverlay>
);
