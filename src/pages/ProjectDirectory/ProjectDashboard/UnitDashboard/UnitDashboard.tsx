import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Typography, useMediaQuery } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchUnitDashboardData, updateUnitData, fetchUnitsData } from "../../../../services/apis";
import { setAllUnitData } from "../../../../redux/Slice/UnitDirectory/UnitDirectorySlice";
import { setAllUnitsData } from "../../../../redux/Slice/SiteDirectory/SiteDirectorySlice";
import { useTheme } from "@mui/material/styles";
import {
  SettingsButton,
  BinDataTable,
  KPICardsUnit,
  InfoFooter,
  EditUnitSettingsModel,
  TakeUnitOnlineModel,
  BypassUnitModel,
  RebootSelectedUnit,
} from "../../../../features";
import { useParams, useNavigate } from "react-router-dom";

import { setBreadcrumbText, setHeaderText } from "../../../../redux/Slice/Navigation/NavigationSlice";
import { AlertBar } from "../../../../components";
import { RootState } from "../../../../redux/store";
import { UpdateUnitType } from "../../../../types/UnitDirectory/UnitDirectoryTypes";
import { selectUserRole } from "../../../../redux/Slice/Authentication/AuthenticationSlice";
import { UnitsRequestData } from "../../../../types";


const defaultUpdateUnitPayload: UpdateUnitType = {
  unit_id: -1,
  unit_name: "",
  unit_serial_num: "",
  unit_brand: "",
  unit_model_number: "",
};

