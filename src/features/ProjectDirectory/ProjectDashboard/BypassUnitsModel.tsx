import { useState } from "react";
import { Box, Typography, Modal, Button, useTheme, useMediaQuery } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";

// import { AlertBar } from "../../../components";
import { bypassRebootOnline } from "../../../services/apis";
import { selectUserEmail } from "../../../redux/Slice/Authentication/AuthenticationSlice";
import { LoadingButton } from "@mui/lab";

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

export default function BypassUnitsModel({
  openBypassUnitsModel,
  setOpenBypassUnitsModel,
  selectedSitesRows,
  setAlertState,
  setEnableSearchQuery,
}: any) {
  const theme = useTheme();
  const userEmail = useSelector(selectUserEmail);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  // const [showAlert, setShowAlert] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsLoading(false);
    setOpenBypassUnitsModel(false);
  };

  const bypassRebootOnlineMutation = useMutation({
    mutationFn: bypassRebootOnline,
    onSuccess: (data) => {
      console.log(" bypassRebootOnline successfully:", data);
      setEnableSearchQuery(true);
      handleClose();
      setAlertState({
        isAlert: true,
        severity: "success",
        title: "",
        description: "PACE AI device on selected site(s) bypassed.",
        resetOpen: true,
      });
    },
    onError: (error) => {
      handleClose();
      console.error("Error  bypassRebootOnline:", error);
      setAlertState({
        isAlert: true,
        severity: "error",
        title: "",
        description: "PACE AI device on selected site(s) was unable to be bypassed, and is still online. Please try again later.",
        resetOpen: true,
      });
    },
  });

  const handleBypassClick = () => {
    setIsLoading(true);
    bypassRebootOnlineMutation.mutate({
      payload: {
        Bypass_Unit: true,
        // OpenADR2_0: false, //Not applicable at site level
        // OpenADR3_0: false, //Not applicable at site level
        Reboot: false,
      },
      // device_list: [], //Not applicable at site level
      sites_list: selectedSitesRows.map((item: any) => item.id),
      user: userEmail,
    });
  };

  return (
    <Modal open={openBypassUnitsModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={getModalStyle(isSmallScreen)}>
        <Typography id="modal-modal-title" variant="h6">
          BYPASS SELECTED UNIT(S)
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        {/* <AlertBar
          severity={"warning"}
          title={"Warning:"}
          description={
            "This action will override the settings for all selected buildings, making the HVAC units operate as if PACE AI devices are not installed. The user will be responsible for lost energy savings. "
          }
          variant={"standard"}
          show={showAlert}
          setShow={setShowAlert}
        /> */}
        <Box sx={{ marginTop: "20px" }} />
        <Typography id="modal-modal-title" variant="body1">
          Please review your selection carefully before proceeding:
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        {selectedSitesRows.map((item: any, index: number) => (
          <Typography id={item.id} variant="body1">
            {index + 1}. {item.name}
          </Typography>
        ))}
        <Box sx={{ marginTop: "20px" }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="text" color="primary" size="medium" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            onClick={handleBypassClick}
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
