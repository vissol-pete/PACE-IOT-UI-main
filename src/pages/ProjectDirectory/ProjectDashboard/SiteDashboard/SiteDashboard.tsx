import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { RootState } from "../../../../redux/store";

import {
  LogoAddressComponentDownload,
  KPICardsSite,
  EnergyDataCardSite,
  UnitsTable,
  InfoFooter,
  AddNewUnitModel,
  UnitsTableButtons,
  DeleteUnitModel,
  UpdateFirmwareModel,
  DeployGreengrassModel,
  SiteDashboardBypassUnitsModel,
  SiteDashboardTakeUnitsOnlineModel,
  RebootUnitsModel,
  EditUnitSettingsModel,
  TakeUnitOnlineModel,
  BypassUnitModel,
  RebootSelectedUnit,
} from "../../../../features";
import { setBreadcrumbText, setHeaderText } from "../../../../redux/Slice/Navigation/NavigationSlice";
import { setAllSitesData, setAllUnitsData, selectAddUnitState } from "../../../../redux/Slice/SiteDirectory/SiteDirectorySlice";
import { fetchSiteDashboardData, fetchUnitsData } from "../../../../services/apis";
import { UnitsRequestData, UnitsTableRow, AddUnit } from "../../../../types";
import { AlertBar } from "../../../../components";
import { selectUserRole } from "../../../../redux/Slice/Authentication/AuthenticationSlice";

