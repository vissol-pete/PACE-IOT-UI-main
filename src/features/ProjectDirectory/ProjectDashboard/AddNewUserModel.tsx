import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import SiteList from "./SiteList";
import { createNewUser, editUser, checkUserExist } from "../../../services/apis";
import { setAddUserState, selectAddUserState } from "../../../redux/Slice/ProjectDirectory/ProjectDirectorySlice";
import { AlertBar } from "../../../components";

const getModalStyle = (isSmallScreen: boolean) => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: isSmallScreen ? "327px" : "368px",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  maxHeight: "95vh",
  overflowY: "auto",
});

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function AddNewUserModel({
  openAddNewUserModel,
  setOpenAddNewUserModel,
  addNewUser,
  setAddNewUser,
  allSitesList,
  projectId,
  selectedSiteOptions,
  setSelectedSiteOptions,
  setAlertState,
  setEnableFetchUserData,
}: any) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const addUserState = useSelector(selectAddUserState);
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

  const isFormValid = () => {
    const hasNameAndEmail =
      addNewUser.firstName?.trim() !== "" && addNewUser.lastName?.trim() !== "" && addNewUser.role?.trim() !== "" && isValidEmail(addNewUser.email);
    // const isTechnicianValid = addNewUser.role !== "TECHNICIAN" || (addNewUser.role === "TECHNICIAN" && selectedSiteOptions.length > 0);
    // return hasNameAndEmail && isTechnicianValid;
    return hasNameAndEmail;
  };

  const handleClose = () => {
    dispatch(setAddUserState("new"));
    setIsLoading(false);
    setOpenAddNewUserModel(false);
    setSelectedSiteOptions([]);
    setAddNewUser({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
    });
    setError(false);
    setModelAlertState({ ...modelAlertState, isAlert: false });
  };

  const createUserMutation = useMutation({
    mutationFn: createNewUser,
    onSuccess: (data) => {
      console.log("user created successfully:", data);
      handleClose();
      setEnableFetchUserData(true);
      setAlertState({ isAlert: true, severity: "success", title: "", description: "User added.", resetOpen: true });
      setIsLoading(false);
    },
    onError: (error) => {
      handleClose();
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { data } = error.response;
          console.log("Response Data:", data);
          //   setAlertState({ isAlert: true, severity: "error", title: "", description: data?.error, resetOpen: true });
        } else {
          console.log("Error without response:", error.message);
        }
      } else {
        console.log("Non-Axios Error:", error);
      }
    },
  });

  const editUserMutation = useMutation({
    mutationFn: editUser,
    onSuccess: (data) => {
      console.log("user created successfully:", data);
      handleClose();
      setEnableFetchUserData(true);
      setAlertState({ isAlert: true, severity: "success", title: "", description: "User updated.", resetOpen: true });
      setIsLoading(false);
    },
    onError: (error) => {
      handleClose();
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { data } = error.response;
          console.log("Response Data:", data);
          //   setAlertState({ isAlert: true, severity: "error", title: "", description: data?.error, resetOpen: true });
        } else {
          console.log("Error without response:", error.message);
        }
      } else {
        console.log("Non-Axios Error:", error);
      }
    },
  });

  const handleCreateNewUser = () => {
    setIsLoading(true);

    if (addUserState === "edit") {
      if (addNewUser.role === "ADMIN") {
        editUserMutation.mutate({
          user_id: addNewUser?.id,
          first_name: addNewUser?.firstName,
          last_name: addNewUser?.lastName,
          email_address: addNewUser?.email,
          role: addNewUser.role,
          project_id: projectId,
        });
      } else {
        editUserMutation.mutate({
          user_id: addNewUser?.id,
          first_name: addNewUser?.firstName,
          last_name: addNewUser?.lastName,
          email_address: addNewUser?.email,
          role: addNewUser.role,
          project_id: projectId,
          //   site_ids: selectedSiteOptions.map((site: any) => site.site_id),
        });
      }
    } else {
      if (addNewUser.role === "ADMIN") {
        createUserMutation.mutate({
          first_name: addNewUser?.firstName,
          last_name: addNewUser?.lastName,
          email_address: addNewUser?.email,
          role: addNewUser.role,
          project_id: projectId,
        });
      } else {
        createUserMutation.mutate({
          first_name: addNewUser?.firstName,
          last_name: addNewUser?.lastName,
          email_address: addNewUser?.email,
          role: addNewUser.role,
          project_id: projectId,
          //   site_ids: selectedSiteOptions.map((option: any) => option.site_id),
        });
      }
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddNewUser({ ...addNewUser, role: (event.target as HTMLInputElement).value });
  };

  const setShowAlert = (show: boolean) => {
    setModelAlertState({ ...modelAlertState, isAlert: show });
  };

  const handleEmailChange = (event: any) => {
    const value = event.target.value;
    setAddNewUser({ ...addNewUser, email: value });
    setError(!isValidEmail(value));
  };

  const handleBlur = () => {
    // console.log("handleBlur");
    if (!error) {
      setDisableFirstLastName(false);
      setEnableCheckUserExist(true);
    }
  };
  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["checkUserExist", { email: addNewUser.email }],
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
            : "Note: Changes made to this user’s record will apply across all projects associated with this user.",
          resetOpen: true,
        });

        setAddNewUser({
          ...addNewUser,
          firstName: userData?.data[0]?.dynamodb_data?.first_name,
          lastName: userData?.data[0]?.dynamodb_data.last_name,
          role: userData?.data[0]?.dynamodb_data?.role,
          id: userData?.data[0]?.dynamodb_data.id,
        });

        dispatch(setAddUserState("edit"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  // console.log("userData", userData);
  //   console.log("addNewUser", addNewUser);
  //   console.log("selectedSiteOptions", selectedSiteOptions);

  return (
    <Modal open={openAddNewUserModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={getModalStyle(isSmallScreen)}>
        <Box sx={{ marginTop: "16px", marginLeft: "24px", marginRight: "24px", marginBottom: "16px" }}>
          <Typography id="modal-modal-title" variant="h6">
            {addUserState === "edit" ? "Edit user" : "Add new user"}
          </Typography>
        </Box>
        <Box sx={{ marginLeft: "24px", marginRight: "24px", marginBottom: "20px" }}>
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
          <TextField
            value={addNewUser?.email}
            required
            fullWidth
            id="outlined-required"
            label="Email address"
            onChange={handleEmailChange}
            onBlur={handleBlur}
            error={error}
            helperText={error ? "Please enter a valid email address." : ""}
          />
          <Typography id="modal-modal-title" align="center" sx={{ fontWeight: 400, fontSize: "12px" }}>
            Invitation mail will be sent for setting up an account
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
            value={addNewUser?.firstName}
            required
            fullWidth
            id="outlined-required"
            label="First name"
            onChange={(e) => setAddNewUser({ ...addNewUser, firstName: e.target.value })}
          />
          <Box sx={{ marginTop: "20px" }} />
          <TextField
            disabled={disableFirstLastName || error || isUserDataLoading}
            value={addNewUser?.lastName}
            required
            fullWidth
            id="outlined-required"
            label="Last name"
            onChange={(e) => setAddNewUser({ ...addNewUser, lastName: e.target.value })}
          />
          <Box sx={{ marginTop: "40px" }} />
          <Typography variant="h6">role</Typography>
          <Box sx={{ marginTop: "20px" }} />
          <FormControl disabled={disableFirstLastName || error || isUserDataLoading}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={addNewUser?.role}
              onChange={handleRoleChange}
            >
              <FormControlLabel value="ADMIN" control={<Radio />} label="Admin" />
              <FormControlLabel value="TECHNICIAN" control={<Radio />} label="Technician" />
            </RadioGroup>
          </FormControl>
        </Box>
        {/* {addNewUser?.role === "TECHNICIAN" && (
          <>
            <Typography variant="h6">Site(s)</Typography>
            <Box sx={{ marginTop: "20px" }} />
            <SiteList options={allSitesList} selectedSiteOptions={selectedSiteOptions} setSelectedSiteOptions={setSelectedSiteOptions} />
          </>
        )} */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, padding: "8px" }}>
          <Button variant="text" color="primary" size="medium" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton disabled={!isFormValid() || isUserSuperAdmin} loading={isLoading} variant="contained" onClick={handleCreateNewUser}>
            {addUserState === "edit" ? "Save" : "Add user"}
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
