import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { submitContactUsForm } from "../../services/apis";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

export default function MessageCard({ setSeverity, setDescription, setShowAlert }: any) {
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const submitContactUsFormMutation = useMutation({
    mutationFn: submitContactUsForm,
    onSuccess: (data) => {
      console.log("Contact details submitted successfully:", data);
      setSeverity("success");
      setDescription("Thank you for contacting us! We'll get back to you shortly.");
      setShowAlert(true);
      setIsLoading(false);
      handleClose();
    },
    onError: (error) => {
      console.error("Error submitting contact details:", error);
      setSeverity("error");
      setDescription("There was an issue submitting the form. Please try again later.");
      setShowAlert(true);
      setIsLoading(false);
    },
  });

  const handleClose = () => {
    setContactInfo({
      name: "",
      email: "",
      message: "",
    });
  };

  const cleanPayload = (payload: Record<string, any>) => {
    return Object.fromEntries(Object.entries(payload).filter(([_, value]) => value !== ""));
  };

  const handleSubmit = () => {
    setShowAlert(false);
    setIsLoading(true);
    submitContactUsFormMutation.mutate(cleanPayload(contactInfo));
  };

  const validateEmail = (email: any) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateName = (name: any) => {
    const specialCharsPattern = /^[a-zA-Z0-9 ]*$/; // allows letters, numbers, and spaces
    return specialCharsPattern.test(name);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card
        sx={{
          marginTop: "10px",
        }}
      >
        <CardContent sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: 2,
          "&:last-child": {
            paddingBottom: 2,
          }
        }}>
          <Box sx={{
            boxShadow: 'none',
          }}>
            <Typography variant="h5" color="primary">
              contact us
            </Typography>
            <Typography variant="body2">We’d love to hear from you! Please fill out the form below.</Typography>
          </Box>
          <Box sx={{
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <TextField
              required
              fullWidth
              id="outlined-required"
              label="Name"
              value={contactInfo?.name}
              error={!validateName(contactInfo?.name)}
              helperText={!validateName(contactInfo?.name) ? "Please enter a valid name without symbols." : ""}
              onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
            />
            <TextField
              required
              fullWidth
              id="outlined-required"
              label="Email"
              value={contactInfo?.email}
              error={contactInfo?.email != null && contactInfo?.email.length != 0 ? !validateEmail(contactInfo?.email) : false}
              helperText={
                contactInfo?.email != null && contactInfo?.email.length != 0 && !validateEmail(contactInfo?.email)
                  ? "Please enter a valid email address."
                  : ""
              }
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            />
            <TextField
              required
              fullWidth
              id="outlined-required"
              label="Message"
              multiline
              rows={4}
              value={contactInfo?.message}
              onChange={(e) => setContactInfo({ ...contactInfo, message: e.target.value })}
            />
          </Box>
          {/* <Box sx={{ marginTop: "16px" }} /> */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <LoadingButton
              variant="contained"
              loading={isLoading}
              size="medium"
              onClick={handleSubmit}
              disabled={
                contactInfo.name.length < 2 ||
                !validateName(contactInfo?.name) ||
                contactInfo.email.length < 2 ||
                !validateEmail(contactInfo?.email) ||
                contactInfo.message.length < 2
              }
            >
              submit
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
