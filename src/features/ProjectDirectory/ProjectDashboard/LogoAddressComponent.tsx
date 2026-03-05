import { Box, Typography } from "@mui/material";
// import { TensorIoTLogo } from "../../../assets";

export default function LogoAddressComponent({ kpiCardData }: any) {
  return (
    <Box>
      <img src={kpiCardData?.project_data?.logo_url} alt="PaceLogo" width="200" height="45" />
      <Typography id="modal-modal-title" variant="body1">
        {kpiCardData?.project_data?.address_line_1} <br />
        {kpiCardData?.project_data?.address_line_2} <br />
        {kpiCardData?.project_data?.phone_number}
      </Typography>
    </Box>
  );
}
