import { useState } from "react";
import { Box, Typography, useMediaQuery, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { AuthenticationWindowType, AuthenticationAlert } from "../../types";
import { SignInCard, NewUserResetPassword, ForgotPasswordCard1, ForgotPasswordCard2, ExpiredTemporaryPasswordCard } from "../../features";

export default function Authentication() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [email, setEmail] = useState("");
  const [authWindowType, setAuthWindowType] = useState<AuthenticationWindowType>("signIn");
  const [authenticationAlert, SetAuthenticationAlert] = useState<AuthenticationAlert>();
  const navigate = useNavigate();

  const handleTermsClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate("/terms");
  };

  const handlePrivacyClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate("/privacy");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
          backgroundColor: isSmallScreen ? "#FFFFFF" : "#F4F4F4",
          flexDirection: "column",
        }}
      >
        {authWindowType === "signIn" && (
          <SignInCard
            setAuthWindowType={setAuthWindowType}
            email={email}
            setEmail={setEmail}
            authenticationAlert={authenticationAlert}
            SetAuthenticationAlert={SetAuthenticationAlert}
          />
        )}
        {authWindowType === "expiredTemporaryPassword" && (
          <ExpiredTemporaryPasswordCard authenticationAlert={authenticationAlert} SetAuthenticationAlert={SetAuthenticationAlert} />
        )}
        {authWindowType === "newUserResetPassword" && <NewUserResetPassword setAuthWindowType={setAuthWindowType} email={email} />}
        {authWindowType === "forgotPassword1" && <ForgotPasswordCard1 setAuthWindowType={setAuthWindowType} email={email} setEmail={setEmail} />}
        {authWindowType === "ForgotPassword2" && (
          <ForgotPasswordCard2
            setAuthWindowType={setAuthWindowType}
            email={email}
            authenticationAlert={authenticationAlert}
            SetAuthenticationAlert={SetAuthenticationAlert}
          />
        )}
      </Box>
      <Box
        sx={{
          backgroundColor: "#193561",
          height: "136px",
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
          To create a new account, please contact your administrator.
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
    </Box>
  );
}
