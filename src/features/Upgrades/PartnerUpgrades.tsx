import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import PaidIcon from '@mui/icons-material/Paid';
import { useNavigate } from 'react-router-dom';

// Text content variables
const sectionTitle = "Partner Upgrades";

const demandResponseTitle = "DEMAND RESPONSE PROGRAMS WITH LOCAL UTILITY COMPANIES";
const demandResponseDescription = `Cut utility bills with demand response programs by managing peak electricity use. PACE AI partners with local utilities to help \nintegrate these programs, keeping your comfort unaffected.`;
const demandResponseButtonText = "Learn more about demand response";

const insurtechTitle = "INSURTECH WITH MUNICH RE";
const insurtechDescription = `At PACE AI, we offer solutions to keep your business resilient against disruptions. Partnering with Munich Re, we connect you \nwith Insurtech Services to protect your operations.`;
const insurtechButtonText = "Learn more about Insurtech offerings";
const contact = "Contact us";

// Common style variables
const cardContainerStyles = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'center' },
  justifyContent: 'space-between',
  padding: '20px',
  backgroundColor: '#F9F9F9',
  borderRadius: '8px',
  marginBottom: '16px',
  width: '100%',
  minHeight: '248px',
};

const iconStyles = {
  opacity: 0.1,
  fontSize: { xs: '80px', sm: '100px' },
  width: { xs: '80px', sm: '150px' },
  height: { xs: '80px', sm: '150px' },
  alignSelf: { xs: 'center', sm: 'flex-end' },
  marginTop: { xs: '16px', sm: 0 },
};

const textBoxStyles = {
  marginTop: '8px',
  maxWidth: '100%',
  flexGrow: 1,
  whiteSpace: 'pre-line',
};

const buttonStyles = {
  marginTop: '16px',
  minWidth: '288px',
};

const linkStyles = {
  marginTop: '12px',
  display: 'block',
  color: '#000',
  textDecoration: 'underline',
};

const PartnerUpgrades: React.FC = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact-us');
  };

  return (
    <Box sx={{ marginTop: "36px" }}>
      <Typography variant="h2" gutterBottom sx={{ marginBottom: "16px" }}>
        {sectionTitle}
      </Typography>

      {/* First Card - Demand Response Programs */}
      <Box sx={cardContainerStyles}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h3" fontWeight="bold">
            {demandResponseTitle}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={textBoxStyles}>
            {demandResponseDescription}
          </Typography>
          <Button variant="outlined" sx={buttonStyles} onClick={handleContactClick}>
            {contact}
          </Button>
          <a href="https://www.sdge.com/businesses/savings-center/energy-management-programs/demand-response" target="_blank" rel="noopener noreferrer" style={linkStyles}>
            Learn more about demand response
          </a>
        </Box>
        <EnergySavingsLeafIcon sx={iconStyles} />
      </Box>

      {/* Second Card - Insurtech with Munich Re */}
      <Box sx={cardContainerStyles}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h3" fontWeight="bold">
            {insurtechTitle}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={textBoxStyles}>
            {insurtechDescription}
          </Typography>
          <Button variant="outlined" sx={buttonStyles} onClick={handleContactClick}>
            {contact}
          </Button>
          <a href="https://www.munichre.com/digital-partners/en.html" target="_blank" rel="noopener noreferrer" style={linkStyles}>
            Learn more about Insurtech offerings
          </a>
        </Box>
        <PaidIcon sx={iconStyles} />
      </Box>
    </Box>
  );
};

export default PartnerUpgrades;