export default function SiteDashboard() {
  const dispatch = useDispatch();
  const { projectName, projectId, siteName, siteId } = useParams();
  const addUnitState = useSelector(selectAddUnitState);
  const userRole = useSelector(selectUserRole);
  const [enableSearchQuery, setEnableSearchQuery] = useState(false);
  const [paginationModel, setPaginationModel] = useState<any>(() => {
    const savedPaginationModel = localStorage.getItem("unitPaginationModel");
    return savedPaginationModel ? JSON.parse(savedPaginationModel) : {
      page: 0,
      pageSize: 10,
    };
  });
  useEffect(()=>{
   localStorage.setItem('unitPaginationModel',JSON.stringify(paginationModel))
  },[paginationModel])

  const [siteUnitsRequestData, setSiteUnitsRequestData] = useState<UnitsRequestData>({
    search_substring: "",
    pageNumber: "0",
    pageSize: "10",
    sortOrder: "asc",
    sortField: "unit_name",
    site_Id: siteId || "",
  });
  const [unitsFilteredRows, setUnitsFilteredRows] = useState<UnitsTableRow[]>([]);
  const [openAddNewUnitModel, setOpenAddNewUnitModel] = useState(false);
  const [openDeleteUnitModel, setOpenDeleteUnitModel] = useState(false);
  const [openUpdateFirmwareModel, setOpenUpdateFirmwareModel] = useState(false);
  const [openDeployGreengrassModel, setOpenDeployGreengrassModel] = useState(false);
  const [openSiteDashboardBypassUnitsModel, setOpenSiteDashboardBypassUnitsModel] = useState(false);
  const [openSiteDashboardTakeUnitsOnlineModel, setOpenSiteDashboardTakeUnitsOnlineModel] = useState(false);
  const [openRebootUnitsModel, setOpenRebootUnitsModel] = useState(false);
  const [addUnit, setAddUnit] = useState<AddUnit>({
    name: "",
    serial_number: "",
    unit_brand: "",
    unit_model_number: "",
    stage_1_BTU: "",
    stage_2_BTU: "",
    tonnage: "",
    main_voltage: "",
    main_phases: "",
  });
  const [alertState, setAlertState] = useState({
    isAlert: false,
    severity: "",
    title: "",
    description: "",
    resetOpen: false,
  });
  const [showModelAlert, setShowModelAlert] = useState(true);
  const [selectedUnitsRows, setSelectedUnitsRows] = useState<GridRowSelectionModel>([]);
  const [selectedUnitsFilteredRows, setSelectedUnitsFilteredRows] = useState<UnitsTableRow[]>([]);
  const [energyType, setEnergyType] = useState(() => {
    const storedValue = localStorage.getItem("energyType");
    return storedValue ? storedValue : "KWH";
  });

  // edit unit modal update select here
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [openEditUnitSettingsModel, setOpenEditUnitSettingsModel] = useState(false);
  const [openTakeOnlineUnitModel, setOpenTakeOnlineUnitModel] = useState(false);
  const [openBypassUnitModel, setOpenBypassUnitModel] = useState(false);
  const [openRebootUnitModel, setOpenRebootUnitModel] = useState(false);
  const siteData = useSelector((state: RootState) => state?.siteDirectory?.allUnitsData).data;
  const [someUnitsEnrolledForDemandResponse, setSomeUnitsEnrolledForDemandResponse] = useState(false);

  const handleEditClick = (rowData: any) => {
    const selectedUnit = siteData && siteData.find((unit: any) => unit.unit_id == rowData.id);
    if (selectedUnit) {
      setSelectedUnit(selectedUnit);
      setOpenEditUnitSettingsModel(true);
    }
  };

  // Fetch site dashboard data using useQuery
  const { data, isLoading, isError } = useQuery({
    queryKey: ["siteDashboardData", { siteId, energyType: energyType }], // Adjust energyType as needed
    queryFn: fetchSiteDashboardData,
    enabled: !!siteId, // Only fetch if siteId is available
  });

  useEffect(() => {
    dispatch(setBreadcrumbText(["Project directory", projectName, siteName]));
    dispatch(setHeaderText(siteName));

    if (data) {
      setEnableSearchQuery(false);
      dispatch(setAllSitesData(data)); // Store fetched data in Redux
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dispatch]);

  useEffect(() => {
    if (enableSearchQuery) {
      setEnableSearchQuery(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableSearchQuery]);

  const {
    data: siteUnitsData,
    isLoading: siteUnitsDataLoading,
    isError: siteUnitsDataError,
    isSuccess: siteUnitsDataSuccess,
    refetch
  } = useQuery({
    queryKey: ["siteUnitsData", { siteUnitsRequestData }],
    queryFn: fetchUnitsData,
    enabled: enableSearchQuery,
    staleTime: 0,
  });

  useEffect(() => {
    if (siteUnitsRequestData?.sortField !== "" && siteUnitsRequestData?.sortOrder !== "") setEnableSearchQuery(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteUnitsRequestData]);

  useEffect(() => {
    setSiteUnitsRequestData({ ...siteUnitsRequestData, site_Id: siteId || "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  useEffect(() => {
    if (!siteUnitsDataLoading && siteUnitsData !== undefined && !siteUnitsDataError) {
      // console.log("fetchSearchedAllProjects", searchedAllProjectsData.message);
      setEnableSearchQuery(false);
      if (siteUnitsData.message === "No projects found") {
        dispatch(setAllUnitsData({}));
      } else {
        dispatch(setAllUnitsData(siteUnitsData));
        const hasTrue = siteUnitsData?.data?.some((item: any) => item.dr_enrollment);
        const trueCount = siteUnitsData?.data?.filter((item: any) => item.dr_enrollment).length;
        // console.log("hasTrue", hasTrue);
        // console.log("trueCount", trueCount);
        if (hasTrue && trueCount < siteUnitsData?.data?.length) {
          // console.log("At least one `dr_enrollment` is true, but not all.");
          setSomeUnitsEnrolledForDemandResponse(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteUnitsDataSuccess, siteUnitsData, dispatch]);

  const setShowAlert = (show: boolean) => {
    setAlertState({ ...alertState, isAlert: show });
  };

  if (isLoading) {
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

  if (isError) {
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

  console.log("siteUnitsData", siteUnitsData);
  // console.log("addUnit", addUnit);
  // console.log("selectedUnitsRows", selectedUnitsRows);
  // console.log("siteUnitsDataError", siteUnitsDataError);

  return (
    <>
      <Box sx={{ padding: "24px" }}>
        {alertState.isAlert && (
          <>
            <AlertBar
              severity={alertState.severity}
              title={alertState.title}
              description={alertState.description}
              show={alertState.isAlert}
              setShow={setShowAlert}
            />
            <Box
              sx={{
                marginTop: "10px",
              }}
            />
          </>
        )}
        <EditUnitSettingsModel
          openEditUnitSettingsModel={openEditUnitSettingsModel}
          setOpenEditUnitSettingsModel={setOpenEditUnitSettingsModel}
          setOpenTakeOnlineUnitModel={setOpenTakeOnlineUnitModel}
          setOpenBypassUnitModel={setOpenBypassUnitModel}
          setOpenRebootUnitModel={setOpenRebootUnitModel}
          unit={selectedUnit}
          refetchFunctions={[refetch]}
        />
        <TakeUnitOnlineModel openTakeOnlineUnitModel={openTakeOnlineUnitModel} setOpenTakeOnlineUnitModel={setOpenTakeOnlineUnitModel} />
        <BypassUnitModel openBypassUnitModel={openBypassUnitModel} setOpenBypassUnitModel={setOpenBypassUnitModel} />
        <RebootSelectedUnit openRebootUnitModel={openRebootUnitModel} setOpenRebootUnitModel={setOpenRebootUnitModel} />
        <AddNewUnitModel
          openAddNewUnitModel={openAddNewUnitModel}
          setOpenAddNewUnitModel={setOpenAddNewUnitModel}
          addUnit={addUnit}
          setAddUnit={setAddUnit}
          siteId={siteId}
          setAlertState={setAlertState}
          setEnableSearchQuery={setEnableSearchQuery}
          addUnitState={addUnitState}
        />
        <DeleteUnitModel
          openDeleteUnitModel={openDeleteUnitModel}
          setOpenDeleteUnitModel={setOpenDeleteUnitModel}
          setEnableSearchQuery={setEnableSearchQuery}
          addUnit={addUnit}
          setAlertState={setAlertState}
        />
        <UpdateFirmwareModel
          openUpdateFirmwareModel={openUpdateFirmwareModel}
          setOpenUpdateFirmwareModel={setOpenUpdateFirmwareModel}
          setEnableSearchQuery={setEnableSearchQuery}
          showModelAlert={showModelAlert}
          setShowModelAlert={setShowModelAlert}
          selectedUnitsRows={selectedUnitsRows}
          selectedUnitsFilteredRows={selectedUnitsFilteredRows}
          setSelectedUnitsFilteredRows={setSelectedUnitsFilteredRows}
          setAlertState={setAlertState}
        />
        <DeployGreengrassModel
          openDeployGreengrassModel={openDeployGreengrassModel}
          setOpenDeployGreengrassModel={setOpenDeployGreengrassModel}
          showModelAlert={showModelAlert}
          setShowModelAlert={setShowModelAlert}
          selectedUnitsRows={selectedUnitsRows}
          selectedUnitsFilteredRows={selectedUnitsFilteredRows}
          setSelectedUnitsFilteredRows={setSelectedUnitsFilteredRows}
          setAlertState={setAlertState}
        />
        <SiteDashboardBypassUnitsModel
          openSiteDashboardBypassUnitsModel={openSiteDashboardBypassUnitsModel}
          setOpenSiteDashboardBypassUnitsModel={setOpenSiteDashboardBypassUnitsModel}
          showModelAlert={showModelAlert}
          setShowModelAlert={setShowModelAlert}
          selectedUnitsRows={selectedUnitsRows}
          selectedUnitsFilteredRows={selectedUnitsFilteredRows}
          setSelectedUnitsFilteredRows={setSelectedUnitsFilteredRows}
          setAlertState={setAlertState}
          setEnableSearchQuery={setEnableSearchQuery}
          siteId={siteId}
        />
        <SiteDashboardTakeUnitsOnlineModel
          openSiteDashboardTakeUnitsOnlineModel={openSiteDashboardTakeUnitsOnlineModel}
          setOpenSiteDashboardTakeUnitsOnlineModel={setOpenSiteDashboardTakeUnitsOnlineModel}
          selectedUnitsRows={selectedUnitsRows}
          selectedUnitsFilteredRows={selectedUnitsFilteredRows}
          setSelectedUnitsFilteredRows={setSelectedUnitsFilteredRows}
        />
        <RebootUnitsModel
          openRebootUnitsModel={openRebootUnitsModel}
          setOpenRebootUnitsModel={setOpenRebootUnitsModel}
          showModelAlert={showModelAlert}
          setShowModelAlert={setShowModelAlert}
          selectedUnitsRows={selectedUnitsRows}
          selectedUnitsFilteredRows={selectedUnitsFilteredRows}
          setSelectedUnitsFilteredRows={setSelectedUnitsFilteredRows}
        />
        <Box sx={{ marginTop: "20px" }} />
        <LogoAddressComponentDownload />
        <KPICardsSite projectName={projectName} siteName={siteName} />
        <Box sx={{ marginTop: "20px" }} />
        <EnergyDataCardSite
          energyType={energyType}
          setEnergyType={setEnergyType}
          projectName={projectName}
          siteName={siteName}
          someUnitsEnrolledForDemandResponse={someUnitsEnrolledForDemandResponse}
          setEnableSearchQuery={setEnableSearchQuery}
        />
        <Box sx={{ marginTop: "20px" }} />
        <Typography variant="h2">UNITS ({siteUnitsData?.data?.length ? siteUnitsData?.data?.length : "0"})</Typography>
        <Box sx={{ marginTop: "20px" }} />
        <Paper
          sx={{
            boxShadow: "0px 1px 14px 0px #00071624",
            paddingX: "20px",
            paddingY: "10px",
          }}
        >
          {userRole !== "TECHNICIAN" && (
            <UnitsTableButtons
              setOpenAddNewUnitModel={setOpenAddNewUnitModel}
              setOpenUpdateFirmwareModel={setOpenUpdateFirmwareModel}
              setShowModelAlert={setShowModelAlert}
              selectedUnitsRows={selectedUnitsRows}
              setOpenDeployGreengrassModel={setOpenDeployGreengrassModel}
              setOpenSiteDashboardBypassUnitsModel={setOpenSiteDashboardBypassUnitsModel}
              setOpenSiteDashboardTakeUnitsOnlineModel={setOpenSiteDashboardTakeUnitsOnlineModel}
              setOpenRebootUnitsModel={setOpenRebootUnitsModel}
              siteUnitsRequestData={siteUnitsRequestData}
              setSiteUnitsRequestData={setSiteUnitsRequestData}
            />
          )}
          <UnitsTable
            siteUnitsDataLoading={siteUnitsDataLoading}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            siteUnitsRequestData={siteUnitsRequestData}
            setSiteUnitsRequestData={setSiteUnitsRequestData}
            setEnableSearchQuery={setEnableSearchQuery}
            unitsFilteredRows={unitsFilteredRows}
            setUnitsFilteredRows={setUnitsFilteredRows}
            setAddUnit={setAddUnit}
            setOpenAddNewUnitModel={setOpenAddNewUnitModel}
            setOpenDeleteUnitModel={setOpenDeleteUnitModel}
            selectedUnitsRows={selectedUnitsRows}
            setSelectedUnitsRows={setSelectedUnitsRows}
            projectName={projectName}
            projectId={projectId}
            siteName={siteName}
            siteId={siteId}
            handleEditClick={handleEditClick}
            userRole={userRole}
          />
        </Paper>
        <Box sx={{ marginTop: "20px" }} />
      </Box>
      <InfoFooter />
      <Box sx={{ marginTop: "20px" }} />
    </>
  );
}
