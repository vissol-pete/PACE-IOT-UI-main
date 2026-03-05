import React, { useState } from "react";
import { Box, FormControl, FormLabel, Select, MenuItem, Typography, RadioGroup, FormControlLabel, Radio, IconButton, Collapse, SelectChangeEvent } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface PaceAIDeviceSectionProps {
  unitSettings: any;
  setUnitSettings: (settings: any) => void;
  selectDeviceIds: string[];
  value: string;
  setValue: (value: string) => void;
}

export default function PaceAIDeviceSection({
  unitSettings,
  setUnitSettings,
  selectDeviceIds,
  value,
  setValue,
}: PaceAIDeviceSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDeviceIdChange = (event: SelectChangeEvent<string>) => {
    setUnitSettings((prev: any) => ({
      ...prev,
      device_id: event.target.value,
    }));
  };

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6">PACE AI Device Connection</Typography>
        <IconButton onClick={toggleExpansion}>
          {isExpanded ?  <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <FormControl fullWidth margin="dense" variant="outlined" sx={{ marginTop: 2 }}>
          <FormLabel>Pace AI Device ID</FormLabel>
          <Select
            value={unitSettings.device_id}
            onChange={handleDeviceIdChange}
            displayEmpty
            renderValue={(value) => {
              console.log("renderValue:", value); // Debugging
              return value ? value : <span style={{ color: "#9e9e9e" }}>Please select an option</span>;
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: "260px",
                  mt: 0.5,
                },
              },
            }}
          >
            {selectDeviceIds.map((deviceId) => (
              deviceId !== null && 
              <MenuItem key={deviceId} value={deviceId}>
                {deviceId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl component="fieldset" sx={{ marginTop: "20px" }}>
          <Typography variant="h6" sx={{ textAlign: "left" }}>
            PACE AI Device Actions
          </Typography>
          <RadioGroup
            aria-label="pace-ai-device"
            name="pace-ai-device"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            sx={{
              marginTop: "10px",
              flexDirection: "column",
            }}
          >
            <FormControlLabel value="take_online" control={<Radio />} label="Take online" />
            <FormControlLabel value="bypass" control={<Radio />} label="Bypass" />
            <FormControlLabel value="reboot" control={<Radio />} label="Reboot" />
          </RadioGroup>
        </FormControl>
      </Collapse>
    </Box>
  );
}
