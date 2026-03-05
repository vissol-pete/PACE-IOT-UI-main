import { Box, Typography, Link, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function InfoFooter() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const navigate = useNavigate();

  const handleTermsClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate("/terms");
  };

  const handleContactClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate("/contact-us");
  };

  const handlePrivacyClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate("/privacy");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#193561",
        minHeight: "136px",
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          marginTop: "46px",
          color: "white",
        }}
      >
        Looking for an API to use this data on an external application? Please{" "}
        <Link href="#" underline="always" sx={{ color: "#FFFFFF", textDecoration: "underline", fontSize: "16px" }} onClick={handleContactClick}>
          contact us
        </Link>{" "}
        for assistance.
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          marginTop: "24px",
          marginBottom: "16px",
        }}
      >
        <Link href="#" underline="always" sx={{ color: "#FFFFFF", textDecoration: "underline", fontSize: "16px" }} onClick={handleTermsClick}>
          Terms
        </Link>
        <Link href="#" underline="always" sx={{ color: "#FFFFFF", textDecoration: "underline", fontSize: "16px" }} onClick={handlePrivacyClick}>
          Privacy
        </Link>
      </Box>
    </Box>
  );
}
