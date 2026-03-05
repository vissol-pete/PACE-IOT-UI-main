import { useState } from "react";
import { Box, Typography, Modal, Button, useTheme, useMediaQuery } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import LoadingButton from "@mui/lab/LoadingButton";

import { deleteUser } from "../../../services/apis";
import { selectUserId } from "../../../redux/Slice/ProjectDirectory/ProjectDirectorySlice";

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

export default function DeleteSuperAdminModel({
  openDeleteSuperAdminModel,
  setOpenDeleteSuperAdminModel,
  setEnableFetchUserData,
  setAlertState,
}: any) {
  const theme = useTheme();
  const selectUserID = useSelector(selectUserId);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isLoading, setIsLoading] = useState(false);

  const deleteSuperAdminMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      console.log("Project deleted successfully:", data);
      setAlertState({ isAlert: true, severity: "success", title: "", description: "User deleted.", resetOpen: true });
      setEnableFetchUserData(true);
      handleClose();
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error creating project:", error);
    },
  });

  const handleClose = () => setOpenDeleteSuperAdminModel(false);

  const handleDeleteClick = () => {
    setIsLoading(true);
    deleteSuperAdminMutation.mutate(selectUserID);
  };

  return (
    <Modal open={openDeleteSuperAdminModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={getModalStyle(isSmallScreen)}>
        <Typography id="modal-modal-title" variant="h6">
          Are you sure you want to delete this super admin?
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Typography id="modal-modal-title" variant="body1">
          Proceeding with this action will delete the super admin from the list.
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
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
            delete super admin
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
