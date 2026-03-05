import { Box, Typography, Modal, Button, useTheme, useMediaQuery } from "@mui/material";

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

export default function TakeUnitOnlineModel({ openTakeOnlineUnitModel, setOpenTakeOnlineUnitModel }: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const handleClose = () => setOpenTakeOnlineUnitModel(false);
  const handleSubmit = () => {
    handleClose();
  };

  return (
    <Modal open={openTakeOnlineUnitModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={getModalStyle(isSmallScreen)}>
        <Typography id="modal-modal-title" variant="h6">
          take unit online
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Typography id="modal-modal-title" variant="body1">
          This action will enable the PACE AI device for the selected unit.
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Typography id="modal-modal-title" variant="body1">
          Please review your selection carefully before proceeding:
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Typography id="modal-modal-title" variant="body1">
          1. 101 Pacific Coast Hwy
        </Typography>
        <Typography id="modal-modal-title" variant="body1">
          2. 200 N Main St
        </Typography>
        <Typography id="modal-modal-title" variant="body1">
          3. 500 S Buena Vista St
        </Typography>
        <Typography id="modal-modal-title" variant="body1">
          4. 600 S Maple Ave
        </Typography>
        <Typography id="modal-modal-title" variant="body1">
          5. Headquarters (625 The City Dr S)
        </Typography>
        <Typography id="modal-modal-title" variant="body1">
          6. 7889 Really Really Really Really Very Long Street Name Address Rd Unit 1A
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="text" color="primary" size="medium" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" size="medium" onClick={handleSubmit}>
            take units online
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
