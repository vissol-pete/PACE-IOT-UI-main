import { useEffect, useState } from "react";
import { Box, Chip, FormControlLabel, Link, Switch, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { UnitsTableRow } from "../../../../types";
import { selectAllUnitsData, setAddUnitState, setSelectedUnitId } from "../../../../redux/Slice/SiteDirectory/SiteDirectorySlice";
import { setBreadcrumbText } from "../../../../redux/Slice/Navigation/NavigationSlice";
import { editUnit } from "../../../../services/apis";

export default function UnitsTable({
  siteUnitsDataLoading,
  paginationModel,
  setPaginationModel,
  siteUnitsRequestData,
  setSiteUnitsRequestData,
  setEnableSearchQuery,
  unitsFilteredRows,
  setUnitsFilteredRows,
  setAddUnit,
  setOpenAddNewUnitModel,
  setOpenDeleteUnitModel,
  selectedUnitsRows,
  setSelectedUnitsRows,
  projectName,
  projectId,
  siteName,
  siteId,
  handleEditClick,
  userRole,
}: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const allUnitsData = useSelector(selectAllUnitsData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [totalRows, setTotalRows] = useState(10);
  const [loadingForDR, setLoadingForDR] = useState(false);
  const [sortModel, setSortModel] = useState(() => {
    const savedSortModel = localStorage.getItem("unitSortModel");
    return savedSortModel ? JSON.parse(savedSortModel) : [{field:'unit_name',sort:'asc'}];
  });
  const [isInitialRender, setInitialRender] = useState(true)

  useEffect(()=>{
   if(isInitialRender) {
    setInitialRender(false)
   }
  },[isInitialRender])
  
  const columns: GridColDef<UnitsTableRow>[] = [
    {
      field: "unit_name",
      headerName: "Unit name",
      renderCell: (params) => {
        return (
          <Tooltip title={params.value} placement="bottom-start">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#193561",
                cursor: "pointer",
                fontSize: "16px",
                whiteSpace: "pre",
              }}
              onClick={() => handleUnitNameClick(params.row)}
            >
              {params.value}
            </Link>
          </Tooltip>
        );
      },
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "unit_serial_number",
      headerName: "Unit serial number",
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "unit_brand",
      headerName: "Unit brand",
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "unit_model_number",
      headerName: "Unit model number",
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "dr_enrollment",
      headerName: "DR enrollment",
      flex: isSmallScreen ? undefined : 1,
      minWidth: 130,
      // sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginTop: "5px",
          }}
        >
          <Typography variant="body1">off</Typography>
          <FormControlLabel
            disabled={params?.row?.dr_link === null || userRole === "TECHNICIAN"}
            control={
              <Switch
                sx={{
                  "& .MuiSwitch-thumb": {
                    color: params?.row?.dr_link !== null ? "#193561" : "#grey",
                  },
                }}
                onChange={() => handleToggle(params?.row)}
                checked={params.value}
              />
            }
            label="on"
          />
        </Box>
      ),
    },
    {
      field: "pace_ai_device_id",
      headerName: "PACE AI device ID",
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "pace_version",
      headerName: "PACE AI version",
      flex: isSmallScreen ? undefined : 1,
      // sortable: false,
    },
    {
      field: "firmware_version",
      headerName: "Firmware",
      flex: isSmallScreen ? undefined : 1,
      // sortable: false,
    },
    {
      field: "pace_ai_device_status",
      headerName: "PACE AI device status",
      flex: isSmallScreen ? undefined : 1,
      // sortable: false,
      renderCell: (params) => {
        return <Chip label={params.row.PACE_AIDeviceStatus ? "ONLINE" : "OFFLINE"} variant="filled" color={params.row.PACE_AIDeviceStatus ? "success" : "default"} />;
      },
    },
    {
      field: "actions",
      type: "actions",
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

  useEffect(() => {
    if (allUnitsData !== null && allUnitsData !== undefined) {
      const updatedData: UnitsTableRow[] = [];
      for (const i in allUnitsData?.data) {
        const itemSub = allUnitsData?.data[i];
        const {
          unit_id,
          unit_name,
          unit_serial_num,
          unit_brand,
          unit_model_number,
          dr_enrollment,
          dr_link,
          pace_ai_device_id,
          pace_version,
          firmware_version,
          pace_ai_device_status,
          stage1_btuh,
          stage2_btuh,
          tonnage,
          main_voltage,
          main_phases,
        } = itemSub;
        const sortedItem: UnitsTableRow = {
          id: unit_id === "" ? "" : unit_id,
          unit_name: unit_name === "" ? "-" : unit_name,
          unit_serial_number: unit_serial_num === "" ? "-" : unit_serial_num,
          unit_brand: unit_brand === null ? "-" : unit_brand,
          unit_model_number: unit_model_number === null ? "-" : unit_model_number,
          dr_enrollment: dr_enrollment === null ? "-" : dr_enrollment,
          dr_link: dr_link,
          pace_ai_device_id: pace_ai_device_id === null ? "-" : pace_ai_device_id,
          PACE_AIVersion: pace_version === null ? "-" : pace_version,
          firmware: firmware_version === null ? "-" : firmware_version,
          PACE_AIDeviceStatus: pace_ai_device_status == null ? "" : pace_ai_device_status,
          stage1_btuh: stage1_btuh == null ? "" : stage1_btuh,
          stage2_btuh: stage2_btuh == null ? "" : stage2_btuh,
          tonnage: tonnage == null ? "" : tonnage,
          main_voltage: main_voltage == null ? "" : main_voltage,
          main_phases: main_phases == null ? "" : main_phases,
        };
        updatedData.push(sortedItem);
      }
      setTotalRows(allUnitsData?.unit_count);
      setLoadingForDR(false);
      setUnitsFilteredRows(updatedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUnitsData]);

  const handleSortModelChange = (e: any) => {
    console.log("handleSortModelChange", e);
    if(e?.length<=0)return
    setSiteUnitsRequestData({ ...siteUnitsRequestData, sortOrder: e[0]?.sort ?? "", sortField: e[0]?.field ?? "" });
    setSortModel(e);
    localStorage.setItem("unitSortModel", JSON.stringify(e)); // Save the sort model
  };

  const handleUnitNameClick = (row: any) => {
    console.log("Unit Name clicked:", row);
    dispatch(setBreadcrumbText(["Project directory", projectName, siteName, row?.unit_name]));
    navigate(
      `/project-directory/project-dashboard/site-dashboard/unit-dashboard/${encodeURIComponent(projectName)}/${projectId}/${encodeURIComponent(
        siteName
      )}/${siteId}/${encodeURIComponent(row?.unit_name)}/${row?.id}`
    );
  };
  // const handleEditClick = (row: any) => {
  //   console.log("Row details for edit:", row);
  //   dispatch(setAddUnitState("edit"));
  //   setAddUnit({
  //     unit_id: row.id,
  //     name: row.unit_name,
  //     serial_number: row.unit_serial_number,
  //     unit_brand: row.unit_brand === "-" ? "" : row.unit_brand,
  //     unit_model_number: row.unit_model_number,
  //     connectionStatus: "take_online",
  //     stage_1_BTU: row.stage1_btuh,
  //     stage_2_BTU: row.stage2_btuh,
  //     tonnage: row.tonnage,
  //     main_voltage: row.main_voltage,
  //     main_phases: row.main_phases,
  //     pace_ai_device_id: row.pace_ai_device_id,
  //   });
  //   setOpenAddNewUnitModel(true);
  // };

  const handleDeleteClick = (row: any) => {
    console.log("Row details for delete:", row);
    dispatch(setSelectedUnitId(row?.id));
    setOpenDeleteUnitModel(true);
    setAddUnit({
      name: row.unit_name,
      pace_ai_device_id: row?.pace_ai_device_id === "-" ? null : row.pace_ai_device_id,
    });
  };

  useEffect(() => {
    setSiteUnitsRequestData({ ...siteUnitsRequestData, pageNumber: paginationModel?.page, pageSize: paginationModel?.pageSize, sortOrder: sortModel[0].sort, sortField: sortModel[0].field });
    setEnableSearchQuery(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel]);

  const editUnitMutation = useMutation({
    mutationFn: editUnit,
    onSuccess: (data) => {
      console.log("Site edited successfully:", data);
      setEnableSearchQuery(true);
    },
    onError: (error) => {
      setLoadingForDR(false);
      console.error("Error creating project:", error);
    },
  });

  const handleToggle = (row: any) => {
    console.log("Toggle", row);
    setLoadingForDR(true);
    editUnitMutation.mutate({
      unit_id: row?.id,
      demand_response: !row?.dr_enrollment,
    });
  };

  const handleSelectionChange = (newSelectionModel: GridRowSelectionModel) => {
    const selectedRowData = unitsFilteredRows.filter((row: UnitsTableRow) => newSelectionModel.includes(row.id));
    const updatedSelectedRows = [...selectedUnitsRows];

    // Find newly selected rows and add them
    selectedRowData.forEach((newRow: UnitsTableRow) => {
      if (!updatedSelectedRows.some((row) => row.id === newRow.id)) {
        updatedSelectedRows.push(newRow); // Add new rows
      }
    });

    // Remove deselected rows
    const deselectedRowIds = selectedUnitsRows.map((row: any) => row.id).filter((id: any) => !newSelectionModel.includes(id));
    deselectedRowIds.forEach((id: any) => {
      const indexToRemove = updatedSelectedRows.findIndex((row) => row.id === id);
      if (indexToRemove > -1) {
        updatedSelectedRows.splice(indexToRemove, 1); // Remove deselected rows
      }
    });

    setSelectedUnitsRows(selectedRowData);
  };

  // console.log("unitsFilteredRows", unitsFilteredRows);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ marginTop: "15px" }} />
      <DataGrid
        checkboxSelection
        loading={siteUnitsDataLoading || loadingForDR}
        disableColumnMenu
        sx={{
          display: "grid",
          "& .MuiDataGrid-cell": {
            border: 1,
            borderRight: 0,
            borderTop: 1,
            borderLeft: 0,
            borderColor: "#E2E9F4",
          },
        }}
        autoHeight
        rows={unitsFilteredRows ?? []}
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
        disableRowSelectionOnClick
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        onSortModelChange={handleSortModelChange}
        onRowSelectionModelChange={(newSelectionModel) => handleSelectionChange(newSelectionModel)}
        rowSelectionModel={selectedUnitsRows.map((row: any) => row.id)}
        disableColumnFilter
        keepNonExistentRowsSelected
      />
    </Box>
  );
}
