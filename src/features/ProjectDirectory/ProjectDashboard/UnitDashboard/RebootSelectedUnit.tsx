import { Box, Typography, Modal, Button } from "@mui/material";

import { AlertBar } from "../../../../components";
import { useState } from "react";

const getModalStyle = () => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 404,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  maxHeight: "95vh",
  overflowY: "auto",
});

export default function RebootSelectedUnit({ openRebootUnitModel, setOpenRebootUnitModel }: any) {
  const handleClose = () => setOpenRebootUnitModel(false);
  const handleSubmit = () => {
    handleClose();
  };
  const [showAlert, setShowAlert] = useState(true);

  return (
    <Modal open={openRebootUnitModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={getModalStyle}>
        <Typography id="modal-modal-title" variant="h6">
          reboot selected unit
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <AlertBar
          severity={"warning"}
          title={"Warning:"}
          description={"This action will restart the PACE AI device for the selected units."}
          variant={"standard"}
          show={showAlert}
          setShow={setShowAlert}
        />
        <Box sx={{ marginTop: "20px" }} />
        <Typography id="modal-modal-title" variant="body1">
          Please review your selection carefully before proceeding:
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Typography id="modal-modal-title" variant="body1">
          1. 2341H05432
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="text" color="primary" size="medium" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="medium"
            sx={{
              backgroundColor: "#D32F2F",
            }}
            onClick={handleSubmit}
          >
            Reboot
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
