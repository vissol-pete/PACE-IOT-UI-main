import { useEffect, useState } from "react";
import { Box, Typography, Modal, Button, TextField, useMediaQuery, useTheme, CircularProgress } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { createNewUser, editUser, checkUserExist } from "../../../services/apis";
import { setAddUserState, selectAddUserState } from "../../../redux/Slice/ProjectDirectory/ProjectDirectorySlice";
import { AlertBar } from "../../../components";

const getModalStyle = (isSmallScreen: boolean) => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: isSmallScreen ? "90vw" : 404,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  maxHeight: "95vh",
  overflowY: "auto",
});

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function AddNewSuperAdminModel({
  openSuperAdminModel,
  setOpenSuperAdminModel,
  addSuperAdmin,
  setAddSuperAdmin,
  setAlertState,
  setEnableFetchUserData,
}: any) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const addUserState = useSelector(selectAddUserState);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isLoading, setIsLoading] = useState(false);
  const [modelAlertState, setModelAlertState] = useState({
    isAlert: false,
    severity: "",
    title: "",
    description: "",
    resetOpen: false,
  });
  const [error, setError] = useState(false);
  const [disableFirstLastName, setDisableFirstLastName] = useState(true);
  const [enableCheckUserExist, setEnableCheckUserExist] = useState(false);
  const [isUserSuperAdmin, setIsUserSuperAdmin] = useState(false);

  const handleClose = () => {
    dispatch(setAddUserState("new"));
    setIsLoading(false);
    setAddSuperAdmin({
      firstName: "",
      lastName: "",
      email: "",
    });
    setOpenSuperAdminModel(false);
    setError(false);
    setModelAlertState({ ...modelAlertState, isAlert: false });
  };

  const isFormValid = () => {
    return addSuperAdmin.firstName?.trim() !== "" && addSuperAdmin.lastName?.trim() !== "" && isValidEmail(addSuperAdmin.email) && !error;
  };

  const handleEmailChange = (event: any) => {
    const value = event.target.value;
    // console.log("test email ", value);
    setAddSuperAdmin({ ...addSuperAdmin, email: value });
    setError(!isValidEmail(value));
  };

  const createNewSuperAdminMutation = useMutation({
    mutationFn: createNewUser,
    onSuccess: (data) => {
      console.log("user created successfully:", data);
      setEnableFetchUserData(true);
      setAlertState({ isAlert: true, severity: "success", title: "", description: "User added.", resetOpen: true });
      setIsLoading(false);
      handleClose();
    },
    onError: (error) => {
      handleClose();
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { data } = error.response;
          console.log("Response Data:", data);
          setAlertState({ isAlert: true, severity: "error", title: "", description: data?.error, resetOpen: true });
        } else {
          console.log("Error without response:", error.message);
        }
      } else {
        console.log("Non-Axios Error:", error);
      }
    },
  });

  const editSuperAdminMutation = useMutation({
    mutationFn: editUser,
    onSuccess: (data) => {
      console.log("user edit successfully:", data);
      queryClient.removeQueries({ queryKey: ["checkUserExist"] });
      setEnableFetchUserData(true);
      setAlertState({ isAlert: true, severity: "success", title: "", description: "User updated.", resetOpen: true });
      setIsLoading(false);
      handleClose();
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error creating project:", error);
    },
  });

  const handleAddNewSuperAdmin = () => {
    setIsLoading(true);
    if (addUserState === "edit") {
      editSuperAdminMutation.mutate({
        user_id: addSuperAdmin?.id,
        first_name: addSuperAdmin?.firstName,
        last_name: addSuperAdmin?.lastName,
        email_address: addSuperAdmin?.email,
        role: "SUPERADMIN",
      });
    } else {
      createNewSuperAdminMutation.mutate({
        first_name: addSuperAdmin?.firstName,
        last_name: addSuperAdmin?.lastName,
        email_address: addSuperAdmin?.email,
        role: "SUPERADMIN",
      });
    }
  };

  const setShowAlert = (show: boolean) => {
    setModelAlertState({ ...modelAlertState, isAlert: show });
  };

  const handleBlur = () => {
    // console.log("handleBlur");
    if (!error) {
      setDisableFirstLastName(false);
      setEnableCheckUserExist(true);
    }
  };
  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["checkUserExist", { email: addSuperAdmin.email }],
    queryFn: checkUserExist,
    enabled: enableCheckUserExist,
  });

  useEffect(() => {
    if (userData !== null && userData !== undefined && isUserDataLoading === false) {
      setEnableCheckUserExist(false);
      if (userData.message === "Users retrieved successfully") {
        const isSuperAdminPresent = userData?.data?.some((item: any) => item.cognito_user.Attributes["custom:role_id"] === "SUPERADMIN");
        // console.log(isSuperAdminPresent);
        setIsUserSuperAdmin(isSuperAdminPresent);
        // const superAdminObject = userData?.data.find((item: any) => item.cognito_user.Attributes["custom:role_id"] === "SUPERADMIN");
        // console.log(superAdminObject);

        setModelAlertState({
          isAlert: true,
          severity: "info",
          title: "",
          description: isSuperAdminPresent
            ? "Note: This user already exists in the system as Super Admin."
            : "Note: This user already exists in the system. They will be upgraded to Super Admin.",
          resetOpen: true,
        });

        setAddSuperAdmin({
          ...addSuperAdmin,
          firstName: userData?.data[0]?.dynamodb_data?.first_name,
          lastName: userData?.data[0]?.dynamodb_data.last_name,
          id: userData?.data[0]?.dynamodb_data.id,
        });

        dispatch(setAddUserState("edit"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  // console.log("userData", userData);

  return (
    <Modal open={openSuperAdminModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={getModalStyle(isSmallScreen)}>
        {modelAlertState.isAlert && (
          <>
            <AlertBar
              severity={modelAlertState.severity}
              title={modelAlertState.title}
              description={modelAlertState.description}
              show={modelAlertState.isAlert}
              setShow={setShowAlert}
            />
            <Box
              sx={{
                marginTop: "10px",
              }}
            />
          </>
        )}
        <Typography id="modal-modal-title" variant="h6">
          ADD NEW SUPER ADMIN
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <TextField
          value={addSuperAdmin?.email}
          required
          fullWidth
          id="outlined-required"
          label="Email address"
          onChange={handleEmailChange}
          onBlur={handleBlur}
          error={error}
          helperText={error ? "Please enter a valid email address." : ""}
        />
        <Box sx={{ marginTop: "10px" }} />
        <Typography id="modal-modal-title" align="center" sx={{ fontWeight: 400, fontSize: "12px" }}>
          An invitation will be sent to this email to set up the account.
        </Typography>
        {isUserDataLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Box sx={{ marginTop: "20px" }} />
        <TextField
          disabled={disableFirstLastName || error || isUserDataLoading}
          value={addSuperAdmin?.firstName}
          required
          fullWidth
          id="outlined-required"
          label="First name"
          onChange={(e) => setAddSuperAdmin({ ...addSuperAdmin, firstName: e.target.value })}
        />

        <Box sx={{ marginTop: "20px" }} />
        <TextField
          disabled={disableFirstLastName || error || isUserDataLoading}
          value={addSuperAdmin?.lastName}
          required
          fullWidth
          id="outlined-required"
          label="Last name"
          onChange={(e) => setAddSuperAdmin({ ...addSuperAdmin, lastName: e.target.value })}
        />
        <Box sx={{ marginTop: "20px" }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="text" color="primary" size="medium" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton disabled={!isFormValid() || isUserSuperAdmin} loading={isLoading} variant="contained" onClick={handleAddNewSuperAdmin}>
            {addUserState === "edit" ? "EDIT SUPER ADMIN" : "ADD NEW SUPER ADMIN"}
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
