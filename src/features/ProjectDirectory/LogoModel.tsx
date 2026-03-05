import { Box, Typography, Modal, Button } from "@mui/material";

// import { TensorIoTLogo } from "../../assets";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 444,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

export default function LogoModel({ openLogoModel, setOpenLogoModel, logoPreviewURL }: any) {
  const handleClose = () => setOpenLogoModel(false);
  // console.log("logoPreviewURL ", logoPreviewURL);

  return (
    <Modal open={openLogoModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6">
          Logo preview
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={logoPreviewURL}
            alt="Pac eLogo"
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "200px",
              objectFit: "contain",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" size="medium" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
