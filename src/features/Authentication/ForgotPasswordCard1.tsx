import { useState } from "react";

import { Box, Card, CardContent, TextField, Button, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { resetPassword } from "aws-amplify/auth";

import { PaceLogo } from "../../assets";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function ForgotPasswordCard1({ setAuthWindowType, email, setEmail }: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [error, setError] = useState(false);

  const handleEmailChange = (event: any) => {
    const value = event.target.value;
    console.log("test email ", value);
    setEmail(value);
    setError(!isValidEmail(value));
  };

  async function handleSubmit() {
    try {
      const output = await resetPassword({
        username: email,
      });
      console.log(output);
      setAuthWindowType("ForgotPassword2");
    } catch (error: any) {
      console.error("Error:", error);
    }
  }

  const isFormValid = () => {
    // return !error && isValidEmail(email) && password?.trim() !== "";
    return isValidEmail(email);
  };

  return (
    <Card
      sx={{
        width: "375px",
        boxShadow: isSmallScreen ? "none" : undefined,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box
          sx={{
            marginTop: "40px",
          }}
        />
        <img src={PaceLogo} alt="Pac eLogo" width="209" height="68" object-fit="contain" style={{ alignSelf: "center" }} />
        <Box
          sx={{
            marginTop: "40px",
          }}
        />
        <Typography variant="h4" align="left">
          Forgot password?
        </Typography>
        <Box sx={{ marginTop: "4px" }} />
        <Typography variant="body1" align="left">
          Please enter your email address. If the email address is in our system, you will receive a code to reset your password.{" "}
        </Typography>

        <TextField
          type="email"
          label="Email address"
          value={email}
          variant="outlined"
          size="medium"
          onChange={handleEmailChange}
          error={error}
          helperText={error ? "Please enter a valid email address." : ""}
          sx={{
            width: "100%",
            marginTop: "16px",
          }}
        />

        <Button
          disabled={!isFormValid()}
          variant="contained"
          color="primary"
          size="medium"
          sx={{
            width: "100%",
            marginTop: "20px",
          }}
          onClick={handleSubmit}
        >
          email code
        </Button>
        <Button
          variant="text"
          color="primary"
          sx={{
            marginTop: "20px",
            textTransform: "none",
          }}
          onClick={() => setAuthWindowType("signIn")}
        >
          <u>Back to log in</u>
        </Button>
      </CardContent>
    </Card>
  );
}
