import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cached from "@mui/icons-material/Cached";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Close from "@mui/icons-material/Close";
import { Container, TextField, Button, Typography, Box, RadioGroup, Radio, FormControlLabel, Alert, useMediaQuery } from "@mui/material";
import { getCurrentUser, resetPassword, confirmResetPassword } from "aws-amplify/auth";
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@mui/material/styles";
import { InfoFooter } from "../../features";

import { setBreadcrumbText, setHeaderText } from "../../redux/Slice/Navigation/NavigationSlice";
import { AlertBar } from "../../components";
import { AuthenticationAlert } from "../../types";

const defaultPasswordCriteria = {
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
  specialChar: false,
};

export default function Settings() {
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState(defaultPasswordCriteria);
  const theme = useTheme();
  const [resetButton, setRessetButton] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [authenticationAlert, SetAuthenticationAlert] = useState<AuthenticationAlert>({
    showAlert: false,
    severity: "info",
    title: "We emailed you.",
    description: "Your code is on the way. It may take a minute to arrive.",
  });

  const setShowAlert = (show: boolean) => {
    SetAuthenticationAlert({ ...authenticationAlert, showAlert: show });
  };

  const handlePasswordChange = (password: string) => {
    setNewPassword(password);
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    });
  };

  const createPasswordCriteriaLabel = (label: string, checked: boolean, value: string) => {
    return (
      <FormControlLabel
        value={value}
        control={<Radio checked={checked} />}
        label={label}
        sx={{
          color: checked ? "" : "gray",
        }}
      />
    );
  };

  useEffect(() => {
    if (newPassword.length > 0) {
      handlePasswordChange(newPassword);
    }
  }, [newPassword]);

  const isPasswordValid =
    passwordCriteria.length &&
    passwordCriteria.uppercase &&
    passwordCriteria.lowercase &&
    passwordCriteria.number &&
    passwordCriteria.specialChar &&
    code;

  useEffect(() => {
    if (tab === 0) {
      dispatch(setBreadcrumbText(["Settings"]));
      dispatch(setHeaderText("Settings"));
    } else {
      dispatch(setBreadcrumbText(["Settings", "Reset Password"]));
      dispatch(setHeaderText("Reset Password"));
      sendResetCode();
    }
  }, [tab]);

  // handle API call here
  const handleUpdatePassword = () => {
    handleConfirmNewPassword(code, newPassword);
  };

  async function sendResetCode() {
    try {
      const user = await getCurrentUser();
      const email = user.username; // Get user's email

      const resetInput = {
        username: email,
      };

      await resetPassword(resetInput); // Send verification code to email
      console.log("Verification code sent to:", email);
      SetAuthenticationAlert({
        showAlert: true,
        severity: "info",
        title: "We emailed you.",
        description: "Your code is on the way. It may take a minute to arrive.",
      });
    } catch (error) {
      console.error("Error sending reset code:", error);
      setNewPassword("");
      setCode("");
      setPasswordCriteria(defaultPasswordCriteria);
      if (error?.toString().includes("LimitExceededException")) {
        SetAuthenticationAlert({
          showAlert: true,
          severity: "error",
          title: "Try again later",
          description: "You’ve reached the maximum number of attempts to enter the code. Please wait a few minutes before trying again.",
        });
      } else {
        SetAuthenticationAlert({
          showAlert: true,
          severity: "error",
          title: "Failed to send code.",
          description: "",
        });
      }
    }
  }

  async function handleConfirmNewPassword(code: string, newPassword: string) {
    try {
      const user = await getCurrentUser();
      const email = user.username; // Get user's email

      const output = await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      });
      console.log(output);
      console.log("Password successfully reset.");
      setCode("");
      setNewPassword("");
      setPasswordCriteria(defaultPasswordCriteria);
      SetAuthenticationAlert({
        showAlert: true,
        severity: "success",
        title: "",
        description: "Password updated.",
      });
    } catch (error) {
      console.error("Error confirming reset password:", error);
      setNewPassword("");
      setCode("");
      setPasswordCriteria(defaultPasswordCriteria);
      if (error?.toString().includes("CodeMismatchException")) {
        SetAuthenticationAlert({
          showAlert: true,
          severity: "error",
          title: "Invalid code.",
          description: "REQUEST NEW CODE",
        });
      } else if (error?.toString().includes("ExpiredCodeException")) {
        SetAuthenticationAlert({
          showAlert: true,
          severity: "error",
          title: "That reset code has expired.",
          description: "REQUEST NEW CODE",
        });
      } else if (error?.toString().includes("LimitExceededException")) {
        SetAuthenticationAlert({
          showAlert: true,
          severity: "error",
          title: "Try again later",
          description: "You’ve reached the maximum number of attempts to enter the code. Please wait a few minutes before trying again.",
        });
      } else {
        SetAuthenticationAlert({
          showAlert: true,
          severity: "error",
          title: "An unknown error occurred.",
          description: "Please try again later.",
        });
      }
    }
  }

  return tab === 0 ? (
    <Box sx={{ minHeight: "92vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ padding: "24px" }}>
        <Button
          variant="contained"
          startIcon={<Cached />}
          onClick={() => setTab(1)}
          sx={{
            [theme.breakpoints.down("sm")]: {
              width: "100%",
            },
          }}
        >
          Reset Password
        </Button>
      </Box>
      <Box sx={{ mt: "auto", width: "100%" }}>
        <InfoFooter />
      </Box>
    </Box>
  ) : (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "24px",
            position: "relative",
            marginTop: authenticationAlert?.showAlert ? "24px" : "0",
            flexDirection: authenticationAlert?.showAlert ? "column" : "row",
            borderRadius: "8px",
          }}
        >
          {authenticationAlert?.showAlert && (
            <Box
              sx={{
                width: "368px",
                marginBottom: 2,
              }}
            >
              <AlertBar
                title={authenticationAlert?.title}
                show={authenticationAlert?.showAlert}
                description={authenticationAlert?.description}
                severity={authenticationAlert?.severity}
                setShow={setShowAlert}
              />
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "368px",
              padding: 2,
              boxShadow: 3,
              borderRadius: "8px",
              [theme.breakpoints.down("sm")]: {
                boxShadow: "none",
                width: "100%",
                paddingTop: 2,
              },
            }}
          >
            <Typography variant="h5" gutterBottom>
              Update Password
            </Typography>
            <Button
              variant="text"
              sx={{
                textDecoration: "underline",
                color: "#193561",
                textTransform: "none",
                justifyContent: "flex-start",
                padding: 0,
                marginBottom: 1,
              }}
              onClick={() => {
                sendResetCode();
              }}
            >
              Resend code
            </Button>

            <TextField label="Code" type="text" value={code} onChange={(e) => setCode(e.target.value)} margin="normal" fullWidth />
            <TextField
              label="Enter your new password"
              type="password"
              value={newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              margin="normal"
              fullWidth
            />
            <Box sx={{ marginBottom: "20px" }}>
              <Typography variant="caption" gutterBottom color="#687178">
                Your new password must be different from your current password and meet the following criteria:
              </Typography>
              <RadioGroup>
                {createPasswordCriteriaLabel("At least 8 characters", passwordCriteria.length, "length")}
                {createPasswordCriteriaLabel("At least 1 upper case letter", passwordCriteria.uppercase, "uppercase")}
                {createPasswordCriteriaLabel("At least 1 lower case letter", passwordCriteria.lowercase, "lowercase")}
                {createPasswordCriteriaLabel("At least 1 number", passwordCriteria.number, "number")}
                {createPasswordCriteriaLabel("At least 1 special character", passwordCriteria.specialChar, "specialChar")}
              </RadioGroup>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              sx={{ fontSize: "16px", fontWeight: "700" }}
              fullWidth
              disabled={!isPasswordValid}
              onClick={() => handleUpdatePassword()}
            >
              Update Password
            </Button>
          </Box>
        </Container>
        <Box sx={{ mt: "auto", width: "100%" }}>
          <InfoFooter />
        </Box>
      </Box>
    </>
  );
}
