import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import { signOut } from "aws-amplify/auth";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { navListItems } from "./NavListItems";

export default function DrawerList({ selectedItem, setSelectedItem, onItemSelect }: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const navigate = useNavigate();

  const handleNavItemClick = (item: (typeof navListItems)[number]) => {
    setSelectedItem(item);
    navigate(item?.path);
    if (isSmallScreen) onItemSelect();
  };

  const clearStorage = () => {
    localStorage.removeItem("energyType");
    localStorage.removeItem("siteSortModel");
    localStorage.removeItem("sitePaginationModel");
    localStorage.removeItem("projectSortModel");
    localStorage.removeItem("projectPaginationModel");
    localStorage.removeItem("unitSortModel");
    localStorage.removeItem("unitPaginationModel");
    localStorage.removeItem("alertSortModel");
    localStorage.removeItem("alertPaginationModel");
    localStorage.removeItem("userSortModel");
    localStorage.removeItem("userPaginationModel");
    localStorage.removeItem("adminSortModel");
    localStorage.removeItem("adminPaginationModel");
  }
  const handleLogout = () => {
    localStorage.setItem("loggedIn", "false");
    clearStorage()
    signOut();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <List>
        {navListItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              onClick={() => handleNavItemClick(item)}
              selected={item.id === selectedItem.id}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#A4DAD6",
                  // color: "#FFFFFF",
                },
              }}
            >
              <ListItemText primary={item.navText} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleLogout()}>
            <ListItemIcon>
              <Logout color="primary" />
            </ListItemIcon>
            <ListItemText primary={"Log out"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
