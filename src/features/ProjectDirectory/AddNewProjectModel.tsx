import { useEffect, useRef, useState } from "react";
import { Box, Typography, Modal, Button, TextField, MenuItem, InputLabel, FormControl, Chip, CircularProgress } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { parsePhoneNumberFromString, getCountryCallingCode, CountryCode, isSupportedCountry } from "libphonenumber-js";

import { AllCountriesAndStates, SelectedCountriesStates } from "../../types";
import { fetchAllCountriesAndStates, createNewProject, editProject, uploadLogo } from "../../services/apis";
import { selectAddProjectState, setAddProjectState } from "../../redux/Slice/ProjectDirectory/ProjectDirectorySlice";
import { AlertBar } from "../../components";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 444,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  maxHeight: "95vh",
  overflowY: "auto",
};

export default function AddNewProjectModel({
  openAddNewProjectModel,
  setOpenAddNewProjectModel,
  addProject,
  setAddProject,
  setEnableSearchQuery,
  // setProjectAddedAlert,
  setAlertState,
}: any) {
  const dispatch = useDispatch();
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [primaryColorError, setPrimaryColorError] = useState(false);
  const [secondaryColorError, setSecondaryColorError] = useState(false);
  const [allCountriesAndStates, setAllCountriesAndStates] = useState<AllCountriesAndStates[]>([]);
  const [selectedCountriesStates, setSelectedCountriesStates] = useState<SelectedCountriesStates[]>([]);
  const inputIconFileRef = useRef<HTMLInputElement | null>(null);
  const addProjectState = useSelector(selectAddProjectState);
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [iconFileName, setIconFileName] = useState("");
  const [projectNameError, setProjectNameError] = useState(false);
  const [addressLine1Error, setAddressLine1Error] = useState<boolean>(false);
  const [addressLine2Error, setAddressLine2Error] = useState<boolean>(false);
  const [cityError, setCityError] = useState<boolean>(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [isValidPostalCode, setIsValidPostalCode] = useState(false);
  const [cmmsLinkerror, setCmmsLinkError] = useState<string | null>(null);
  const [selectedCountriesCode, setSelectedCountriesCode] = useState("");
  const [fileSizeError, setFileSizeError] = useState(false);
  const [callingCode, setCallingCode] = useState("");
  const [bypassStatesValidation, setBypassStatesValidation] = useState(false);
  const [deleteLogo, setDeleteLogo] = useState(false);
  const {
    data: allCountriesData,
    // isLoading: isAllCountriesDataLoading,
    isSuccess: isAllCountriesDataSuccess,
  } = useQuery({
    queryKey: ["allCountries"],
    queryFn: fetchAllCountriesAndStates,
  });

  useEffect(() => {
    validateZipCode(addProject.postal_code);
  }, []);

  useEffect(() => {
    if (addProject?.logo_filename) {
      setIconFileName(addProject.logo_filename);
    }
  }, [addProject?.logo_filename]);

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

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length < callingCode.length) {
      return;
    }

    const inputValue = event.target.value.replace(/[^\d+]/g, "");

    const phoneNumber = inputValue.startsWith(callingCode) ? inputValue.slice(callingCode.length) : inputValue;

    setAddProject({
      ...addProject,
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
    dispatch(setAddProjectState("new"));
    setSelectedCountriesCode("");
    setPhoneNumberError(false);
    setSelectedCountriesStates([]);
    setPrimaryColor("");
    setSecondaryColor("");
    setFileSizeError(false);
    setPrimaryColorError(false);
    setSecondaryColorError(false);
    setCallingCode("");
    setDeleteLogo(false);
    setAddProject({
      name: "",
      country: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      phone_number: "",
      cmms_name: "",
      cmms_link: "",
      dr_link: "",
      primary_color_hex_code: "",
      secondary_color_hex_code: "",
      upload_logo: false,
      content_type: "",
    });
    handleDeleteIcon();
    setOpenAddNewProjectModel(false);
  };

  const handleChangeCountry = (event: SelectChangeEvent) => {
    const countryName = event.target.value as string;

    setAddProject({
      ...addProject,
      country: countryName,
      postal_code: "",
    });

    const selectedCountryData = allCountriesAndStates.find((country: any) => country.countryName === countryName);

    if (selectedCountryData !== undefined) {
      setSelectedCountriesCode(selectedCountryData?.countryCode);
      setSelectedCountriesStates(selectedCountryData?.states);
      setBypassStatesValidation(selectedCountryData?.states.length > 0 ? false : true);

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

  const handleChangeState = (event: SelectChangeEvent) => {
    const stateProvinceName = event.target.value as string;

    setAddProject({
      ...addProject,
      state: stateProvinceName,
    });
  };

  // Regular expression to check for URL
  const isValidUrl = (url: string): boolean => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "(([a-zA-Z0-9_-]+\\.)+[a-zA-Z]{2,})" + // domain name
        "(\\/.*)?$", // path (optional)
      "i"
    );
    return urlPattern.test(url);
  };

  const isValidHexCode = (color: string) => /^#[0-9A-F]{6}$/i.test(color);

  const handlePrimaryColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setPrimaryColor(color);
    setPrimaryColorError(!isValidHexCode(color));
    setAddProject({
      ...addProject,
      primary_color_hex_code: color,
    });
  };

  const handleSecondaryColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setSecondaryColor(color);
    setSecondaryColorError(!isValidHexCode(color));
    setAddProject({
      ...addProject,
      secondary_color_hex_code: color,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    // Check if files exist
    if (files && files.length > 0) {
      const file = files[0];
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop();

      // Size validation: 500 KB limit
      const maxSizeInBytes = 500 * 1024; // 500 KB
      if (file.size > maxSizeInBytes) {
        setFileSizeError(true);
        return;
      } else {
        setFileSizeError(false);
      }

      const img = new Image();
      img.onload = () => {
        if (img.width > 500 || img.height > 500) {
          setFileSizeError(true);
          return;
        }

        setFileSizeError(false);
        setDeleteLogo(false);
        setIconFileName(file.name);
        setLogoFile(file);
        setAddProject({
          ...addProject,
          upload_logo: true,
          content_type: fileExtension,
        });
      };
      img.onerror = () => {
        alert("Invalid image format. Please select a valid image.");
      };

      // Create a URL for the image and load it to check dimensions
      img.src = URL.createObjectURL(file);
    }
  };

  const handleUploadButtonClick = () => {
    // console.log("Outside", inputIconFileRef);
    if (inputIconFileRef.current) {
      // console.log("inside", inputIconFileRef);
      inputIconFileRef.current.click();
    }
  };

  useEffect(() => {
    // console.log("addProjectState edit");
    if (addProjectState === "edit") {
      const selectedCountryData = allCountriesAndStates.find((country: any) => country.countryName === addProject?.country);
      // console.log("edit selectedCountryData", selectedCountryData);
      if (selectedCountryData !== undefined) setSelectedCountriesStates(selectedCountryData?.states);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addProjectState]);

  const handleDeleteIcon = () => {
    setIconFileName("");
    setLogoFile(null);
    if (inputIconFileRef.current) {
      inputIconFileRef.current.value = "";
    }
    console.info("You clicked the delete icon.");
  };

  const isFormValid = () => {
    return (
      addProject.name?.trim() !== "" &&
      addProject.country?.trim() !== "" &&
      addProject.address_line1?.trim() !== "" &&
      addProject.city?.trim() !== "" &&
      (addProject.state?.trim() !== "" || bypassStatesValidation) &&
      addProject.postal_code?.trim() !== "" &&
      isValidPostalCode &&
      !phoneNumberError
    );
  };

  const createNewProjectMutation = useMutation({
    mutationFn: createNewProject,
    onSuccess: (data) => {
      // console.log("Project created successfully:", data);
      if (!addProject.upload_logo) {
        setIsLoading(false);
        // setOpenAddNewProjectModel(false);
        handleClose();
        setEnableSearchQuery(true);
        // setProjectAddedAlert(true);
        setAlertState({ isAlert: true, severity: "success", title: "", description: "Project added", resetOpen: true });
      } else {
        // console.log("now upload logo");
        uploadLogoMutation.mutate({
          url: data?.data?.pre_signed_url,
          file: logoFile,
        });
      }
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error creating project:", error);
      setAlertState({
        isAlert: true,
        severity: "error",
        title: "",
        description: "Project was unable to be added. Please try again later.",
        resetOpen: true,
      });
    },
    // onSettled: () => {
    //   console.log("Mutation settled (either success or error)");
    // },
  });

  const editProjectMutation = useMutation({
    mutationFn: editProject,
    onSuccess: (data) => {
      console.log("Project created successfully:", data);
      if (!addProject.upload_logo) {
        setIsLoading(false);
        handleClose();
        // setOpenAddNewProjectModel(false);
        setEnableSearchQuery(true);
        // setProjectAddedAlert(true);
        setAlertState({ isAlert: true, severity: "success", title: "", description: "Project updated", resetOpen: true });
      } else {
        // console.log("now upload logo");
        uploadLogoMutation.mutate({
          url: data?.data?.pre_signed_url,
          file: logoFile,
        });
      }
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error creating project:", error);
      setAlertState({
        isAlert: true,
        severity: "error",
        title: "",
        description: "Project was unable to be updated. Please try again later.",
        resetOpen: true,
      });
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: uploadLogo,
    onSuccess: (data) => {
      console.log("Logo uploaded successfully:", data);
      setIsLoading(false);
      setEnableSearchQuery(true);
      handleClose();
      if (addProjectState === "edit") {
        setAlertState({ isAlert: true, severity: "success", title: "", description: "Project updated", resetOpen: true });
      } else {
        setAlertState({ isAlert: true, severity: "success", title: "", description: "Project added", resetOpen: true });
      }
    },
    onError: (error) => {
      console.error("Error creating project:", error);
    },
  });

  // const cleanPayload = (payload: Record<string, any>) => {
  //   return Object.fromEntries(Object.entries(payload).filter(([key, value]) => key !== "logo_filename" && value !== ""));
  // };

  const cleanPayload = (payload: Record<string, any>) => {
    // Start by filtering out the "logo_filename" and empty values, and add the delete_logo field
    const cleanedPayload = Object.fromEntries(Object.entries(payload).filter(([key, value]) => key !== "logo_filename" && value !== ""));

    // Add the "delete_logo" field if deleteLogo is true
    if (deleteLogo) {
      cleanedPayload.delete_logo = true;
      // Remove the "content-type" field if deleteLogo is true
      delete cleanedPayload["content_type"];
    } else {
      // Remove the "delete_logo" field if deleteLogo is false
      delete cleanedPayload["delete_logo"];
    }

    return cleanedPayload;
  };

  const handleAddProject = () => {
    //creating a temporary object to remove invalid cmms link before creating/editing the project and keep the value to show it in ui
    var addPorjectTemp = addProject;
    if (cmmsLinkerror) {
      addPorjectTemp["cmms_link"] = "";
    }

    setIsLoading(true);
    if (addProjectState === "edit") {
      editProjectMutation.mutate(cleanPayload(addPorjectTemp));
    } else {
      createNewProjectMutation.mutate(cleanPayload(addPorjectTemp));
    }
  };

  // Validation function for project name
  const isValidProjectName = (name: string): boolean => {
    const regex = /^[A-Za-z0-9\-&' ]{1,100}$/;
    return regex.test(name);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAddProject({ ...addProject, name: newName });

    if (!isValidProjectName(newName)) {
      setProjectNameError(true);
    } else {
      setProjectNameError(false);
    }
  };

  // Validation function for address
  const isValidAddress = (address: string): boolean => {
    const regex = /^[A-Za-z0-9\-&' ]{3,200}$/;
    return regex.test(address);
  };

  const handleAddressLine1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const addressLine1 = e.target.value;
    setAddProject({
      ...addProject,
      address_line1: addressLine1,
    });
    setAddressLine1Error(!isValidAddress(addressLine1));
  };

  const handleAddressLine2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const addressLine2 = e.target.value;
    setAddProject({
      ...addProject,
      address_line2: addressLine2,
    });
    setAddressLine2Error(!isValidAddress(addressLine2));
  };

  // Validation function for city
  const isValidCity = (city: string): boolean => {
    const regex = /^[A-Za-z0-9\-&' ]{1,100}$/;
    return regex.test(city);
  };

  // Handle change and validate input
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const city = e.target.value;
    setCityError(!isValidCity(city));

    setAddProject({
      ...addProject,
      city: city,
    });
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

    if (addProject.country === "United States") {
      isValid = validateUSZipCode(postalCode);
    } else if (addProject.country === "Canada") {
      isValid = validateCanadaPostalCode(postalCode);
    } else {
      isValid = true;
    }

    console.log("validate zip code");
    setIsValidPostalCode(isValid);
  };

  // Handle postal code change
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const postalCode = e.target.value;
    setAddProject({
      ...addProject,
      postal_code: e.target.value,
    });
    validateZipCode(postalCode);
  };

  // Function to calculate the opposite grayscale color
  const getOppositeGrayscale = (hex: string): string => {
    // Remove the '#' if it's there
    const cleanedHex = hex.replace("#", "");

    // Convert hex to RGB
    const r = parseInt(cleanedHex.substring(0, 2), 16);
    const g = parseInt(cleanedHex.substring(2, 4), 16);
    const b = parseInt(cleanedHex.substring(4, 6), 16);

    // Calculate the grayscale value by averaging RGB components
    const grayscale = Math.round((r + g + b) / 3);

    // Calculate the opposite grayscale value
    const oppositeGrayscale = (255 - grayscale).toString(16).padStart(2, "0");

    // Return the grayscale color in hex format
    return `#${oppositeGrayscale}${oppositeGrayscale}${oppositeGrayscale}`;
  };

  // console.log("addProject", addProject);
  // console.log("addProjectState", addProjectState);
  // console.log("allCountriesData", allCountriesData);
  // console.log("allCountriesAndStates", allCountriesAndStates);
  // console.log("selectedCountriesStates", selectedCountriesStates);
  // console.log("logoFile", logoFile);
  // console.log("inputIconFileRef", inputIconFileRef.current);
  // console.log("iconFileName", iconFileName);

  return (
    <Modal open={openAddNewProjectModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
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
            <Box sx={{ paddingTop: "16px", paddingLeft: "24px", paddingRight: "24px" }}>
              <Typography id="modal-modal-title" variant="h6">
                {addProjectState === "edit" ? "Edit project" : "Add new project"}
              </Typography>
              <Box sx={{ marginTop: "16px" }} />
              <TextField
                value={addProject?.name}
                required
                fullWidth
                id="outlined-required"
                label="Project name"
                onChange={handleNameChange}
                error={projectNameError}
                helperText={projectNameError ? "Please enter a valid project name" : ""}
                sx={{
                  "& .MuiFormHelperText-root": {
                    color: projectNameError ? "red" : "inherit",
                  },
                }}
              />
              <Box sx={{ marginTop: "48px" }} />
              <Typography id="modal-modal-title" variant="h6">
                Headquarters address
              </Typography>
              <Box sx={{ marginTop: "16px" }} />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select a country*</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={addProject?.country}
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
                value={addProject?.address_line1}
                required
                fullWidth
                id="outlined-required"
                label="Address line 1"
                onChange={handleAddressLine1Change}
                error={addressLine1Error}
                helperText={addressLine1Error ? "Please enter a valid address." : ""}
                sx={{
                  "& .MuiFormHelperText-root": {
                    color: addressLine1Error ? "red" : "inherit",
                  },
                }}
              />
              <Box sx={{ marginTop: "20px" }} />
              <TextField
                value={addProject?.address_line2}
                fullWidth
                id="outlined-required"
                label="Address line 2"
                onChange={handleAddressLine2Change}
                helperText={addressLine2Error ? "Please enter a valid address." : ""}
                sx={{
                  "& .MuiFormHelperText-root": {
                    color: addressLine2Error ? "red" : "inherit",
                  },
                }}
              />
              <Box sx={{ marginTop: "20px" }} />
              <TextField
                value={addProject?.city}
                required
                fullWidth
                id="outlined-required"
                label="City/town/locality"
                onChange={handleCityChange}
                error={cityError}
                helperText={cityError ? "Please enter a valid city." : ""}
                sx={{
                  "& .MuiFormHelperText-root": {
                    color: cityError ? "red" : "inherit",
                  },
                }}
              />
              <Box sx={{ marginTop: "20px" }} />
              {selectedCountriesStates.length > 0 && (
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select a state/province/region*</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={addProject?.state || ""}
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
                value={addProject?.postal_code || ""}
                required
                fullWidth
                id="outlined-required"
                label="Postal/zip code"
                error={addProject?.postal_code !== "" && !isValidPostalCode}
                helperText={addProject?.postal_code === "" ? "" : !isValidPostalCode ? "Please enter a valid postal/zip code." : ""}
                sx={{
                  "& .MuiFormHelperText-root": {
                    color: !isValidPostalCode && addProject?.postal_code !== "" ? "red" : "inherit",
                  },
                }}
                onChange={handlePostalCodeChange}
                disabled={!addProject.country}
              />
              <Box sx={{ marginTop: "40px" }} />
              <TextField
                type="text"
                value={callingCode + addProject?.phone_number}
                fullWidth
                id="outlined-required"
                label="Phone number"
                onChange={handlePhoneNumberChange}
                error={phoneNumberError}
                disabled={!addProject.country}
                helperText={phoneNumberError ? "Please enter a valid phone number." : ""}
              />
              <Box sx={{ marginTop: "48px" }} />
              <Typography id="modal-modal-title" variant="h6">
                cmms
              </Typography>
              <Box sx={{ marginTop: "16px" }} />
              <TextField
                value={addProject?.cmms_name}
                fullWidth
                id="outlined-required"
                label="CMMS name"
                onChange={(e) =>
                  setAddProject({
                    ...addProject,
                    cmms_name: e.target.value,
                  })
                }
              />
              <Box sx={{ marginTop: "20px" }} />
              <TextField
                value={addProject?.cmms_link}
                fullWidth
                id="outlined-required"
                label="CMMS link"
                error={Boolean(cmmsLinkerror)}
                helperText={cmmsLinkerror || "Enter a URL for the CMMS link"}
                onChange={(e) => {
                  const newValue = e.target.value;

                  // Update the cmms_link value

                  setAddProject({
                    ...addProject,
                    cmms_link: newValue,
                  });

                  // Check if the input is a valid URL
                  if (newValue && !isValidUrl(newValue)) {
                    setCmmsLinkError("Not a valid URL");
                  } else {
                    setCmmsLinkError(null);
                  }
                }}
              />
              <Box sx={{ marginTop: "48px" }} />
              <Typography id="modal-modal-title" variant="h6">
                demand response
              </Typography>
              <Box sx={{ marginTop: "16px" }} />
              <TextField
                value={addProject?.dr_link}
                fullWidth
                id="outlined-required"
                label="Demand response link"
                onChange={(e) =>
                  setAddProject({
                    ...addProject,
                    dr_link: e.target.value,
                  })
                }
              />
              <Box sx={{ marginTop: "48px" }} />
              <Typography id="modal-modal-title" variant="h6">
                custom color
              </Typography>
              <Box sx={{ marginTop: "16px" }} />
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  fullWidth
                  id="outlined-primary-color"
                  label="Primary color hex code"
                  value={addProject?.primary_color_hex_code !== null ? addProject?.primary_color_hex_code : primaryColor}
                  onChange={handlePrimaryColorChange}
                  error={primaryColorError}
                  helperText={primaryColorError ? "Invalid hex code. Example: #FFFFFF" : ""}
                />
                <Chip
                  label="PREVIEW"
                  sx={{
                    backgroundColor: primaryColorError ? "gray" : primaryColor,
                    color: getOppositeGrayscale(primaryColor),
                    boxShadow: primaryColor === "#FFFFFF" ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                  }}
                />
              </Box>
              <Box sx={{ marginTop: "20px" }} />
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  fullWidth
                  id="outlined-secondary-color"
                  label="Secondary color hex code"
                  value={addProject?.secondary_color_hex_code !== null ? addProject?.secondary_color_hex_code : secondaryColor}
                  // value={secondaryColor}
                  onChange={handleSecondaryColorChange}
                  error={secondaryColorError}
                  helperText={secondaryColorError ? "Invalid hex code. Example: #FFFFFF" : ""}
                />
                <Chip
                  label="PREVIEW"
                  sx={{
                    backgroundColor: secondaryColorError ? "gray" : secondaryColor,
                    color: getOppositeGrayscale(secondaryColor),
                  }}
                />
              </Box>
              <Box sx={{ marginTop: "48px" }} />
              <Typography id="modal-modal-title" variant="h6">
                upload logo
              </Typography>
              <Box sx={{ marginTop: "16px" }} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={handleUploadButtonClick}>
                  Upload logo
                </Button>
                {fileSizeError && (
                  <Box sx={{ marginTop: "20px" }}>
                    <AlertBar
                      severity={"error"}
                      description={"Upload failed: Image must be under 500 KB and within 500 x 500 pixels. Please adjust your file and try again."}
                      show={true}
                      setShow={undefined}
                      isClose={false}
                    />
                  </Box>
                )}
                <input
                  type="file"
                  ref={inputIconFileRef}
                  style={{ display: "none" }}
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                />
                <Box sx={{ marginTop: "10px" }} />
                {iconFileName !== "" && (
                  <Chip
                    label={iconFileName}
                    onDelete={() => {
                      setDeleteLogo(true);
                      handleDeleteIcon();
                    }}
                    sx={{
                      color: "white",
                      backgroundColor: "#6D51A4",
                      "& .MuiChip-deleteIcon": {
                        color: "white",
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ marginTop: "48px" }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, padding: "8px" }}>
              <Button variant="text" color="primary" size="medium" onClick={handleClose}>
                Cancel
              </Button>
              <LoadingButton disabled={!isFormValid()} loading={isLoading} variant="contained" onClick={handleAddProject}>
                {addProjectState == "edit" ? "Save" : "Add project"}
              </LoadingButton>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
