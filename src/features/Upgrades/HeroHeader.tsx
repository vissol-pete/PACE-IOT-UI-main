import React from 'react';
import { Box, Typography } from '@mui/material';
import HeroImage from "../../assets/Images/hero.png";

const HeroHeader: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',  // Use 100% width, not 100vw, to avoid issues with scrollbars
        maxWidth: '100%', 
         // Ensure it doesn't exceed viewport width
        boxSizing: 'border-box',  // Include padding and border in the width/height
        overflow: 'hidden',  // Prevent any overflow
        backgroundImage: `url(${HeroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: "360px",
      }}
    >
      {/* Blue overlay with opacity */}
      <Box
        sx={{
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#26378CD6',
          height: "220px",
          justifyContent: "center", 
          display: "flex",
          flexDirection: "column",
          padding: "0 16px",  // Padding to prevent overflow on smaller screens
          boxSizing: 'border-box',  // Ensure padding doesn't break the layout
        }}
      >
        {/* Heading text */}
        <Typography
          variant="h1"
          sx={{
            position: 'relative',
            color: '#fff',
            zIndex: 1,
            fontSize: {
              xs: "28px",  // Font size for small screens
              sm: "32px",  // Font size for medium screens
              md: "40px",  // Font size for large screens
            },
            lineHeight: 1.2,
            paddingLeft: "16px",  // Reduce padding on small screens
            paddingRight: "16px",  // To avoid overflow
          }}
        >
          Maximize Your <br /> HVACR Efficiency
        </Typography>

        <Typography
          variant="h3"
          sx={{
            position: 'relative',
            color: '#fff',
            zIndex: 1,
            fontWeight: 400,
            marginTop: "16px",  
            fontSize: {
              xs: "16px",  // Font size for small screens
              sm: "20px",  // Font size for medium screens
              md: "24px",  // Font size for large screens
            },
            lineHeight: 1.4,
            paddingLeft: "16px",
            paddingRight: "16px",  // Ensure no overflow on small screens
          }}
        >
          Save money and enhance operational <br /> sustainability with premium upgrades.
        </Typography>
      </Box>
    </Box>
  );
};

export default HeroHeader;
