import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  Switch,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { parsePhoneNumberFromString, getCountryCallingCode, CountryCode, isSupportedCountry } from "libphonenumber-js";

import { fetchAllCountriesAndStates, createNewSite, editSite } from "../../../services/apis";
import { AddSite, AllCountriesAndStates, SelectedCountriesStates } from "../../../types";
import { setAddSiteState, selectAddSiteState } from "../../../redux/Slice/ProjectDirectory/ProjectDirectorySlice";

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
  padding: "24px",
});

export default function AddNewSiteModel({
  openAddNewSiteModel,
  setOpenAddNewSiteModel,
  addSite,
  setAddSite,
  setEnableSearchQuery,
  projectId,
  setAlertState,
  kpiCardData,
}: any) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [allCountriesAndStates, setAllCountriesAndStates] = useState<AllCountriesAndStates[]>([]);
  const [selectedCountriesStates, setSelectedCountriesStates] = useState<SelectedCountriesStates[]>([]);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [selectedCountriesCode, setSelectedCountriesCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const addSiteState = useSelector(selectAddSiteState);
  const [callingCode, setCallingCode] = useState("");
  const [isValidPostalCode, setIsValidPostalCode] = useState(false);

  const {
    data: allCountriesData,
    // isLoading: isAllCountriesDataLoading,
    isSuccess: isAllCountriesDataSuccess,
  } = useQuery({
    queryKey: ["allCountries"],
    queryFn: fetchAllCountriesAndStates,
  });

  function validatePhoneNumber(phoneNumber: string, countryCode: any) {
    // Parse the phone number with the given country code
    const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, countryCode);

    // Check if the number is valid
    if (phoneNumberObj && phoneNumberObj.isValid()) {
      return phoneNumberObj.formatInternational(); // Return formatted valid number
    } else {
      return "Invalid phone number";
    }
  }

  // const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setAddSite({
  //     ...addSite,
  //     phone_number: event.target.value,
  //   });

  //   const result = validatePhoneNumber(event.target.value, selectedCountriesCode);

  //   if (result === "Invalid phone number") setPhoneNumberError(true);
  //   else setPhoneNumberError(false);

  //   // console.log(event.target.value);
  //   // console.log(result);
  // };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length < callingCode.length) {
      return;
    }
    const inputValue = event.target.value.replace(/[^\d+]/g, "");
    const phoneNumber = inputValue.startsWith(callingCode) ? inputValue.slice(callingCode.length) : inputValue;
    setAddSite({
      ...addSite,
      phone_number: phoneNumber,
    });

    const result = validatePhoneNumber(phoneNumber, selectedCountriesCode);

    if (result === "Invalid phone number") setPhoneNumberError(true);
    else setPhoneNumberError(false);
  };

  useEffect(() => {
    if (allCountriesData !== undefined) {
      const updatedData: AllCountriesAndStates[] = [];
      for (const i in allCountriesData?.data) {
        const itemSub = allCountriesData?.data[i];
        // console.log("itemSub", itemSub);
        const { name, states, iso2 } = itemSub;
        const item: AllCountriesAndStates = {
          countryName: name,
          states: states,
          countryCode: iso2,
        };
        updatedData.push(item);
        // console.log("item", item);
      }
      const sortedCountries = updatedData.sort((a, b) => a.countryName.localeCompare(b.countryName));
      // console.log(sortedCountries);
      setAllCountriesAndStates(sortedCountries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCountriesData]);

  const handleClose = () => {
    setIsLoading(false);
    dispatch(setAddSiteState("new"));
    setSelectedCountriesStates([]);
    setSelectedCountriesCode("");
    setPhoneNumberError(false);
    setOpenAddNewSiteModel(false);
    setCallingCode("");
    setAddSite({
      name: "",
      country: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      phone_number: "",
      dr_event_enrolled: false,
      project_id: "",
    });
  };

  const handleChangeCountry = (event: SelectChangeEvent) => {
    const countryName = event.target.value as string;

    // console.log("countryName", countryName);
    setAddSite({ ...addSite, country: countryName, state: "" });
    getCallingCode(countryName);
  };

  const getCallingCode = (countryName: string) => {
    const selectedCountryData = allCountriesAndStates.find((country: any) => country.countryName === countryName);

    console.log("selectedCountryData", selectedCountryData);
    if (selectedCountryData !== undefined) {
      setSelectedCountriesCode(selectedCountryData?.countryCode);
      setSelectedCountriesStates(selectedCountryData?.states);

      const countryCode = selectedCountryData?.countryCode as CountryCode;

      // Validate if the country code is supported before calling getCountryCallingCode
      if (isSupportedCountry(countryCode)) {
        const callingCodeValue = `+${getCountryCallingCode(countryCode)}`;
        setCallingCode(callingCodeValue);
        console.log("calling code", callingCodeValue);
      } else {
        console.warn(`Country code not supported: ${countryCode}`);
        setCallingCode("");
      }
    }
  };

  // Handle postal code change
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const postalCode = e.target.value;
    setAddSite({
      ...addSite,
      postal_code: e.target.value,
    });
    validateZipCode(postalCode);
  };

  // US ZIP code validation
  const validateUSZipCode = (postalCode: string): boolean => {
    const usZipCodeRegex = /^\d{5}(-\d{4})?$/;
    return usZipCodeRegex.test(postalCode);
  };

  // Canadian postal code validation
  const validateCanadaPostalCode = (postalCode: string): boolean => {
    const canadaPostalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    const isValid = canadaPostalCodeRegex.test(postalCode);
    console.log("isValid:", isValid, postalCode);
    return isValid;
  };

  // Postal code validation based on the selected country
  const validateZipCode = (postalCode: string): void => {
    let isValid = false;

    if (addSite.country === "United States") {
      isValid = validateUSZipCode(postalCode);
    } else if (addSite.country === "Canada") {
      isValid = validateCanadaPostalCode(postalCode);
    } else {
      isValid = true;
    }

    setIsValidPostalCode(isValid);
  };

  const handleChangeState = (event: SelectChangeEvent) => {
    const stateProvinceName = event.target.value as string;

    setAddSite({
      ...addSite,
      state: stateProvinceName,
    });
  };

  const handleDemandResponseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setChecked(event.target.checked);
    setAddSite({
      ...addSite,
      dr_event_enrolled: event.target.checked,
    });
  };

  const isFormValid = () => {
    return (
      addSite.name?.trim() !== "" &&
      addSite.country?.trim() !== "" &&
      (addSite.address_line1?.trim().length ?? 0) > 2 &&
      ((addSite.address_line2?.trim().length ?? 0) > 2 || (addSite.address_line2?.trim().length ?? 0) == 0) &&
      addSite.city?.trim() !== "" &&
      addSite.state?.trim() !== "" &&
      addSite.postal_code?.trim() !== "" &&
      isValidPostalCode &&
      (addSite?.phone_number?.toString().length == 0 || !phoneNumberError)
    );
  };

  useEffect(() => {
    // console.log("addProjectState edit");
    if (addSiteState === "edit") {
      const selectedCountryData = allCountriesAndStates.find((country: any) => country.countryName === addSite?.country);
      // console.log("edit selectedCountryData", selectedCountryData);
      if (selectedCountryData !== undefined) setSelectedCountriesStates(selectedCountryData?.states);
      validateZipCode(addSite?.postal_code);
      getCallingCode(addSite?.country);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addSiteState]);

  const createNewSiteMutation = useMutation({
    mutationFn: createNewSite,
    onSuccess: (data) => {
      console.log("Site created successfully:", data);
      setIsLoading(false);
      handleClose();
      setEnableSearchQuery(true);
      setAlertState({ isAlert: true, severity: "success", title: "", description: "Site added.", resetOpen: true });

      // setProjectAddedAlert(true);
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error creating project:", error);
      setAlertState({
        isAlert: true,
        severity: "error",
        title: "",
        description: "Site was unable to be added. Please try again later.",
        resetOpen: true,
      });
    },
  });

  const editSiteMutation = useMutation({
    mutationFn: editSite,
    onSuccess: (data) => {
      console.log("Site edited successfully:", data);
      setIsLoading(false);
      handleClose();
      setEnableSearchQuery(true);
      // setProjectAddedAlert(true);
      setAlertState({ isAlert: true, severity: "success", title: "", description: "Site updated.", resetOpen: true });
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error creating project:", error);
      setAlertState({
        isAlert: true,
        severity: "error",
        title: "",
        description: "Site was unable to be updated. Please try again later.",
        resetOpen: true,
      });
    },
  });

  const cleanPayload = (payload: Record<string, any>) => {
    return Object.fromEntries(Object.entries(payload).filter(([_, value]) => value !== ""));
  };

  useEffect(() => {
    if (addSite?.project_id === undefined || addSite?.project_id === "" || Number.isNaN(Number(addSite?.project_id)))
      setAddSite({ ...addSite, project_id: projectId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addSite]);

  const handleAddSite = () => {
    setIsLoading(true);
    console.log(cleanPayload(addSite));
    if (addSiteState === "edit") {
      editSiteMutation.mutate(cleanPayload(addSite));
    } else {
      createNewSiteMutation.mutate(cleanPayload(addSite));
    }
  };

  // console.log("addSite", addSite);
  // console.log("allCountriesData", allCountriesData);
  return (
    <Modal open={openAddNewSiteModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={getModalStyle(isSmallScreen)}>
        {!isAllCountriesDataSuccess ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "40px",
              marginBottom: "10px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography id="modal-modal-title" variant="h6">
              {addSiteState == "edit" ? "Edit site" : "Add new site"}
            </Typography>
            <Box sx={{ marginTop: "20px" }} />
            <TextField
              value={addSite?.name}
              required
              fullWidth
              id="outlined-required"
              label="Site name"
              onChange={(e) => {
                const input = e.target.value;
                if (input.length <= 100) {
                  setAddSite({ ...addSite, name: input });
                }
              }}
            />
            <Box sx={{ marginTop: "40px" }} />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Country*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={addSite?.country}
                label="Select a country"
                onChange={handleChangeCountry}
              >
                {allCountriesAndStates.map((country, index) => (
                  <MenuItem key={index} value={country?.countryName}>
                    {country?.countryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ marginTop: "20px" }} />
            <TextField
              value={addSite?.address_line1}
              required
              fullWidth
              id="outlined-required"
              label="Address line 1"
              onChange={(e) => {
                const { value } = e.target;
                if (value.length <= 200) {
                  // Ensure max length constraint
                  setAddSite({ ...addSite, address_line1: value });
                }
              }}
              error={addSite?.address_line1?.length < 3 && addSite?.address_line1?.length > 0} // Show error if less than 3 chars
              helperText={addSite?.address_line1?.length < 3 && addSite?.address_line1?.length > 0 ? "Address must be at least 3 characters." : ""}
            />
            <Box sx={{ marginTop: "20px" }} />
            <TextField
              value={addSite?.address_line2}
              fullWidth
              id="outlined-required"
              label="Address line 2"
              onChange={(e) => {
                const { value } = e.target;
                if (value.length <= 200) {
                  // Enforce max length constraint
                  setAddSite({ ...addSite, address_line2: value });
                }
              }}
              error={addSite?.address_line2?.length < 3 && addSite?.address_line2?.length > 0} // Error if less than 3 chars
              helperText={addSite?.address_line2?.length < 3 && addSite?.address_line2?.length > 0 ? "Address must be at least 3 characters." : ""}
            />
            <Box sx={{ marginTop: "20px" }} />
            <TextField
              value={addSite?.city}
              required
              fullWidth
              id="outlined-required"
              label="City/town/locality"
              onChange={(e) => {
                const { value } = e.target;
                if (value.length <= 100) {
                  setAddSite({ ...addSite, city: value });
                }
              }}
            />
            <Box sx={{ marginTop: "20px" }} />
            {selectedCountriesStates.length > 0 && (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">State/province/region *</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={addSite?.state || ""}
                  label="Select a state/province/region"
                  onChange={handleChangeState}
                  disabled={selectedCountriesStates.length <= 0}
                >
                  {selectedCountriesStates.map((states, index) => (
                    <MenuItem key={states?.state_code} value={states?.name}>
                      {states?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Box sx={{ marginTop: "20px" }} />

            <TextField
              value={addSite?.postal_code || ""}
              required
              fullWidth
              id="outlined-required"
              label="Postal/zip code"
              error={addSite?.postal_code !== "" && !isValidPostalCode}
              helperText={addSite?.postal_code === "" ? "" : !isValidPostalCode ? "Please enter a valid postal/zip code." : ""}
              sx={{
                "& .MuiFormHelperText-root": {
                  color: !isValidPostalCode && addSite?.postal_code !== "" ? "red" : "inherit",
                },
              }}
              onChange={handlePostalCodeChange}
              disabled={!addSite.country}
            />
            <Box sx={{ marginTop: "40px" }} />
            <TextField
              type="text"
              value={callingCode + (addSite?.phone_number?.toString() || "")}
              fullWidth
              id="outlined-required"
              label="Phone number"
              onChange={handlePhoneNumberChange}
              error={phoneNumberError && addSite?.phone_number?.toString().length > 0}
              disabled={!addSite.country}
              helperText={phoneNumberError && addSite?.phone_number?.toString().length > 0 ? "Please enter a valid phone number." : ""}
            />

            <Box sx={{ marginTop: "40px" }} />
            <Typography id="modal-modal-title" variant="body1">
              Demand response
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body1">Off</Typography>
              <FormControlLabel
                disabled={kpiCardData?.dr_link === null}
                control={
                  <Switch
                    checked={addSite?.dr_event_enrolled}
                    onChange={handleDemandResponseChange}
                    sx={{
                      "& .MuiSwitch-thumb": {
                        color: kpiCardData?.dr_link === null ? undefined : "#193561",
                      },
                    }}
                  />
                }
                label="On"
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button variant="text" color="primary" size="medium" onClick={handleClose}>
                Cancel
              </Button>
              <LoadingButton disabled={!isFormValid()} loading={isLoading} variant="contained" onClick={handleAddSite}>
                {addSiteState == "edit" ? "Save" : "Add site"}
              </LoadingButton>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
