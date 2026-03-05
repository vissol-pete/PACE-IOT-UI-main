import React, { useEffect, useState } from "react";
import { Box, TextField, Typography, IconButton, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface UnitDetailsSectionProps {
  unitSettings: any;
  setUnitSettings: React.Dispatch<React.SetStateAction<any>>;
  onValidationChange: (isValid: boolean) => void;
}

const UnitDetailsSection: React.FC<UnitDetailsSectionProps> = ({ unitSettings, setUnitSettings, onValidationChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setUnitSettings((prev: any) => ({
      ...prev,
      [name]: ["tonnage", "stage1_btuh", "stage2_btuh", "main_voltage", "main_phases"].includes(name)
        ? parseInt(value, 10) || 0  // Parse as integer and fallback to 0 if not a valid number
        : value,
    }));

    name == "unit_name" && setAddUnitError({ ...addUnitError, unitName: !isValidUnitName(value) });
    name == "unit_serial_num" && setAddUnitError({ ...addUnitError, serialNumber: !isValidUnitSerialNumber(value) });
    name == "unit_brand" && setAddUnitError({ ...addUnitError, unitBrand: !isValidBrandName(value) });
    name == "unit_model_number" && setAddUnitError({ ...addUnitError, unitModelNumber: !isValidModelNumber(value) });
    name == "stage1_btuh" && setAddUnitError({ ...addUnitError, stage1BTU: !isValidStageBtuNumber(value) });
    name == "stage2_btuh" && setAddUnitError({ ...addUnitError, stage2BTU: !isValidStageBtuNumber(value) });
    name == "tonnage" && setAddUnitError({ ...addUnitError, tonnage: !isValidTonnageNumber(value) });
    name == "main_voltage" && setAddUnitError({ ...addUnitError, mainVoltage: !isValidVoltage(value) });
    name == "main_phases" && setAddUnitError({ ...addUnitError, mainVoltage: !isValidPhases(value) })
  };

  //validations
  const isValidUnitName = (name: string): boolean => {
    const regex = /^[A-Za-z0-9\s]{5,20}$/;
    return regex.test(name);
  };
  const isValidUnitSerialNumber = (name: string): boolean => {
    const regex = /^[a-zA-Z0-9_-]{8,25}$/;
    return regex.test(name);
  };
  const isValidBrandName = (name: string): boolean => {
    const regex = /^[a-zA-Z]{2,50}$/;
    return regex.test(name);
  };
  const isValidModelNumber = (name: string): boolean => {
    const regex = /^[a-zA-Z0-9\-\/]{5,30}$/;
    return regex.test(name);
  };

  const isValidStageBtuNumber = (name: string): boolean => {
    const parsedValue = parseInt(name, 10);
    const isValid = (!isNaN(parsedValue) && parsedValue >= 1000 && parsedValue <= 100000)
    console.log(isValid ? "valiid" : "not valid")
    return isValid
  };

  const isValidTonnageNumber = (tonnage: string): boolean => {
    const regex = /^(?:100|\d{1,2})(?:\.\d)?$/;

    if (!regex.test(tonnage)) {
      return false;
    }

    const numValue = parseFloat(tonnage);
    return numValue >= 0.1 && numValue <= 100;
  };

  const isValidVoltage = (name: string): boolean => {
    const parsedValue = parseInt(name, 10);
    return (!isNaN(parsedValue) && parsedValue >= 100 && parsedValue <= 600)
  }

  const isValidPhases = (name: string): boolean => {
    const parsedValue = parseInt(name, 10);
    return (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 3)
  }
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
    onValidationChange(
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

  useEffect(() => {
    isFormValid();
  }, [addUnitError]);

  const renderTextField = (
    label: string,
    name: string,
    value: string | number,
    required: boolean = false
  ) => (
    <TextField
      fullWidth
      label={label}
      name={name}
      variant="outlined"
      margin="dense"
      value={value}
      onChange={handleInputChange}
      required={required}

      error={(name == "unit_name" && addUnitError.unitName) ||
        (name == "unit_serial_num" && addUnitError.serialNumber) ||
        (name == "unit_brand" && addUnitError.unitBrand) ||
        (name == "unit_model_number" && addUnitError.unitModelNumber) ||
        (name == "tonnage" && addUnitError.tonnage) ||
        (name == "main_voltage" && addUnitError.mainVoltage) ||
        (name == "main_phases" && addUnitError.mainPhases)
      }
      helperText={
        (name == "unit_name" && addUnitError.unitName && "Unit name must be 5-20 characters long and contain only letters and numbers") ||
        (name == "unit_serial_num" && addUnitError.serialNumber && "Unit serial number must be between 8-12 characters") ||
        (name == "unit_brand" && addUnitError.unitBrand && "Unit brand must be text between 2 - 50 characters") ||
        (name == "unit_model_number" && addUnitError.unitModelNumber && "Unit model number must be between 5 - 30 characters and only  (-), (/) allowed in special characters") ||
        (name == "stage1_btuh" && addUnitError.stage1BTU && "Must be a number between 1000 and 100,000 BTUs/hr.") ||
        (name == "stage2_btuh" && addUnitError.stage2BTU && "Must be a number between 1000 and 100,000 BTUs/hr.") ||
        (name == "tonnage" && addUnitError.tonnage && "Please enter a valid tonnage number between 0.1 and 100 with up to 1 decimal place") ||
        (name == "main_voltage" && addUnitError.mainVoltage && "Must be a number between 100 and 600 volts.") ||
        (name == "main_phases" && addUnitError.mainPhases && "Must be a number between 1 and 3 phases.")
      }
    />
  );

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <Typography variant="h6">Unit Details</Typography>
        <IconButton onClick={handleToggleExpand} size="small">
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        {renderTextField("Unit Name", "unit_name", unitSettings.unit_name, true)}
        {renderTextField("Unit Serial Number", "unit_serial_num", unitSettings.unit_serial_num, true)}
        {renderTextField("Unit Brand", "unit_brand", unitSettings.unit_brand, true)}
        {renderTextField("Unit Model Number", "unit_model_number", unitSettings.unit_model_number, true)}

        {/* Row for Stage 1 and Stage 2 BTUs with margins */}
        <Box sx={{ gap: 2, marginTop: 2, marginBottom: 2 }}>
          <TextField
            label="Stage 1 BTUs/hr"
            name="stage1_btuh"
            variant="outlined"
            margin="dense"
            fullWidth
            value={unitSettings.stage1_btuh}
            onChange={handleInputChange}
            error={addUnitError.stage1BTU}
            helperText={addUnitError.stage1BTU ? "Must be a number between 1000 and 100,000 BTUs/hr." : ""}
          />
          <TextField
            label="Stage 2 BTUs/hr"
            name="stage2_btuh"
            variant="outlined"
            margin="dense"
            fullWidth
            value={unitSettings.stage2_btuh}
            onChange={handleInputChange}
            error={addUnitError.stage2BTU}
            helperText={addUnitError.stage2BTU ? "Must be a number between 1000 and 100,000 BTUs/hr." : ""}
          />
        </Box>

        {renderTextField("Tonnage", "tonnage", unitSettings.tonnage)}
        {renderTextField("Main Voltage", "main_voltage", unitSettings.main_voltage)}
        {renderTextField("Main Phases", "main_phases", unitSettings.main_phases)}
      </Collapse>
    </Box>
  );
};

export default UnitDetailsSection;
