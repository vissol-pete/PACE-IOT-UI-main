import { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { VisibilityOff, RemoveRedEye } from "@mui/icons-material";
import { confirmSignIn } from "aws-amplify/auth";

import { PaceLogo } from "../../assets";
import { AlertBar } from "../../components";

export default function NewUserResetPassword({ setAuthWindowType }: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  // const [forgotPasswordError, setForgotPasswordError] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwChar, setPwChar] = useState(false);
  const [pwCap, setPwCap] = useState(false);
  const [pwLower, setPwLower] = useState(false);
  const [pwNum, setPwNum] = useState(false);
  const [pwSpecial, setPwSpecial] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const setShowAlertBar = (show: boolean) => {
    setShowAlert(show);
  };
  const handlePasswordChange = (event: any) => {
    const value = event.target.value;
    setPassword(value);
    setPwChar(value.length >= 8);
    setPwCap(/[A-Z]/.test(value));
    setPwLower(/[a-z]/.test(value));
    setPwNum(/[0-9]/.test(value));
    setPwSpecial(/[^A-Za-z0-9]/.test(value));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // All conditions are fulfilled if all states are true
  const allConditionsMet = pwChar && pwCap && pwLower && pwNum && pwSpecial;

  async function handleSubmit() {
    try {
      const confirmSignInResult = await confirmSignIn({
        challengeResponse: password,
      });
      console.log("confirmSignInResult", confirmSignInResult);
    } catch (error: any) {
      console.error("Error signing in:", error);
      // console.log(error?.name);
      if (error.name === "NotAuthorizedException") {
        // setSignInError(true);
        // setSignInErrorText("Incorrect username or password.");
      } else {
        // Handle general errors
      }
    }
  }

  return (
    <Card
      sx={{
        width: "375px",
        boxShadow: isSmallScreen ? "none" : undefined,
        overflowY: "auto",
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
          severity={"info"}
          title={"Welcome!"}
          description={"Please reset your password to complete your registration."}
          show={showAlert}
          setShow={setShowAlertBar}
        />
        <Box
          sx={{
            marginTop: "40px",
          }}
        />
        <Typography variant="h4" align="left">
          Reset password
        </Typography>

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
          <FormControlLabel control={<Radio checked={pwLower} />} label="At least 1 lower case letter" disabled={!pwCap} />
          <FormControlLabel control={<Radio checked={pwNum} />} label="At least 1 number" disabled={!pwCap} />
          <FormControlLabel control={<Radio checked={pwSpecial} />} label="At least 1 special character" disabled={!pwCap} />
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
          onClick={() => setAuthWindowType("signIn")}
        >
          Back to log in
        </Button>
      </CardContent>
    </Card>
  );
}
