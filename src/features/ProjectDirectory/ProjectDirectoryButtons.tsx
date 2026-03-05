// import { useEffect, useMemo } from "react";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";

export default function ProjectDirectoryButtons({
  setOpenAddNewProjectModel,
  projectDirectoryRequestData,
  setProjectDirectoryRequestData,
  userRole,
}: any) {
  const navigate = useNavigate();
  const handleOpen = () => setOpenAddNewProjectModel(true);
  const handleProjectDirectorySearchText = (e: any) => {
    // console.log("handleProjectDirectorySearchText", e.target.value);
    setProjectDirectoryRequestData({ ...projectDirectoryRequestData, search_substring: e.target.value });
  };

  const handleOpenCloudwatchLink = () => {
    window.open("https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards/dashboard/DevOpsDashboard", "_blank"); // Opens link in a new tab
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Button variant="contained" color="primary" size="medium" onClick={handleOpen} sx={{ mr: "10px" }}>
          Add new project
        </Button>
        {userRole === "SUPERADMIN" && (
          <Button variant="outlined" color="primary" size="medium" endIcon={<OpenInNewIcon />} sx={{ mr: "10px" }} onClick={handleOpenCloudwatchLink}>
            Access cloudwatch portal
          </Button>
        )}
        {userRole === "SUPERADMIN" && (
          <Button variant="outlined" color="primary" size="medium" onClick={() => navigate("project-directory/super-admin")}>
            SUPER ADMINS
          </Button>
        )}
      </Box>
      <Box>
        <TextField
          placeholder="Search..."
          label={projectDirectoryRequestData?.search_substring ? "Search" : ""}
          variant="standard"
          size="small"
          sx={{ marginBottom: 2 }}
          onChange={handleProjectDirectorySearchText}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </Box>
  );
}
