import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Drawer, Toolbar, Typography, Divider, IconButton, useMediaQuery, Breadcrumbs, SwipeableDrawer, Tooltip, Link } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { navListItems } from "./NavListItems";
import { DrawerList } from "../../features";
import { selectBreadcrumbText, selectHeaderText } from "../../redux/Slice/Navigation/NavigationSlice";
import AlertSocket from "../../features/AlertSocket/AlertSocket";

const drawerWidth = 180;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function SideNavDrawer({ children }: any) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const appBarRef = useRef<HTMLDivElement>(null);
  const { projectName, projectId, siteName, siteId } = useParams();
  const [breadcrumbKey, setBreadcrumbKey] = useState<number>(Date.now());
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const headerText = useSelector(selectHeaderText);
  const breadcrumbText = useSelector(selectBreadcrumbText);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(navListItems[0]);
  const [appBarHeight, setAppBarHeight] = useState(64); // Default AppBar height
  const [isWrapped, setIsWrapped] = useState(false);
  const breadcrumbsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const checkIfWrapped = () => {
      if (breadcrumbsRef.current) {
        const containerHeight = breadcrumbsRef.current.clientHeight;
        // If the container's height is greater than 24, the content has wrapped
        setIsWrapped(containerHeight > 24);
      }
    };

    // Check if content is wrapped initially and on resize
    checkIfWrapped();
    window.addEventListener('resize', checkIfWrapped);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener('resize', checkIfWrapped);
  }, [breadcrumbText]);


  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleBreadcrumbClick = (item: string, index: number) => {
    console.log("Breadcrumb clicked:", item, index);
    if (item === "Project directory") {
      navigate("");
    }

    if (index === 1) {
      navigate(`/project-directory/project-dashboard/${projectName}/${projectId}`);
    }
    if (index === 2) {
      navigate(`/project-directory/project-dashboard/site-dashboard/${projectName}/${projectId}/${siteName}/${siteId}`);
    }
  };

  useEffect(() => {
    // Update key whenever the location changes
    setBreadcrumbKey(Date.now());
  }, [location]);

  function handleCollapsedBreadcrumbs(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    // console.info("You clicked a breadcrumb.");
  }

  useLayoutEffect(() => {
    if (appBarRef.current) {
      setAppBarHeight(appBarRef.current.offsetHeight);
    }
  }, [headerText, breadcrumbText, open, isMediumScreen]);

  console.log("Breadcrumb text:", breadcrumbText);
  console.log("Header text:", headerText);

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <AppBar
        ref={appBarRef}
        position="fixed"
        open={open && !isMediumScreen}
        sx={{
          backgroundColor: "#fff",
          boxShadow: "none",
          padding: 0,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: 2,
          }}
          disableGutters
        >
          <IconButton
            // color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2,
              p: 2,
              ...(open && !isMediumScreen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              minWidth: 0,
              marginTop: "10px",
              paddingTop: "10px",
              gap: 1,
            }}
            onClick={handleCollapsedBreadcrumbs}
          >
            <Breadcrumbs ref={breadcrumbsRef} key={breadcrumbKey} maxItems={ isMediumScreen || isWrapped ? 2 : undefined}>
              {breadcrumbText?.map((crumb: string, index: number) => (
                <Link
                  underline={index + 1 === breadcrumbText?.length ? "none" : "hover"}
                  key={index}
                  color="text.primary"
                  onClick={() => handleBreadcrumbClick(crumb, index)}
                  sx={{
                    cursor: index + 1 === breadcrumbText?.length ? "initial" : "pointer",
                  }}
                >
                  {crumb}
                </Link>
              ))}
            </Breadcrumbs>
            {headerText && (
              <Box
                sx={{
                  flexGrow: 1,
                  minWidth: 0,
                }}
              >
                <Tooltip title={headerText} placement="bottom-start">
                  <Typography
                    noWrap
                    variant="h1"
                    color="text.primary"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {headerText}
                  </Typography>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {isMediumScreen ? (
        <SwipeableDrawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="temporary"
          anchor="left"
          open={open}
          onOpen={handleDrawerOpen}
          onClose={handleDrawerClose}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>{theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
          </DrawerHeader>
          <Divider />
          <DrawerList selectedItem={selectedItem} setSelectedItem={setSelectedItem} onItemSelect={handleDrawerClose} />
        </SwipeableDrawer>
      ) : (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant={"persistent"}
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>{theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
          </DrawerHeader>
          <Divider />
          <DrawerList selectedItem={selectedItem} setSelectedItem={setSelectedItem} onItemSelect={handleDrawerClose} />
        </Drawer>
      )}
      <Main
        open={open && !isMediumScreen}
        sx={{
          padding: 0,
          height: "100vh",
          marginTop: `${appBarHeight - 88}px`,
          marginLeft: isMediumScreen ? 0 : undefined,
          width: isMediumScreen ? "100%" : open ? `calc(100% - ${drawerWidth}px)` : "100%",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <DrawerHeader />
        <AlertSocket />
        <Box sx={{ marginTop: isExtraSmallScreen ? "8px" : 0 }}>{children}</Box>
      </Main>
    </Box>
  );
}
