import React, { useState, useEffect } from "react";
import { Box, TextField, Select, MenuItem, InputAdornment, useMediaQuery, Theme } from "@mui/material";
import { getAllCallingCodes } from "../../../../../utils/areacode";
import { AlertConfigResponse, ReminderRecipient } from "../../../../../types/Alerts/AlertTypes";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";

interface AlertRecipientsProps {
  recipients: ReminderRecipient[];
  alertConfig: AlertConfigResponse;
  setAlertConfig: any;
}

const isValidEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const EmailField: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
  const [email, setEmail] = useState(value);
  const [error, setError] = useState("");

  // Set initial email once on mount
  useEffect(() => {
    setEmail(value);
  }, [value]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setError(newEmail && !isValidEmail(newEmail) ? "Invalid email address" : "");
    onChange(newEmail); // Call parent onChange with the updated email
  };

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <TextField
      value={email}
      onChange={handleEmailChange}
      label="Email address"
      variant="outlined"
      size="small"
      error={!!error}
      helperText={error || " "}
      sx={{ mr: isMobile ? 0 : 1, flex: 1, width: isMobile ? "100%" : "auto" }}
      FormHelperTextProps={{ style: { minHeight: "1.5em", margin: 0, paddingTop: 0 } }}
    />
  );
};

const PhoneField: React.FC<{
  initialCountryCode: string;
  initialBase: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneNumberChange: (number: string) => void;
}> = ({ initialCountryCode, initialBase, onCountryCodeChange, onPhoneNumberChange }) => {
  const [countryCode, setCountryCode] = useState(initialCountryCode || "+1");
  const [phoneNumber, setPhoneNumber] = useState(initialBase || "");
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  // Reset state when `initialCountryCode` or `initialBase` change
  useEffect(() => {
    setCountryCode(initialCountryCode || "+1");
    setPhoneNumber(initialBase || "");
  }, [initialCountryCode, initialBase]);

  useEffect(() => {
    onCountryCodeChange(countryCode);
  }, [countryCode]);

  useEffect(() => {
    onPhoneNumberChange(phoneNumber);
  }, [phoneNumber]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
    const fullNumber = `${countryCode}${value}`;
    const parsedNumber = parsePhoneNumberFromString(fullNumber, countryCode.replace("+", "") as CountryCode);
    setError(parsedNumber?.isValid() ? null : "Invalid phone number");
  };

  return (
    <TextField
      value={phoneNumber}
      onChange={handlePhoneNumberChange}
      label="Phone number"
      variant="outlined"
      size="small"
      error={!!error}
      helperText={error || " "}
      sx={{ flex: 1, width: isMobile ? "100%" : "auto" }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value as string)}
              size="small"
              variant="standard"
              disableUnderline
              sx={{ width: 52, "& .MuiSelect-select": { paddingLeft: 0 } }}
            >
              {getAllCallingCodes().map(
                (entry) =>
                  entry !== null && (
                    <MenuItem key={entry.country} value={`+${entry.callingCode}`}>
                      +{entry.callingCode}
                    </MenuItem>
                  )
              )}
            </Select>
          </InputAdornment>
        ),
      }}
      FormHelperTextProps={{ style: { minHeight: "1.5em", margin: 0, paddingTop: 0 } }}
    />
  );
};

const ReminderDropdown: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <TextField
      variant="outlined"
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      size="small"
      select
      label="Reminders"
      sx={{ width: isMobile ? "50%" : "116px", ml: isMobile ? 0 : "20px", mt: isMobile ? .2 : -2.5, marginBottom: isMobile ? 2 : 0 }}
    >
      <MenuItem value="daily">Daily</MenuItem>
      <MenuItem value="hourly">Hourly</MenuItem>
    </TextField>
  );
};

const AlertRecipients: React.FC<AlertRecipientsProps> = ({ recipients, alertConfig, setAlertConfig }) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <>
      {recipients.map((recipient, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? 0.5 : 1,
            mt: 1,
          }}
        >
          <EmailField
            value={recipient.email}
            onChange={(value) =>
              setAlertConfig({
                ...alertConfig,
                reminder_recipients: alertConfig.reminder_recipients.map((r, i) => (i === index ? { ...r, email: value } : r)),
              })
            }
          />
          <PhoneField
            initialCountryCode={`+${recipient.phone_number.country_code || "1"}`}
            initialBase={recipient.phone_number.base}
            onCountryCodeChange={(code) =>
              setAlertConfig({
                ...alertConfig,
                reminder_recipients: alertConfig.reminder_recipients.map((r, i) =>
                  i === index ? { ...r, phone_number: { ...r.phone_number, country_code: code.replace("+", "") } } : r
                ),
              })
            }
            onPhoneNumberChange={(number) =>
              setAlertConfig({
                ...alertConfig,
                reminder_recipients: alertConfig.reminder_recipients.map((r, i) =>
                  i === index ? { ...r, phone_number: { ...r.phone_number, base: number } } : r
                ),
              })
            }
          />
          <ReminderDropdown
            value={recipient.reminders || ""}
            onChange={(value) =>
              setAlertConfig({
                ...alertConfig,
                reminder_recipients: alertConfig.reminder_recipients.map((r, i) => (i === index ? { ...r, reminders: value } : r)),
              })
            }
          />
        </Box>
      ))}
    </>
  );
};

export default AlertRecipients;
