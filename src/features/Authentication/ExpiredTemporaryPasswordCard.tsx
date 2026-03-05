import { Box, Card, CardContent, useMediaQuery, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { PaceLogo } from "../../assets";
import { AlertBar } from "../../components";
import { useEffect } from "react";

export default function ExpiredTemporaryPasswordCard({ authenticationAlert, SetAuthenticationAlert }: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    SetAuthenticationAlert({
      ...authenticationAlert,
      severity: "error",
      showAlert: true,
      title: "Your temporary password has expired.",
      description: "Please contact your administrator for assistance. ",
    });
  }, []);

  const setShowAlert = (show: boolean) => {
    SetAuthenticationAlert({ ...authenticationAlert, showAlert: show });
  };
  return (
    <Card
      sx={{
        width: "375px",
        // height: "442px",
        boxShadow: isSmallScreen ? "none" : undefined,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            marginTop: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={PaceLogo} alt="Pac eLogo" width="209" height="68" object-fit="contain" />
        </Box>
        <Box
          sx={{
            marginTop: "40px",
          }}
        />
        <Typography variant="h4">Temporary password expired</Typography>
        <Box
          sx={{
            marginTop: "25px",
          }}
        />

        <AlertBar
          severity={authenticationAlert?.severity}
          description={authenticationAlert?.description}
          show={authenticationAlert?.showAlert}
          title={authenticationAlert?.title}
          setShow={setShowAlert}
        />
      </CardContent>
    </Card>
  );
}
