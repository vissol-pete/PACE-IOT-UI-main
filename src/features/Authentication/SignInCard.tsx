import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  useMediaQuery,
  OutlinedInput,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { signIn } from "aws-amplify/auth";

import { PaceLogo } from "../../assets";
import { AlertBar } from "../../components";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SignInCard({ setAuthWindowType, email, setEmail, authenticationAlert, SetAuthenticationAlert }: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const lockoutDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
  const [attempts, setAttempts] = useState(() => {
    const storedValue = localStorage.getItem("loginAttempts");
    return storedValue ? parseInt(storedValue, 10) : 0;
  });
  const [lockoutEndTime, setLockoutEndTime] = useState(() => {
    const storedValue = localStorage.getItem("lockoutEndTime");
    return storedValue ? parseInt(storedValue, 10) : null;
  });
  const [lockout, setLockout] = useState(false);
  console.log("lockout attempts ", attempts);
  console.log("lockout lockoutEndTime ", lockoutEndTime);

  const updateAttempts = (count: any) => {
    setAttempts(count);
    if (count === 0) {
      localStorage.removeItem("loginAttempts");
    } else {
      localStorage.setItem("loginAttempts", count.toString());
    }
  };

  const releaseLockout = () => {
    console.log("lockout releasing lockout ");
    updateAttempts(0);
    localStorage.removeItem("lockoutEndTime");
    setLockoutEndTime(null);
    setLockout(false);
  };

  useEffect(() => {
    if (attempts > 4 && authenticationAlert?.severity !== "success") {
      SetAuthenticationAlert({
        ...authenticationAlert,
        severity: "error",
        showAlert: true,
        title: "Password attempts exceeded.",
        description: "Please wait 15 minutes before trying again. You can also reset your password or contact your building admin for assistance.",
      });
      const now = Date.now();
      if (!lockoutEndTime) {
        console.log("lockout initiated ");
        const endTime = now + lockoutDuration;
        localStorage.setItem("lockoutEndTime", endTime.toString());
        setLockoutEndTime(endTime);
      }
      console.log("lockout started or resumed ");
      setLockout(true);
    }
  }, [attempts]);

  useEffect(() => {
    let timerId: any;

    if (lockout && lockoutEndTime) {
      timerId = setInterval(() => {
        const endTime = lockoutEndTime;
        const now = Date.now();
        console.log("lockout timer in progress current time/lockoutendtime ", now, lockoutEndTime);
        if (now >= endTime) {
          releaseLockout();
          setShowAlert(false);
          console.log("lockout clearing timer in progress ", timerId);
          clearInterval(timerId);
        }
      }, 2000);
    } else {
      console.log("lockout clearing timer ", timerId);
      clearInterval(timerId);
    }
    return () => {
      console.log("lockout clearing on component unmount ", timerId);
      clearInterval(timerId);
    };
  }, [lockout]);

  useEffect(() => {
    if (authenticationAlert?.description?.includes("Password successfully reset.")) {
      releaseLockout();
      setEmail("");
      setPassword("");
    }
  }, [authenticationAlert?.description]);

  const setShowAlert = (show: boolean) => {
    SetAuthenticationAlert({ ...authenticationAlert, showAlert: show });
  };

  async function handleSubmit() {
    setShowAlert(false);
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password,
      });
      console.log("isSignedIn", isSignedIn);
      console.log("nextStep", nextStep);
      releaseLockout();
      if (nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        setAuthWindowType("newUserResetPassword");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      updateAttempts(attempts + 1);
      if (attempts === 4) {
        return;
      }
      if (error.message.includes("Temporary password has expired and must be reset by an administrator.")) {
        setAuthWindowType("expiredTemporaryPassword");
      } else {
        SetAuthenticationAlert({
          ...authenticationAlert,
          severity: "error",
          showAlert: true,
          title: "",
          description: "Incorrect email or password",
        });
      }
    }
  }

  const handleEmailChange = (event: any) => {
    const value = event.target.value;
    console.log("test email ", value);
    setEmail(value);
    setError(!isValidEmail(value));
    if (!authenticationAlert?.severity?.includes("success") && !lockout) {
      setShowAlert(false);
    }
  };

  const handlePasswordChange = (event: any) => {
    const value = event.target.value;
    setPassword(value);
    if (!authenticationAlert?.severity?.includes("success") && !lockout) {
      setShowAlert(false);
    }
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const isFormValid = () => {
    return !error && isValidEmail(email) && password?.trim() !== "" && email.length > 4 && password.length > 7;
    // return email?.trim() !== "" && password?.trim() !== "";
  };

  // console.log("authenticationAlert", authenticationAlert);

  return (
    <Card
      sx={{
        width: "375px",
        // height: "442px",
        boxShadow: isSmallScreen ? "none" : 1,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            marginTop: "40px",
          }}
        />
        <img src={PaceLogo} alt="Pac eLogo" width="209" height="68" object-fit="contain" />
        <Box
          sx={{
            marginTop: "40px",
          }}
        />
        <Box sx={{ width: "100%" }}>
          <AlertBar
            severity={authenticationAlert?.severity}
            description={authenticationAlert?.description}
            show={authenticationAlert?.showAlert}
            title={authenticationAlert?.title}
            setShow={setShowAlert}
          />
        </Box>

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
            marginTop: "40px",
          }}
        />
        <FormControl sx={{ mt: "25px" }} variant="outlined" fullWidth>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            value={password}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            onChange={handlePasswordChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Button
          disabled={!isFormValid() || lockout}
          variant="contained"
          color="primary"
          size="medium"
          sx={{
            width: "50%",
            marginTop: "20px",
            height: "40px",
          }}
          onClick={handleSubmit}
        >
          Log in
        </Button>

        <Button
          variant="text"
          color="primary"
          sx={{
            textDecoration: "underline",
            textTransform: "none",
            marginTop: "20px",
          }}
          onClick={() => {
            setShowAlert(false);
            setAuthWindowType("forgotPassword1");
          }}
        >
          Forgot password?
        </Button>
      </CardContent>
    </Card>
  );
}
