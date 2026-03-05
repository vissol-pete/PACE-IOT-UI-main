import { useState, useEffect } from "react";
import { Box, Typography, Modal, Button, useTheme, useMediaQuery, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation, useQuery } from "@tanstack/react-query";
// import { useSelector } from "react-redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { deployFirmwareUpdate, fetchFirmwareList } from "../../../../services/apis";
// import { selectUnitId } from "../../../../redux/Slice/SiteDirectory/SiteDirectorySlice";
import { AlertBar } from "../../../../components";
import { UnitsModelTableRow } from "../../../../types";

const getModalStyle = (isSmallScreen: boolean) => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: isSmallScreen ? "90vw" : 404,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  maxHeight: "95vh",
  overflowY: "auto",
});

export default function UpdateFirmwareModel({
  openUpdateFirmwareModel,
  setOpenUpdateFirmwareModel,
  showModelAlert,
  setShowModelAlert,
  selectedUnitsRows,
  selectedUnitsFilteredRows,
  setSelectedUnitsFilteredRows,
  setEnableSearchQuery,
  setAlertState,
}: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isLoading, setIsLoading] = useState(false);
  // const selectedUnitID = useSelector(selectUnitId);
  const [selectedFirmware, setSelectedFirmware] = useState("");
  const [firmwareMenuList, setFirmwareMenuList] = useState([]);

  const columns: GridColDef<UnitsModelTableRow>[] = [
    {
      field: "unit_name",
      headerName: "Unit name",
      minWidth: 150,
    },
    {
      field: "pace_ai_device_id",
      headerName: "PACE AI device",
      minWidth: 150,
    },
    {
      field: "PACE_AIVersion",
      headerName: "PACE AI version",
      minWidth: 150,
    },
    {
      field: "firmware",
      headerName: "Firmware",
      minWidth: 150,
    },
  ];

  const {
    data: firmwareList,
    // isLoading: firmwareListLoading,
    // isError: firmwareListError,
    isSuccess: firmwareListSuccess,
  } = useQuery({
    queryKey: ["siteUnitsData"],
    queryFn: fetchFirmwareList,
  });

  useEffect(() => {
    if (firmwareList !== null && firmwareList !== undefined && firmwareListSuccess) {
      setFirmwareMenuList(firmwareList?.Firmware);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firmwareList]);

  const firmwareDeploymentMutation = useMutation({
    mutationFn: deployFirmwareUpdate,
    onSuccess: (data) => {
      console.log("Firmware Deployment successfully:", data);
      setSelectedFirmware("");
      setOpenUpdateFirmwareModel(false);
      setEnableSearchQuery(true);
      setIsLoading(false);
      handleClose();
      setAlertState({
        isAlert: true,
        severity: "success",
        title: "",
        description: "Firmware on the PACE AI device for selected unit(s) updated.",
        resetOpen: true,
      });
    },
    onError: (error) => {
      setIsLoading(false);
      handleClose();
      console.error("Error Firmware Deployment:", error);
      setAlertState({
        isAlert: true,
        severity: "error",
        title: "",
        description: "Firmware on the PACE AI device for selected unit(s) was unable to be updated. Please try again later.",
        resetOpen: true,
      });
    },
  });

  const handleClose = () => setOpenUpdateFirmwareModel(false);

  const handleUpdateClick = () => {
    setIsLoading(true);
    // const filteredUnits = selectedUnitsFilteredRows?.filter((unit: any) => unit.pace_ai_device_id !== "-");
    // console.log("filteredUnits", filteredUnits);

    const paceAiDeviceIds = selectedUnitsFilteredRows
      .filter((unit: any) => unit.pace_ai_device_id !== "-")
      .map((unit: any) => unit.pace_ai_device_id);
    console.log("paceAiDeviceIds", paceAiDeviceIds);

    firmwareDeploymentMutation.mutate({
      payload: {
        firmware: selectedFirmware,
      },
      device_list: paceAiDeviceIds,
    });
  };

  useEffect(() => {
    if (selectedUnitsRows !== null && selectedUnitsRows !== undefined) {
      const updatedData: UnitsModelTableRow[] = [];
      for (const i in selectedUnitsRows) {
        const itemSub = selectedUnitsRows[i];
        const { id, unit_name, pace_ai_device_id, PACE_AIVersion, firmware } = itemSub;
        const sortedItem: UnitsModelTableRow = {
          id: id,
          unit_name: unit_name,
          pace_ai_device_id: pace_ai_device_id,
          PACE_AIVersion: PACE_AIVersion,
          firmware: firmware,
        };
        updatedData.push(sortedItem);
      }
      setSelectedUnitsFilteredRows(updatedData);
      //   console.log("updatedData", updatedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUnitsRows]);

  // console.log("firmwareList", firmwareList);
  // console.log("selectedFirmware", selectedFirmware);
  // console.log("selectedUnitsFilteredRows", selectedUnitsFilteredRows);

  return (
    <Modal open={openUpdateFirmwareModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={getModalStyle(isSmallScreen)}>
        <Typography id="modal-modal-title" variant="h6">
          UPDATE FIRMWARE FOR SELECTED UNIT(S)
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <AlertBar
          variant="standard"
          severity={"warning"}
          description={"Warning: This action will update firmware for all selected units."}
          show={showModelAlert}
          setShow={setShowModelAlert}
        />
        <Box sx={{ marginTop: "20px" }} />
        <Typography id="modal-modal-title" variant="body1">
          Please review your selection carefully before proceeding:{" "}
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Select firmware update*</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedFirmware}
            label="Select firmware update"
            onChange={(event) => setSelectedFirmware(event.target.value as string)}
          >
            {firmwareMenuList.map((firmware, index) => (
              <MenuItem key={index} value={firmware}>
                {firmware}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ marginTop: "20px" }} />
        <DataGrid
          rows={selectedUnitsFilteredRows ?? []}
          columns={columns}
          hideFooter
          autoHeight
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
          disableColumnFilter
          disableColumnMenu
        />
        <Box sx={{ marginTop: "20px" }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="text" color="primary" size="medium" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton disabled={selectedFirmware === ""} loading={isLoading} variant="contained" onClick={handleUpdateClick}>
            update firmware
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
