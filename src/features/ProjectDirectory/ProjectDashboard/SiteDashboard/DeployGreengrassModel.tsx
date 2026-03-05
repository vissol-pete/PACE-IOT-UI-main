import { useState, useEffect } from "react";
import { Box, Typography, Modal, Button, useTheme, useMediaQuery } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSelector } from "react-redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMutation } from "@tanstack/react-query";

import { selectUnitId } from "../../../../redux/Slice/SiteDirectory/SiteDirectorySlice";
import { AlertBar } from "../../../../components";
import { UnitsModelTableRow } from "../../../../types";
import { deployGreengrass } from "../../../../services/apis";

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

export default function DeployGreengrassModel({
  openDeployGreengrassModel,
  setOpenDeployGreengrassModel,
  showModelAlert,
  setShowModelAlert,
  selectedUnitsRows,
  selectedUnitsFilteredRows,
  setSelectedUnitsFilteredRows,
  setAlertState,
}: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isLoading, setIsLoading] = useState(false);
  const selectedUnitID = useSelector(selectUnitId);

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

  const handleClose = () => setOpenDeployGreengrassModel(false);

  const deployGreengrassMutation = useMutation({
    mutationFn: deployGreengrass,
    onSuccess: (data) => {
      console.log("Greengrass deployed successfully:", data);
      setIsLoading(false);
      setAlertState({
        isAlert: true,
        severity: "success",
        title: "",
        description: "Greengrass OTA on the PACE AI device for selected unit(s) updated.",
        resetOpen: true,
      });
      handleClose();
    },
    onError: (error) => {
      console.error("Error in Greengrass deployment:", error);
      setIsLoading(false);
      handleClose();
      setAlertState({
        isAlert: true,
        severity: "error",
        title: "",
        description: "Greengrass OTA on the PACE AI device for the selected unit(s) was unable to be updated. Please try again later.",
        resetOpen: true,
      });
    },
  });

  const handleUpdateClick = () => {
    setIsLoading(true);
    deployGreengrassMutation.mutate();
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
    <Modal open={openDeployGreengrassModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={getModalStyle(isSmallScreen)}>
        <Typography id="modal-modal-title" variant="h6">
          DEPLOY GREENGRASS OTA FOR SELECTED UNIT(S)
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <AlertBar
          variant="standard"
          severity={"warning"}
          title={<Typography sx={{ fontSize: "14px", fontWeight: "700" }}>Warning: Prerequisites for greengrass deployment OTA</Typography>}
          description={
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Make sure you have completed the following steps before triggering a Greengrass OTA deployment: <br />
              <br />
              <Box component="span" sx={{ display: "inline-flex", alignItems: "flex-start" }}>
                <Box component="span" sx={{ fontWeight: "bold", marginRight: "4px" }}>
                  1.
                </Box>
                <Box component="span">
                  <strong>Clone the codebase</strong> from the main branch.
                </Box>
              </Box>
              <br />
              <Box component="span" sx={{ display: "inline-flex", alignItems: "flex-start" }}>
                <Box component="span" sx={{ fontWeight: "bold", marginRight: "4px" }}>
                  2.
                </Box>
                <Box component="span">
                  <strong>Create a local GitHub branch</strong> from the main branch (e.g., dev_branch).
                </Box>
              </Box>
              <br />
              <Box component="span" sx={{ display: "inline-flex", alignItems: "flex-start" }}>
                <Box component="span" sx={{ fontWeight: "bold", marginRight: "4px" }}>
                  3.
                </Box>
                <Box component="span">
                  <strong>Update the Greengrass custom component codebase </strong>(pace.ai.data.publisher).
                </Box>
              </Box>
              <br />
              <Box component="span" sx={{ display: "inline-flex", alignItems: "flex-start" }}>
                <Box component="span" sx={{ fontWeight: "bold", marginRight: "4px" }}>
                  4.
                </Box>
                <Box component="span">
                  {" "}
                  <strong>Push your local GitHub branch</strong> (dev_branch) to the GitHub repository.
                </Box>
              </Box>
              <br />
              <Box component="span" sx={{ display: "inline-flex", alignItems: "flex-start" }}>
                <Box component="span" sx={{ fontWeight: "bold", marginRight: "4px" }}>
                  5.
                </Box>
                <Box component="span">
                  <strong> Merge your local branch</strong> (dev_branch) into the main branch. This will trigger the CI/CD pipeline, updating the
                  Greengrass component (S3 & IoT Core).
                </Box>
              </Box>
              <br />
              <br />
              Once you have completed these steps, triggering a Greengrass OTA deployment will send the updated code to every selected unit in the
              table.
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
          <LoadingButton loading={isLoading} variant="contained" onClick={handleUpdateClick}>
            deploy greengrass
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
