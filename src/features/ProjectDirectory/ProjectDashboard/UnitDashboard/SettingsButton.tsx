import { Box, Button, Typography } from "@mui/material";

export default function SettingsButton({ setOpenEditUnitSettingsModel }: any) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Button
        variant="outlined"
        color="primary"
        size="medium"
        sx={{
          borderColor: "#2196F380",
          fontSize: "16px",
        }}
        onClick={() => setOpenEditUnitSettingsModel(true)}
      >
        edit unit settings
      </Button>
    </Box>
  );
}
