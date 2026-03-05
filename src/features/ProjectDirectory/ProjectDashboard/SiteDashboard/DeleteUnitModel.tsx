import { useState } from "react";
import { Box, Typography, Modal, Button, useTheme, useMediaQuery } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { deleteUnit } from "../../../../services/apis";
import { selectUnitId } from "../../../../redux/Slice/SiteDirectory/SiteDirectorySlice";

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

export default function DeleteUnitModel({ openDeleteUnitModel, setOpenDeleteUnitModel, setEnableSearchQuery, addUnit, setAlertState }: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isLoading, setIsLoading] = useState(false);
  const selectedUnitID = useSelector(selectUnitId);

  const deleteMutation = useMutation({
    mutationFn: deleteUnit,
    onSuccess: (data) => {
      console.log("Unit deleted successfully:", data);
      setOpenDeleteUnitModel(false);
      setEnableSearchQuery(true);
      setIsLoading(false);
      setAlertState({ isAlert: true, severity: "success", title: "", description: "Unit deleted.", resetOpen: true });
    },
    onError: (error) => {
      setIsLoading(false);
      setAlertState({
        isAlert: true,
        severity: "error",
        title: "",
        description: "Unit was unable to be deleted. Please try again later. ",
        resetOpen: true,
      });

      console.error("Error creating project:", error);
    },
  });

  const handleClose = () => setOpenDeleteUnitModel(false);

  const handleDeleteClick = () => {
    setIsLoading(true);
    deleteMutation.mutate(selectedUnitID);
  };

  return (
    <Modal open={openDeleteUnitModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={getModalStyle(isSmallScreen)}>
        <Typography id="modal-modal-title" variant="h6">
          Are you sure you want to delete this Unit?
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Typography id="modal-modal-title" variant="body1">
          Proceeding with this action will delete the unit and its associated device.
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Typography id="modal-modal-title" variant="body1">
          <strong>Unit</strong>: {addUnit?.name}
        </Typography>
        <Typography id="modal-modal-title" variant="body1">
          <strong>PACE AI device</strong>: {addUnit?.pace_ai_device_id}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="text" color="primary" size="medium" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            onClick={handleDeleteClick}
            sx={{
              backgroundColor: "#D32F2F",
            }}
          >
            Delete
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
