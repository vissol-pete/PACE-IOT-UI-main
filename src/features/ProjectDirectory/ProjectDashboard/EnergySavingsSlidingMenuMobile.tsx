import { Paper, Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const titleStyles = {
  fontSize: "40px",
  fontWeight: "700",
  color: "primary.main",
};

const subtitleStyles = {
  fontSize: "14px",
  fontWeight: "700",
  color: "text.secondary",
  textTransform: "uppercase",
};

export default function EnergySavingsSlidingMenuMobile({ kpiCardData }: any) {
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? 1 : prev - 1));
  };

  return (
    <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          width: "200%",
          transition: "transform 0.5s ease",
          transform: `translateX(${(-activeIndex * 100) / 2}%)`,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography sx={titleStyles} align="center">
              {kpiCardData?.energy_savings_data?.total_savings}
            </Typography>
            <Typography sx={subtitleStyles} align="center">
              energy savings
            </Typography>
          </Box>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            // height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography sx={titleStyles} align="center">
              {kpiCardData?.energy_savings_data?.carbon_reduction_savings}
            </Typography>
            <Typography sx={subtitleStyles} align="center">
              carbon reduction
              <br />
              savings (mTons)
            </Typography>
          </Box>
        </Paper>
      </Box>

      <IconButton
        onClick={handlePrev}
        sx={{
          position: "absolute",
          top: "50%",
          left: isExtraSmallScreen ? "40px" : isSmallScreen ? "120px" : isMediumScreen ? "290px" : "350px",
          transform: "translateY(-50%)",
        }}
      >
        <ArrowBackIosIcon />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          top: "50%",
          right: isExtraSmallScreen ? "40px" : isSmallScreen ? "120px" : isMediumScreen ? "290px" : "350px",
          transform: "translateY(-50%)",
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        {[0, 1].map((_, index) => (
          <IconButton key={index} onClick={() => setActiveIndex(index)}>
            <FiberManualRecordIcon fontSize="small" color={index === activeIndex ? "primary" : "disabled"} />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
}
