import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Button,
  TextField,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { createNewUnit, editUnit } from "../../../../services/apis";
import { selectUserEmail } from "../../../../redux/Slice/Authentication/AuthenticationSlice";
import axios from "axios";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 444,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  maxHeight: "95vh",
  overflowY: "auto",
};

export default function AddNewUnitModel({
  openAddNewUnitModel,
  setOpenAddNewUnitModel,
  addUnit,
  setAddUnit,
  siteId,
  setAlertState,
  setEnableSearchQuery,
  addUnitState,
}: any) {
  const userEmail = useSelector(selectUserEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [addUnitError, setAddUnitError] = useState({
    unitName: false,
    serialNumber: false,
    unitBrand: false,
    unitModelNumber: false,
    stage1BTU: false,
    stage2BTU: false,
    tonnage: false,
    mainVoltage: false,
    mainPhases: false,
  });

  const isFormValid = () => {
    return (
      addUnit?.name?.trim() !== "" &&
      addUnit?.serial_number?.trim() !== "" &&
      addUnit?.unit_brand?.trim() !== "" &&
      addUnit?.unit_model_number?.trim() !== "" &&
      !addUnitError.unitName &&
      !addUnitError.serialNumber &&
      !addUnitError.unitBrand &&
      !addUnitError.unitModelNumber &&
      !addUnitError.stage1BTU &&
      !addUnitError.stage2BTU &&
      !addUnitError.tonnage &&
      !addUnitError.mainVoltage &&
      !addUnitError.mainPhases
    );
  };

  const isValidUnitName = (name: string): boolean => {
    const regex = /^[A-Za-z0-9\s]{5,20}$/;
    return regex.test(name);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAddUnit({ ...addUnit, name: newName });

    if (!isValidUnitName(newName)) {
      setAddUnitError({ ...addUnitError, unitName: true });
    } else {
      setAddUnitError({ ...addUnitError, unitName: false });
    }
  };

  const isValidUnitSerialNumber = (name: string): boolean => {
    const regex = /^[a-zA-Z0-9_-]{8,25}$/;
    return regex.test(name);
  };
  const handleSerialNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAddUnit({ ...addUnit, serial_number: newName });
    if (!isValidUnitSerialNumber(newName)) {
      setAddUnitError({ ...addUnitError, serialNumber: true });
    } else {
      setAddUnitError({ ...addUnitError, serialNumber: false });
    }
  };

  const isValidBrandName = (name: string): boolean => {
    const regex = /^[a-zA-Z]{2,50}$/;
    return regex.test(name);
  };
  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAddUnit({ ...addUnit, unit_brand: newName });
    if (!isValidBrandName(newName)) {
      setAddUnitError({ ...addUnitError, unitBrand: true });
    } else {
      setAddUnitError({ ...addUnitError, unitBrand: false });
    }
  };

  const isValidModelNumber = (name: string): boolean => {
    const regex = /^[a-zA-Z0-9\-\/]{5,30}$/;
    return regex.test(name);
  };
  const handleModelNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAddUnit({ ...addUnit, unit_model_number: newName });

    if (!isValidModelNumber(newName)) {
      setAddUnitError({ ...addUnitError, unitModelNumber: true });
    } else {
      setAddUnitError({ ...addUnitError, unitModelNumber: false });
    }
  };

  const handleStage1BTUChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAddUnit({ ...addUnit, stage_1_BTU: value });

      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue >= 1000 && parsedValue <= 100000) {
        setAddUnitError({ ...addUnitError, stage1BTU: false });
      } else {
        setAddUnitError({ ...addUnitError, stage1BTU: true });
      }
    }
  };

  const handleStage2BTUChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAddUnit({ ...addUnit, stage_2_BTU: value });

      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue >= 1000 && parsedValue <= 100000) {
        setAddUnitError({ ...addUnitError, stage2BTU: false });
      } else {
        setAddUnitError({ ...addUnitError, stage2BTU: true });
      }
    }
  };

  const isValidTonnageNumber = (tonnage: string): boolean => {
    const regex = /^(?:100|\d{1,2})(?:\.\d)?$/;

    if (!regex.test(tonnage)) {
      return false;
    }

    const numValue = parseFloat(tonnage);
    return numValue >= 0.1 && numValue <= 100;
  };

  const handleTonnageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAddUnit({ ...addUnit, tonnage: newName });

    if (!isValidTonnageNumber(newName)) {
      setAddUnitError({ ...addUnitError, tonnage: true });
    } else {
      setAddUnitError({ ...addUnitError, tonnage: false });
    }
  };

  const handleVoltageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAddUnit({ ...addUnit, main_voltage: value });

      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue >= 100 && parsedValue <= 600) {
        setAddUnitError({ ...addUnitError, mainVoltage: false });
      } else {
        setAddUnitError({ ...addUnitError, mainVoltage: true });
      }
    }
  };

  const handleMainPhasesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAddUnit({ ...addUnit, main_phases: value });

      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 3) {
        setAddUnitError({ ...addUnitError, mainPhases: false });
      } else {
        setAddUnitError({ ...addUnitError, mainPhases: true });
      }
    }
  };

  const handleConnectionStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddUnit({ ...addUnit, connectionStatus: (event.target as HTMLInputElement).value });
  };

  const createNewUnitMutation = useMutation({
    mutationFn: createNewUnit,
    onSuccess: (data) => {
      console.log("Project created successfully:", data);
      setEnableSearchQuery(true);
      setIsLoading(false);
      setAlertState({ isAlert: true, severity: "success", title: "", description: "Unit added.", resetOpen: true });
      handleClose();
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { data } = error.response;
          console.log("Response Data:", data);
          setEnableSearchQuery(true);
          setAlertState({
            isAlert: true,
            severity: "error",
            title: "Unit was unable to be added. Please try again later. ",
            description: data?.error,
            resetOpen: true,
          });
        } else {
          console.log("Error without response:", error.message);
        }
      } else {
        console.log("Non-Axios Error:", error);
      }

      handleClose();
    },
  });

  const editUnitMutation = useMutation({
    mutationFn: editUnit,
    onSuccess: (data) => {
      console.log("Project created successfully:", data);
      setEnableSearchQuery(true);
      setIsLoading(false);
      setAlertState({ isAlert: true, severity: "success", title: "", description: "Unit added.", resetOpen: true });
      handleClose();
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { data } = error.response;
          console.log("Response Data:", data);
          setEnableSearchQuery(true);
          setAlertState({
            isAlert: true,
            severity: "error",
            title: "Unit was unable to be added. Please try again later. ",
            description: data?.error,
            resetOpen: true,
          });
        } else {
          console.log("Error without response:", error.message);
        }
      } else {
        console.log("Non-Axios Error:", error);
      }

      handleClose();
    },
  });

  const handleClose = () => {
    setAddUnit({
      name: "",
      serial_number: "",
      unit_brand: "",
      unit_model_number: "",
      stage_1_BTU: "",
      stage_2_BTU: "",
      tonnage: "",
      main_voltage: "",
      main_phases: "",
    });
    setAddUnitError({
      unitName: false,
      serialNumber: false,
      unitBrand: false,
      unitModelNumber: false,
      stage1BTU: false,
      stage2BTU: false,
      tonnage: false,
      mainVoltage: false,
      mainPhases: false,
    });
    setIsLoading(false);
    setOpenAddNewUnitModel(false);
  };

  const cleanPayload = (payload: Record<string, any>) => {
    return Object.fromEntries(Object.entries(payload).filter(([_, value]) => value !== ""));
  };

  const handleAddUnit = () => {
    setIsLoading(true);
    if (addUnitState === "edit") {
      editUnitMutation.mutate(
        cleanPayload({
          unit_id: addUnit?.unit_id,
          unit_name: addUnit?.name,
          hvac_serial_num: addUnit?.serial_number,
          hvac_make: addUnit?.unit_brand,
          hvac_model_number: addUnit?.unit_model_number,
          user: userEmail,
          pace_ai_device_action: addUnit?.pace_ai_device_id === "-" ? null : addUnit?.connectionStatus, //'take_online', 'bypass', 'reboot'.
          device_id: addUnit?.pace_ai_device_id === "-" ? null : addUnit?.pace_ai_device_id,

          tonnage: addUnit?.tonnage,
          main_voltage: addUnit?.main_voltage,
          main_phases: addUnit?.main_phases,
          stage1_btuh: addUnit?.stage_1_BTU,
          stage2_btuh: addUnit?.stage_2_BTU,
        })
      );
    } else {
      createNewUnitMutation.mutate(
        cleanPayload({
          site_id: siteId,
          unit_name: addUnit?.name,
          hvac_serial_num: addUnit?.serial_number,
          hvac_make: addUnit?.unit_brand,
          hvac_model_number: addUnit?.unit_model_number,
          tonnage: addUnit?.tonnage,
          main_voltage: addUnit?.main_voltage,
          main_phases: addUnit?.main_phases,
          stage1_btuh: addUnit?.stage_1_BTU,
          stage2_btuh: addUnit?.stage_2_BTU,
        })
      );
    }
  };

  // console.log("addProject", addProject);
  return (
    <Modal open={openAddNewUnitModel} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6">
          {addUnitState === "edit" ? "Edit unit" : "Add new unit"}
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Typography id="modal-modal-title" variant="h6">
          UNIT DETAILS
        </Typography>
        <Box sx={{ marginTop: "20px" }} />
        <TextField
          value={addUnit?.name}
          required
          fullWidth
          id="outlined-required"
          label="Unit name"
          onChange={handleNameChange}
          error={addUnitError.unitName}
          helperText={addUnitError.unitName ? "Unit name must be 5-20 characters long and contain only letters and numbers" : ""}
          sx={{
            "& .MuiFormHelperText-root": {
              color: addUnitError.unitName ? "red" : "inherit",
            },
          }}
        />
        <Box sx={{ marginTop: "20px" }} />
        <TextField
          value={addUnit?.serial_number}
          required
          fullWidth
          id="outlined-required"
          label="Unit serial number"
          onChange={handleSerialNumberChange}
          error={addUnitError.serialNumber}
          helperText={addUnitError.serialNumber ? "Unit serial number must be between 8-12 characters" : ""}
          sx={{
            "& .MuiFormHelperText-root": {
              color: addUnitError.serialNumber ? "red" : "inherit",
            },
          }}
        />
        <Box sx={{ marginTop: "20px" }} />
        <TextField
          value={addUnit?.unit_brand}
          required
          fullWidth
          id="outlined-required"
          label="Unit brand"
          onChange={handleBrandChange}
          error={addUnitError.unitBrand}
          helperText={addUnitError.unitBrand ? "Unit brand must be text between 2 - 50 characters" : ""}
          sx={{
            "& .MuiFormHelperText-root": {
              color: addUnitError.unitBrand ? "red" : "inherit",
            },
          }}
        />
        <Box sx={{ marginTop: "20px" }} />
        <TextField
          value={addUnit?.unit_model_number}
          required
          fullWidth
          id="outlined-required"
          label="Unit model number"
          onChange={handleModelNumberChange}
          error={addUnitError.unitModelNumber}
          helperText={addUnitError.unitModelNumber ? "Unit model number must be between 5 - 30 characters and only  (-), (/) allowed in special characters" : ""}
          sx={{
            "& .MuiFormHelperText-root": {
              color: addUnitError.unitModelNumber ? "red" : "inherit",
            },
          }}
        />
        <Box sx={{ marginTop: "40px" }} />
        <TextField
          value={addUnit?.stage_1_BTU}
          fullWidth
          id="outlined-required"
          label="Stage 1 BTUs/hr"
          onChange={handleStage1BTUChange}
          error={addUnitError.stage1BTU}
          helperText={addUnitError.stage1BTU ? "Must be a number between 1000 and 100,000 BTUs/hr." : ""}
          sx={{
            "& .MuiFormHelperText-root": {
              color: addUnitError.stage1BTU ? "red" : "inherit",
            },
          }}
        />
        <Box sx={{ marginTop: "20px" }} />
        <TextField
          value={addUnit?.stage_2_BTU}
          fullWidth
          id="outlined-required"
          label="Stage 2 BTUs/hr"
          onChange={handleStage2BTUChange}
          error={addUnitError.stage2BTU}
          helperText={addUnitError.stage2BTU ? "Must be a number between 1000 and 100,000 BTUs/hr." : ""}
          sx={{
            "& .MuiFormHelperText-root": {
              color: addUnitError.stage2BTU ? "red" : "inherit",
            },
          }}
        />
        <Box sx={{ marginTop: "40px" }} />
        <TextField
          value={addUnit?.tonnage}
          fullWidth
          id="outlined-required"
          label="Tonnage"
          onChange={handleTonnageNumberChange}
          error={addUnitError.tonnage}
          helperText={addUnitError.tonnage ? "Please enter a valid tonnage number between 0.1 and 100 with up to 1 decimal place" : ""}
          sx={{
            "& .MuiFormHelperText-root": {
              color: addUnitError.tonnage ? "red" : "inherit",
            },
          }}
        />
        <Box sx={{ marginTop: "20px" }} />
        <TextField
          value={addUnit?.main_voltage}
          fullWidth
          id="outlined-required"
          label="Main voltage"
          onChange={handleVoltageNumberChange}
          error={addUnitError.mainVoltage}
          helperText={addUnitError.mainVoltage ? "Must be a number between 100 and 600 volts." : ""}
          sx={{
            "& .MuiFormHelperText-root": {
              color: addUnitError.mainVoltage ? "red" : "inherit",
            },
          }}
        />
        <Box sx={{ marginTop: "20px" }} />
        <TextField
          value={addUnit?.main_phases}
          fullWidth
          id="outlined-required"
          label="Main phases"
          onChange={handleMainPhasesChange}
          error={addUnitError.mainPhases}
          helperText={addUnitError.mainPhases ? "Must be a number between 1 and 3 phases." : ""}
          sx={{
            "& .MuiFormHelperText-root": {
              color: addUnitError.mainPhases ? "red" : "inherit",
            },
          }}
        />
        <Box sx={{ marginTop: "20px" }} />
        <Divider />
        {addUnitState === "edit" && (
          <Box>
            <Accordion
              sx={{
                boxShadow: "none",
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                <Typography id="modal-modal-title" variant="h6">
                  PACE AI device Connection
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  disabled
                  fullWidth
                  id="outlined-required"
                  label="PACE AI device ID"
                  defaultValue={addUnit?.pace_ai_device_id === "-" ? null : addUnit?.pace_ai_device_id}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
                <Box sx={{ marginTop: "20px" }} />
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">Choose connection status</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={addUnit?.connectionStatus}
                    onChange={handleConnectionStatus}
                  >
                    <FormControlLabel value="take_online" control={<Radio />} label="Take online" />
                    <FormControlLabel value="bypass" control={<Radio />} label="Bypass" />
                    <FormControlLabel value="reboot" control={<Radio />} label="Reboot" />
                  </RadioGroup>
                </FormControl>
              </AccordionDetails>
            </Accordion>
            <Box sx={{ marginTop: "10px" }} />
            <Divider />
            <Accordion
              sx={{
                boxShadow: "none",
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                <Typography id="modal-modal-title" variant="h6">
                  Alerts
                </Typography>
              </AccordionSummary>
              <AccordionDetails>Alerts</AccordionDetails>
            </Accordion>
          </Box>
        )}
        <Box sx={{ marginTop: "40px" }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="text" color="primary" size="medium" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton disabled={!isFormValid()} loading={isLoading} variant="contained" onClick={handleAddUnit}>
            {addUnitState === "edit" ? "Save" : "Add unit"}
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
