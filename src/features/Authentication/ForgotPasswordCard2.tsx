import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  FormControlLabel,
  Radio,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { VisibilityOff, RemoveRedEye } from "@mui/icons-material";
import { confirmResetPassword, resetPassword } from "aws-amplify/auth";

import { PaceLogo } from "../../assets";
import { AlertBar } from "../../components";

export default function ForgotPasswordCard2({ setAuthWindowType, email, authenticationAlert, SetAuthenticationAlert }: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [alertBarErrorType, setAlertBarErrorType] = useState("info");
  const [alertBarErrorTitle, setAlertBarErrorTitle] = useState("We emailed you.");
  const [alertBarErrorDescription, setAlertBarErrorDescription] = useState("Your code is on the way. It may take a minute to arrive.");
  // const [forgotPasswordError, setForgotPasswordError] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [pwChar, setPwChar] = useState(false);
  const [pwCap, setPwCap] = useState(false);
  const [pwLower, setPwLower] = useState(false);
  const [pwNum, setPwNum] = useState(false);
  const [pwSpecial, setPwSpecial] = useState(false);
  const setShowAlert = (show: boolean) => {
    SetAuthenticationAlert({ ...authenticationAlert, showAlert: show });
  };
  useEffect(() => {
    setShowAlert(true);
  }, []);

  const handleCodeChange = (event: any) => {
    const value = event.target.value;
    setCode(value);
  };

  const handlePasswordChange = (event: any) => {
    const value = event.target.value;
    setPassword(value);
    checkPasswordConditions(value);
  };

  const checkPasswordConditions = (value: any) => {
    setPwChar(value.length >= 8);
    setPwCap(/[A-Z]/.test(value));
    setPwLower(/[a-z]/.test(value));
    setPwNum(/[0-9]/.test(value));
    setPwSpecial(/[^A-Za-z0-9]/.test(value));
  };

  const allConditionsMet = pwChar && pwCap && pwLower && pwNum && pwSpecial && code;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit() {
    try {
      const output = await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: password,
      });
      console.log(output);
      setAuthWindowType("signIn");
      SetAuthenticationAlert({
        // ...authenticationAlert,
        showAlert: true,
        severity: "success",
        title: "",
        description: "Password successfully reset.",
      });
    } catch (error: any) {
      console.error("Error:", error);
      setShowAlert(true);
      setAlertBarErrorType("error");
      setPassword("");
      setCode("");
      checkPasswordConditions("");
      if (error?.toString().includes("CodeMismatchException")) {
        setAlertBarErrorTitle("Invalid code.");
        setAlertBarErrorDescription("REQUEST NEW CODE");
      } else if (error?.toString().includes("ExpiredCodeException")) {
        setAlertBarErrorTitle("That reset code has expired. ");
        setAlertBarErrorDescription("REQUEST NEW CODE");
      } else if (error?.toString().includes("LimitExceededException")) {
        setAlertBarErrorTitle("Try again later");
        setAlertBarErrorDescription(
          "You’ve reached the maximum number of attempts to enter the code. Please wait a few minutes before trying again."
        );
      } else {
        setAlertBarErrorTitle("An unknown error occurred.");
        setAlertBarErrorDescription("Please try again later.");
      }
    }
  }

  async function resendCode() {
    try {
      const output = await resetPassword({
        username: email,
      });
      console.log(output);
      setShowAlert(true);
      setAlertBarErrorType("info");
      setAlertBarErrorTitle("Code resent.");
    } catch (error: any) {
      console.error("Error:", error);
      setShowAlert(true);
      setAlertBarErrorType("error");
      setAlertBarErrorTitle("Failed to send code.");
      setAlertBarErrorDescription("");
    }
  }

  return (
    <Card
      sx={{
        width: "375px",
        boxShadow: isSmallScreen ? "none" : undefined,
        overflowY: "auto",
        marginTop: "50px",
        marginBottom: "50px",
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
        <AlertBar
          severity={alertBarErrorType}
          title={alertBarErrorTitle}
          description={alertBarErrorDescription}
          show={authenticationAlert?.showAlert}
          setShow={setShowAlert}
        />
        <Box
          sx={{
            marginTop: "20px",
          }}
        />
        <Typography variant="h4" align="left">
          Reset password
        </Typography>
        <Button
          variant="text"
          color="primary"
          sx={{
            justifyContent: "flex-start",
            padding: 0,
            marginY: "10px",
            textTransform: "none",
          }}
          onClick={resendCode}
        >
          <u>Resend code</u>
        </Button>
        <TextField
          label="Code"
          value={code}
          variant="outlined"
          size="medium"
          onChange={handleCodeChange}
          type="number"
          autoComplete="off"
          sx={{
            width: "100%",
            "& input[type=number]": {
              MozAppearance: "textfield", // Firefox
            },
            "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
              WebkitAppearance: "none", // Chrome, Safari, Edge
              margin: 0,
            },
          }}
        />
        <TextField
          label="Enter your new password"
          value={password}
          variant="outlined"
          size="medium"
          onChange={handlePasswordChange}
          error={false}
          sx={{
            width: "100%",
            marginTop: "25px",
          }}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <RemoveRedEye />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box
          sx={{
            marginLeft: "10px",
            marginTop: "10px",
          }}
        >
          <FormControlLabel control={<Radio checked={pwChar} />} label="At least 8 characters" disabled={!pwChar} />
          <FormControlLabel control={<Radio checked={pwCap} />} label="At least 1 upper case letter" disabled={!pwCap} />
          <FormControlLabel control={<Radio checked={pwLower} />} label="At least 1 lower case letter" disabled={!pwLower} />
          <FormControlLabel control={<Radio checked={pwNum} />} label="At least 1 number" disabled={!pwNum} />
          <FormControlLabel control={<Radio checked={pwSpecial} />} label="At least 1 special character" disabled={!pwSpecial} />
        </Box>
        <Button
          disabled={!allConditionsMet}
          variant="contained"
          color="primary"
          sx={{
            width: "100%",
            marginTop: "20px",
          }}
          onClick={handleSubmit}
        >
          reset password
        </Button>
        <Button
          variant="text"
          color="primary"
          sx={{
            marginTop: "20px",
            textTransform: "none",
          }}
          onClick={() => {
            setShowAlert(false);
            setAuthWindowType("signIn");
          }}
        >
          Back to log in
        </Button>
      </CardContent>
    </Card>
  );
}
