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
  padding: "8px",
});

export default function DeleteUserModel({ openDeleteUserModel, setOpenDeleteUserModel, setEnableFetchUserData, setAlertState }: any) {
  const theme = useTheme();
  const selectUserID = useSelector(selectUserId);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isLoading, setIsLoading] = useState(false);

  const deleteSuperAdminMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      console.log("Project deleted successfully:", data);
      setAlertState({ isAlert: true, severity: "success", title: "", description: "User deleted.", resetOpen: true });
      handleClose();
      setEnableFetchUserData(true);
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error creating project:", error);
    },
  });

  const handleClose = () => setOpenDeleteUserModel(false);

  const handleDeleteClick = () => {
    setIsLoading(true);
    deleteSuperAdminMutation.mutate(selectUserID);
  };

  return (
    <Modal open={openDeleteUserModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={getModalStyle(isSmallScreen)}>
        <Box sx={{ marginTop: "8px", marginLeft: "16px", marginRight: "16px" }}>
          <Typography id="modal-modal-title" variant="h6">
            Are you sure you want to delete this user?
          </Typography>
        </Box>
        <Box sx={{ marginTop: "16px", marginLeft: "16px", marginRight: "16px" }}>
          <Typography id="modal-modal-title" variant="body1">
            Proceeding with this action will delete user from the site.
          </Typography>
        </Box>
        <Box sx={{ marginTop: "28px" }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="text" color="primary" size="medium" sx={{ fontSize: "16px", fontWeight: "700" }} onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            onClick={handleDeleteClick}
            sx={{
              backgroundColor: "#D32F2F",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            delete user
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