export default function UnitDashboard() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const userRole = useSelector(selectUserRole);
  const { projectName, projectId, siteName, siteId, unitName } = useParams();
  const [openEditUnitSettingsModel, setOpenEditUnitSettingsModel] = useState(false);
  const [openTakeOnlineUnitModel, setOpenTakeOnlineUnitModel] = useState(false);
  const [openBypassUnitModel, setOpenBypassUnitModel] = useState(false);
  const [openRebootUnitModel, setOpenRebootUnitModel] = useState(false);
  const [unitUpdatePayload, setUnitUpdatePayload] = useState<UpdateUnitType>(defaultUpdateUnitPayload);
  const [showAlert, setShowAlert] = useState(false);
  const isXs = useMediaQuery(theme.breakpoints.down("xs"), { noSsr: true });
  const [showHeader, setShowHeader] = useState(true);
  const pageParams = useParams();
  const navigate = useNavigate();
  const siteData = useSelector((state: RootState) => state.siteDirectory.allUnitsData).data;
  const [enableSearchQuery, setEnableSearchQuery] = useState(true);
  const [siteUnitsRequestData, setSiteUnitsRequestData] = useState<UnitsRequestData>({
    search_substring: "",
    pageNumber: "0",
    pageSize: "10",
    sortOrder: "asc",
    sortField: "unit_name",
    site_Id: siteId || "",
  });

  // if theres no sitedata we need to grab data to set to siteData here instead of re navigating
  const {
    data: siteUnitsData,
    isLoading: siteUnitsDataLoading,
    isError: siteUnitsDataError,
    isSuccess: siteUnitsDataSuccess,
    refetch: refetchSiteUnitsData,
  } = useQuery({
    queryKey: ["siteUnitsData", { siteUnitsRequestData }],
    queryFn: fetchUnitsData,
    enabled: enableSearchQuery,
    staleTime: 0,
  });

  useEffect(() => {
    if (!siteData) {
      setEnableSearchQuery(true);
    }
  }, []);

  useEffect(() => {
    console.log('sites unit data------------------------------', siteUnitsData)
    if (!siteUnitsDataLoading && siteUnitsData !== undefined && !siteUnitsDataError) {
      setEnableSearchQuery(false);
      if (siteUnitsData.message === "No projects found") {
        dispatch(setAllUnitsData({}));
      } else {
        dispatch(setAllUnitsData(siteUnitsData));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteUnitsDataSuccess, siteUnitsData, dispatch]); 
  // end sequence for grabbing data if siteData is not available

  // grab the specific unit selected from the site data
  const selectedUnit = siteData && siteData.find((unit: any) => unit.unit_id == pageParams.unitId);

  const unitId = pageParams.unitId || "";

  const unitData = useSelector((state: RootState) => state.unitDirectory.unitData);
  // const unitName = unitData.unit_name;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["unitDashboardData", { unitId }],
    queryFn: fetchUnitDashboardData,
    enabled: !!unitId || enableSearchQuery,
  });

  // Log the data when it's available
  useEffect(() => {
    console.log("Unit ID:", unitId);
    setEnableSearchQuery(false);
    if (data) {
      // console.log("Fetched Unit Dashboard Data:", data);
      dispatch(setAllUnitData(data)); // Store fetched data in Redux
      dispatch(setHeaderText(""));
      dispatch(setBreadcrumbText(["Project directory", projectName, siteName, data.unit_name]));
    } else {
      dispatch(setBreadcrumbText(["Project directory", projectName, siteName, "Unit Name"]));
    }
  }, [data, dispatch]);

  // handles header text and visibility based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= theme.breakpoints.values.sm) {
        dispatch(setHeaderText(unitName));
        setShowHeader(false);
      } else {
        dispatch(setHeaderText(""));
        setShowHeader(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Run on initial load

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [unitName, dispatch, theme.breakpoints.values.xs]);

  const resetAfterSubmit = () => {
    setOpenTakeOnlineUnitModel(false);
    setOpenBypassUnitModel(false);
    setOpenRebootUnitModel(false);
    setUnitUpdatePayload(defaultUpdateUnitPayload);
  };

  if (isLoading || siteUnitsDataLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || siteUnitsDataError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <Typography variant="h6" color="error">
          Error fetching site data.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 200px)", // Adjust '100px' to match your footer height
          paddingX: {
            xs: "16px",
            sm: "16px",
            md: "24px",
          },
          paddingBottom: {
            xs: "16px",
            sm: "16px",
            md: "24px",
          },
          paddingTop: 0,
        }}
      >
        <AlertBar
          severity={"success"}
          description={"Unit has been successfully bypassed. "}
          variant={"filled"}
          show={showAlert}
          setShow={setShowAlert}
        />
        <EditUnitSettingsModel
          openEditUnitSettingsModel={openEditUnitSettingsModel}
          setOpenEditUnitSettingsModel={setOpenEditUnitSettingsModel}
          setOpenTakeOnlineUnitModel={setOpenTakeOnlineUnitModel}
          setOpenBypassUnitModel={setOpenBypassUnitModel}
          setOpenRebootUnitModel={setOpenRebootUnitModel}
          unit={selectedUnit}
          refetchFunctions={[refetch, refetchSiteUnitsData]}
        />
        <TakeUnitOnlineModel openTakeOnlineUnitModel={openTakeOnlineUnitModel} setOpenTakeOnlineUnitModel={setOpenTakeOnlineUnitModel} />
        <BypassUnitModel openBypassUnitModel={openBypassUnitModel} setOpenBypassUnitModel={setOpenBypassUnitModel} />
        <RebootSelectedUnit openRebootUnitModel={openRebootUnitModel} setOpenRebootUnitModel={setOpenRebootUnitModel} />
        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent: {
              xs: "flex-start",
              sm: "space-between",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          {showHeader && (
            <Typography noWrap variant="h1" sx={{ paddingLeft: "42px", whiteSpace: "pre" }}>
              {unitName}
            </Typography>
          )}
          {userRole !== "TECHNICIAN" && <SettingsButton setOpenEditUnitSettingsModel={setOpenEditUnitSettingsModel} />}
        </Box>
        <Box sx={{ marginTop: "20px" }} />
        <BinDataTable />
        <Box sx={{ marginTop: "20px" }} />
        <KPICardsUnit
          projectName={projectName}
          siteName={siteName}
          unitName={unitName}
          userRole={userRole}
          setEnableSearchQuery={setEnableSearchQuery}
        />
      </Box>
      <InfoFooter />
    </>
  );
}
