import React, { useEffect, useState, useRef } from "react";
import { Box, Button, Modal, Typography, Divider, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useQuery } from "@tanstack/react-query";
import { fetchDeviceList } from "../../../../../services/apis";
import { useParams } from "react-router-dom";
import UnitDetailsSection from "./UnitDetailsSection";
import PaceAIDeviceSection from "./PaceAIDeviceConnectionSection";
import AlertsSection from "./AlertSettingsSection";
import { defaultAlertConfig } from "./AlertHelper";
import { editAlertConfig, updateUnitData } from "../../../../../services/apis";
import { UpdateUnitType } from "../../../../../types/UnitDirectory/UnitDirectoryTypes";

interface DeviceListData {
  device_ids: string[];
}

const defaultUnitSettings = {
  unit_id: 0,
  unit_name: "",
  unit_serial_num: "",
  unit_brand: "",
  unit_model_number: "",
  device_id: "",
  tonnage: 0,
  main_voltage: 0,
  main_phases: 0,
  stage1_btuh: 0,
  stage2_btuh: 0,
  user: "",
};

const getModalStyle = () => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 590 },
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  maxHeight: "95vh",
  overflowY: "auto",
});

export default function EditUnitModal({
  openEditUnitSettingsModel,
  setOpenEditUnitSettingsModel,
  setOpenTakeOnlineUnitModel,
  setOpenBypassUnitModel,
  setOpenRebootUnitModel,
  unit,
  refetchFunctions,
}: any) {
  const user = useSelector((state: RootState) => state.authentication.email);
  const { siteId } = useParams();
  const [value, setValue] = useState("offline");
  const [selectDeviceIds, setSelectDeviceIds] = useState<string[]>([]);
  const [alertConfig, setAlertConfig] = useState(defaultAlertConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [enableButton, setEnableButton] = useState(false);
  const [userChangesFlag, setUserChangesFlag] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const handleValidationChange = (valid: boolean) => {
    setIsFormValid(valid);
  };

  const { data: deviceListData } = useQuery<DeviceListData>({
    queryKey: ["deviceList", { siteId }],
    queryFn: fetchDeviceList,
  });

  const [unitSettings, setUnitSettings] = useState({
    ...defaultUnitSettings,
    user: user,
    // pace_ai_device_action: "offline",
  });

  // unit data loads each time modal opens
  useEffect(() => {
    if (!openEditUnitSettingsModel) {
      setAlertConfig(defaultAlertConfig);
      setUnitSettings(defaultUnitSettings);
      setValue("offline");
    } else if (unit) {
      // Ensure unit data loads each time modal opens
      setUnitSettings({
        unit_id: unit.unit_id || 0,
        unit_name: unit.unit_name || "",
        unit_serial_num: unit.unit_serial_num || "",
        unit_brand: unit.unit_brand || "",
        unit_model_number: unit.unit_model_number || "",
        device_id: unit.pace_ai_device_id || "",
        tonnage: unit.tonnage || 0,
        main_voltage: unit.main_voltage || 0,
        main_phases: unit.main_phases || 0,
        stage1_btuh: unit.stage1_btuh || 0,
        stage2_btuh: unit.stage2_btuh || 0,
        user: user,
      });
    }
  }, [openEditUnitSettingsModel, unit]);

  const handleUserChange = (value: any) => {
    setUnitSettings(value);
    setUserChangesFlag(true);
  };

  useEffect(() => {
    if (userChangesFlag) {
      if (unitSettings.unit_name && unitSettings.unit_serial_num && unitSettings.unit_brand && unitSettings.unit_model_number && isFormValid) {
        setEnableButton(true);
      } else {
        setEnableButton(false);
      }
    }
  }, [unitSettings, userChangesFlag, isFormValid]);

  // handles modal radio button value change and actions
  useEffect(() => {
    if (value === "take_online") {
      setOpenTakeOnlineUnitModel(true);
      setOpenBypassUnitModel(false);
      setOpenRebootUnitModel(false);
      // setUnitSettings({...unitSettings, pace_ai_device_action: "online"});
    }
    if (value === "bypass") {
      setOpenBypassUnitModel(true);
      setOpenTakeOnlineUnitModel(false);
      setOpenRebootUnitModel(false);
    }
    if (value === "reboot") {
      setOpenRebootUnitModel(true);
      setOpenTakeOnlineUnitModel(false);
      setOpenBypassUnitModel(false);
    }
    if (value === "offline") {
      setOpenTakeOnlineUnitModel(false);
      setOpenBypassUnitModel(false);
      setOpenRebootUnitModel(false);
    }
  }, [value]);

  const handleClose = () => setOpenEditUnitSettingsModel(false);

  // update unit here
  const handleUnitUpdate = async () => {
    try {
      console.log(alertConfig);
      const response = await editAlertConfig(alertConfig);
      console.log("Alerts updated successfully", response);
    } catch (error) {
      console.error("Error updating alerts:", error);
    }
  };

  // updates the unit settings from modal info
  const handleUpdateUnitSettings = async (payload: UpdateUnitType) => {
    try {
      if (value === "offline") {
        delete payload.pace_ai_device_action;
        delete payload.device_id;
        delete payload.user;
        const response = await updateUnitData({ ...payload });
      } else {
        const response = await updateUnitData({ ...payload, pace_ai_device_action: value });
      }
      // resetAfterSubmit();
    } catch (error) {
      console.error("Error submitting unit update:", error);
      // resetAfterSubmit();
    }
  };

  const handleSubmitAllInfo = async () => {
    setIsLoading(true);
    await handleUpdateUnitSettings(unitSettings);
    await handleUnitUpdate();
    setIsLoading(false);
    if (refetchFunctions && Array.isArray(refetchFunctions)) {
      refetchFunctions.forEach((refetch) => {
        if (typeof refetch === "function") {
          refetch(); 
        }
      });
    }

    // Close the modal
    setOpenEditUnitSettingsModel(false);
  };

  return (
    <Modal open={openEditUnitSettingsModel} onClose={handleClose}>
      <Box sx={getModalStyle}>
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Edit Unit
          </Typography>
        </Box>
        <Box sx={{ padding: 3, paddingTop: 0 }}>
          <UnitDetailsSection unitSettings={unitSettings} setUnitSettings={handleUserChange} onValidationChange={handleValidationChange} />
          <Divider sx={{ my: 2 }} />

          <PaceAIDeviceSection
            unitSettings={unitSettings}
            setUnitSettings={handleUserChange}
            selectDeviceIds={selectDeviceIds}
            value={value}
            setValue={setValue}
          />
          <Divider sx={{ my: 2 }} />

          <AlertsSection
            unitId={unitSettings.unit_id}
            alertConfig={alertConfig}
            setAlertConfig={setAlertConfig}
            setUserChangesFlag={setUserChangesFlag}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, p: 3 }}>
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={isLoading || !enableButton} // Disable button while loading
            variant="contained"
            onClick={handleSubmitAllInfo}
            startIcon={isLoading ? <CircularProgress size={20} /> : null} // Add loader
          >
            {isLoading ? "Saving..." : "Save"} {/* Change text while loading */}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
