import { useState, useEffect } from "react";
import { Box, Typography, Modal, Button, useTheme, useMediaQuery } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSelector } from "react-redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMutation } from "@tanstack/react-query";

// import { selectUnitId } from "../../../../redux/Slice/SiteDirectory/SiteDirectorySlice";
import { AlertBar } from "../../../../components";
import { UnitsModelTableRow } from "../../../../types";
import { bypassRebootOnline } from "../../../../services/apis";
import { selectUserEmail } from "../../../../redux/Slice/Authentication/AuthenticationSlice";

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

export default function SiteDashboardBypassUnitsModel({
  openSiteDashboardBypassUnitsModel,
  setOpenSiteDashboardBypassUnitsModel,
  showModelAlert,
  setShowModelAlert,
  selectedUnitsRows,
  selectedUnitsFilteredRows,
  setSelectedUnitsFilteredRows,
  setEnableSearchQuery,
  setAlertState,
  siteId,
}: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isLoading, setIsLoading] = useState(false);
  const userEmail = useSelector(selectUserEmail);
  // const selectedUnitID = useSelector(selectUnitId);

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
  ];

  const bypassRebootOnlineMutation = useMutation({
    mutationFn: bypassRebootOnline,
    onSuccess: (data) => {
      console.log(" bypassRebootOnline successfully:", data);
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
      console.error("Error  bypassRebootOnline:", error);
      setAlertState({
        isAlert: true,
        severity: "error",
        title: "",
        description: "Firmware on the PACE AI device for selected unit(s) was unable to be updated. Please try again later.",
        resetOpen: true,
      });
    },
  });

  const handleClose = () => setOpenSiteDashboardBypassUnitsModel(false);

  const handleUpdateClick = () => {
    setIsLoading(true);

    bypassRebootOnlineMutation.mutate({
      payload: {
        Bypass_Unit: true,
        OpenADR2_0: false, // TODO:
        OpenADR3_0: false, // TODO:
        Reboot: false,
      },
      device_list: [], // TODO:
      sites_list: siteId,
      user: userEmail,
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUnitsRows]);

  return (
    <Modal
      open={openSiteDashboardBypassUnitsModel}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={getModalStyle(isSmallScreen)}>
        <Typography id="modal-modal-title" variant="h6">
          BYPASS SELECTED UNIT(S)
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <AlertBar
          variant="standard"
          severity={"warning"}
          description={
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              <strong>Warning:</strong>This action will override the settings for all selected units, making the HVAC units operate as if PACE AI
              devices are not installed. The user will be responsible for lost energy savings.
            </Typography>
          }
          show={showModelAlert}
          setShow={setShowModelAlert}
        />
        <Box sx={{ marginTop: "20px" }} />
        <Typography id="modal-modal-title" variant="body1">
          Please review your selection carefully before proceeding:{" "}
        </Typography>
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
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, marginTop: "20px" }}>
          <Button variant="text" color="primary" size="medium" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            onClick={handleUpdateClick}
            sx={{
              backgroundColor: "#D32F2F",
            }}
          >
            bypass units
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
