import { useState } from "react";
import { Box, Typography, Modal, Button, useTheme, useMediaQuery } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { deleteSite } from "../../../services/apis";
import { selectSiteId } from "../../../redux/Slice/ProjectDirectory/ProjectDirectorySlice";

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

export default function DeleteSiteModel({ openDeleteSiteModel, setOpenDeleteSiteModel, setEnableSearchQuery, setAlertState }: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isLoading, setIsLoading] = useState(false);
  const selectedSiteID = useSelector(selectSiteId);

  const deleteMutation = useMutation({
    mutationFn: deleteSite,
    onSuccess: (data) => {
      console.log("Site deleted successfully:", data);
      setOpenDeleteSiteModel(false);
      setEnableSearchQuery(true);
      setIsLoading(false);
      setAlertState({ isAlert: true, severity: "success", title: "", description: "Site deleted.", resetOpen: true });
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error creating project:", error);
    },
  });

  const handleClose = () => setOpenDeleteSiteModel(false);

  const handleDeleteClick = () => {
    setIsLoading(true);
    deleteMutation.mutate(selectedSiteID);
  };

  return (
    <Modal open={openDeleteSiteModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={getModalStyle(isSmallScreen)}>
        <Typography id="modal-modal-title" variant="h6">
          Are you sure you want to delete this site?
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Typography id="modal-modal-title" variant="body1">
          Proceeding with this action will delete the site and its associated units.
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
