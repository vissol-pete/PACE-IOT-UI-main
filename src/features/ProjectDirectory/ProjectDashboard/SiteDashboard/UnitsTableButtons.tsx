import { useRef, useState } from "react";
import { Button, ButtonGroup, Grow, Paper, Popper, MenuItem, MenuList, Box, TextField, InputAdornment, useTheme, useMediaQuery } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";

import { setAddUnitState } from "../../../../redux/Slice/SiteDirectory/SiteDirectorySlice";

const options = ["Update firmware", "Deploy greengrass OTA", "Bypass units", "Take units online", "Reboot units"];

export default function UnitsTableButtons({
  setOpenAddNewUnitModel,
  setOpenUpdateFirmwareModel,
  setShowModelAlert,
  selectedUnitsRows,
  setOpenDeployGreengrassModel,
  setOpenSiteDashboardBypassUnitsModel,
  setOpenSiteDashboardTakeUnitsOnlineModel,
  setOpenRebootUnitsModel,
  siteUnitsRequestData,
  setSiteUnitsRequestData,
}: any) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
    if (options[selectedIndex] === "Update firmware") {
      setOpenUpdateFirmwareModel(true);
      setShowModelAlert(true);
    }
    if (options[selectedIndex] === "Deploy greengrass OTA") {
      setOpenDeployGreengrassModel(true);
      setShowModelAlert(true);
    }
    if (options[selectedIndex] === "Bypass units") {
      setOpenSiteDashboardBypassUnitsModel(true);
      setShowModelAlert(true);
    }
    if (options[selectedIndex] === "Take units online") {
      setOpenSiteDashboardTakeUnitsOnlineModel(true);
      setShowModelAlert(true);
    }
    if (options[selectedIndex] === "Reboot units") {
      setOpenRebootUnitsModel(true);
      setShowModelAlert(true);
    }
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  const handleUnitsSearchText = (e: any) => {
    // console.log("handleUnitsSearchText", e.target.value);
    setSiteUnitsRequestData({ ...siteUnitsRequestData, search_substring: e.target.value });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: isSmallScreen ? "start" : "center",
        justifyContent: "space-between",
        flexDirection: isSmallScreen ? "column" : "row",
      }}
    >
      <Box>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          sx={{
            marginRight: "10px",
          }}
          onClick={() => {
            dispatch(setAddUnitState("new"));
            setOpenAddNewUnitModel(true);
          }}
        >
          Add new unit
        </Button>
        <ButtonGroup
          variant="outlined"
          ref={anchorRef}
          aria-label="Button group with a nested menu"
          disabled={selectedUnitsRows?.length <= 0}
          sx={{
            marginTop: isSmallScreen ? "20px" : "0px",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClick}
            sx={{
              borderColor: "#2196F380",
              color: "#00000061",
            }}
          >
            {options[selectedIndex]}
          </Button>
          <Button
            variant="outlined"
            size="small"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
            sx={{
              borderColor: "#2196F380",
            }}
          >
            <ArrowDropDownIcon sx={{ color: "#00000061" }} />
          </Button>
        </ButtonGroup>
      </Box>
      <Box
        sx={{
          marginTop: isSmallScreen ? "20px" : "0px",
        }}
      >
        <TextField
          placeholder="Search..."
          label={siteUnitsRequestData?.search_substring ? "Search" : ""}
          variant="standard"
          size="small"
          sx={{ marginBottom: 2 }}
          onChange={handleUnitsSearchText}
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

      <Popper sx={{ zIndex: 1 }} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      //   disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
