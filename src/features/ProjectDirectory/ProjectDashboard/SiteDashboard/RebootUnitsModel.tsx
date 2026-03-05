import { useState, useEffect } from "react";
import { Box, Typography, Modal, Button, useTheme, useMediaQuery } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSelector } from "react-redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { selectUnitId } from "../../../../redux/Slice/SiteDirectory/SiteDirectorySlice";
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

export default function RebootUnitsModel({
  openRebootUnitsModel,
  setOpenRebootUnitsModel,
  showModelAlert,
  setShowModelAlert,
  selectedUnitsRows,
  selectedUnitsFilteredRows,
  setSelectedUnitsFilteredRows,
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

  const handleClose = () => setOpenRebootUnitsModel(false);

  const handleUpdateClick = () => {
    setIsLoading(true);
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
    <Modal open={openRebootUnitsModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={getModalStyle(isSmallScreen)}>
        <Typography id="modal-modal-title" variant="h6">
          REBOOT SELECTED UNIT(S)
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
              <strong>Warning:</strong>This action will restart the PACE AI devices for all selected units.
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
            reboot units
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
