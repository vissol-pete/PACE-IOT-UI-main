import { Avatar, Box, Card, CardContent, Divider, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { useMediaQuery } from '@mui/material';
import { useTheme } from "@mui/material/styles";


export default function ImmediateContactUsCard() {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card
        sx={{
          boxShadow: 'none',
        }}
      >
        <CardContent sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Box sx={{
            display: 'flex',
            gap: 3,
            flexDirection: 'column'
          }}>
            <Typography variant="h5" color="primary">
              Need immediate assistance? Contact us directly:
            </Typography>
            <Typography variant="h6">Support for pace ai suite and all other queries:</Typography>
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Avatar sx={{ bgcolor: (theme) => theme.palette.primary.main }}>
                <EmailIcon />
              </Avatar>
              <Typography variant="body1">
                <a href="mailto:pm@pacecontrols.com" style={{ color: "#193561" }}>
                  pm@pacecontrols.com
                </a>
              </Typography>
            </Box>
            <Box sx={{ marginTop: "20px" }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar sx={{ bgcolor: (theme) => theme.palette.primary.main }}>
                <PhoneIphoneIcon />
              </Avatar>
              {
                isMobile ?
                  (
                    <Typography variant="body1">
                      <a href="tel:+18777234822" style={{ color: "#193561", textDecoration: "none" }}>
                        1-877-PACE-HVAC
                      </a>
                    </Typography>
                  ) : (
                    <Typography variant="body1">1-877-PACE-HVAC</Typography>
                  )
              }
            </Box>
          </Box>
          {/* <Box sx={{ marginTop: "20px" }} /> */}
          <Divider />
          {/* <Box sx={{ marginTop: "20px" }} /> */}
          <Typography variant="h6">IT support for web application:</Typography>
          {/* <Box sx={{ marginTop: "20px" }} /> */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar sx={{ bgcolor: (theme) => theme.palette.primary.main }}>
              <EmailIcon />
            </Avatar>
            <Typography variant="body1">
              <a href="mailto:techgroup@pacecontrols.com" style={{ color: "#193561" }}>
                techgroup@pacecontrols.com
              </a>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
