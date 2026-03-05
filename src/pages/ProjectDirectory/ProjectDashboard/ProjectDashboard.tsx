import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";

import {
  AlertsComponent,
  LogoAddressComponent,
  KPICards,
  EnergyDataCard,
  SitesTable,
  InfoFooter,
  AddNewSiteModel,
  DeleteSiteModel,
  BypassUnitsModel,
  TakeUnitsOnlineModel,
  UserAdminTable,
  AddNewUserModel,
  DeleteUserModel,
  // EnergySavingsSlidingMenuMobile,
} from "../../../features";
import { setBreadcrumbText, setHeaderText } from "../../../redux/Slice/Navigation/NavigationSlice";
import { setAllSitesData } from "../../../redux/Slice/ProjectDirectory/ProjectDirectorySlice";
import { fetchAllSites, fetchProjectDashboardKPICardData, fetchSearchedAllSites } from "../../../services/apis";
import { KPICardData, ProjectDashboardRequestData, SitesTableRow, AddSite, AddNewUser, AllSitesList, UserRequestData } from "../../../types";
import { selectUserRole, selectUserEmail } from "../../../redux/Slice/Authentication/AuthenticationSlice";
import { AlertBar } from "../../../components";

export default function ProjectDashboard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const dispatch = useDispatch();
  const userRole = useSelector(selectUserRole);
  const userEmail = useSelector(selectUserEmail);

  const { projectName, projectId } = useParams();
  const [openAddNewSiteModel, setOpenAddNewSiteModel] = useState(false);
  const [openDeleteSiteModel, setOpenDeleteSiteModel] = useState(false);
  const [openBypassUnitsModel, setOpenBypassUnitsModel] = useState(false);
  const [openTakeUnitsOnlineModel, setTakeUnitsOnlineModel] = useState(false);
  const [enableSearchQuery, setEnableSearchQuery] = useState(false);
  const [paginationModelForSites, setPaginationModelForSites] = useState<any>(() => {
    const savedPaginationModel = localStorage.getItem("sitePaginationModel");
    return savedPaginationModel ? JSON.parse(savedPaginationModel) : {
      page: 0,
      pageSize: 10,
    };
  });

  useEffect(()=>{
   localStorage.setItem('sitePaginationModel',JSON.stringify(paginationModelForSites))
  },[paginationModelForSites])

  const [paginationModelForUsers, setPaginationModelForUsers] = useState<any>(() => {
    const savedPaginationModel = localStorage.getItem("userPaginationModel");
    return savedPaginationModel ? JSON.parse(savedPaginationModel) : {
      page: 0,
      pageSize: 10,
    };
  });

  useEffect(()=>{
   localStorage.setItem('userPaginationModel',JSON.stringify(paginationModelForUsers))
  },[paginationModelForUsers])
  
  const [projectDashboardSitesFilteredRows, setProjectDashboardSitesFilteredRows] = useState<SitesTableRow[]>([]);
  const [addSite, setAddSite] = useState<AddSite>({
    name: "",
    country: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    phone_number: "",
    dr_event_enrolled: false,
    project_id: NaN,
  });
  const [projectDashboardRequestData, setProjectDashboardRequestData] = useState<ProjectDashboardRequestData>({
    projectId: projectId ?? "",
    search_substring: "",
    pageNumber: "0",
    pageSize: "10",
    sortOrder: "asc",
    sortField: "name",
  });
  const [kpiCardData, setKPICardData] = useState<KPICardData>({
    project_data: {
      project_name: "",
      logo_url: "",
      address_line_1: "",
      address_line_2: "",
      phone_number: "",
      total_sites: "",
      total_units: "",
    },
    active_alerts_data: {
      active_alerts: "",
      cmms_name: "",
      open_sky_spark_link: "",
      monthly_alerts: {
        JAN: 0,
        FEB: 0,
        MAR: 0,
        APR: 0,
        MAY: 0,
        JUN: 0,
        JUL: 0,
        AUG: 0,
        SEP: 0,
        OCT: 0,
        NOV: 0,
        DEC: 0,
      },
    },
    energy_savings_data: {
      total_savings: "",
      carbon_reduction_savings: "",
      monthly_usage: {},
    },
    electric_demand_last_15_min: "",
    sites_with_demand_response: "",
    dr_link: "",
  });
  const [energyType, setEnergyType] = useState(() => {
    const storedValue = localStorage.getItem("energyType");
    return storedValue ? storedValue : "KWH";
  });
  const [enableFetchProjectDashboardKPICardData, setEnableFetchProjectDashboardKPICardData] = useState(true);
  const [openAddNewUserModel, setOpenAddNewUserModel] = useState(false);
  const [addNewUser, setAddNewUser] = useState<AddNewUser>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [allSitesList, setAllSitesList] = useState<AllSitesList[]>([
    {
      site_id: "",
      project_id: "",
      site_name: "",
    },
  ]);
  const [selectedSiteOptions, setSelectedSiteOptions] = useState<string[]>([]);
  const [openDeleteUserModel, setOpenDeleteUserModel] = useState(false);
  const [alertState, setAlertState] = useState({
    isAlert: false,
    severity: "",
    title: "",
    description: "",
    resetOpen: false,
  });
  const [enableFetchUserData, setEnableFetchUserData] = useState(false);
  const [userRequestData, setUserRequestData] = useState<UserRequestData>({
    search_substring: "",
    pageNumber: "0",
    pageSize: "10",
    sortOrder: "asc",
    sortField: "first_name",
    // role: "",
    projectID: projectId ?? "",
  });
  const [selectedSitesRows, setSelectedSitesRows] = useState<GridRowSelectionModel>([]);

  useEffect(() => {
    dispatch(setBreadcrumbText(["Project directory", projectName]));
    dispatch(setHeaderText(projectName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: projectDashboardKPICardData,
    isLoading: isProjectDashboardKPICardDataLoading,
    // isSuccess: isProjectDashboardKPICardDataSuccess,
  } = useQuery({
    queryKey: ["KPICardData", { projectId: projectId, energyType: energyType }],
    queryFn: fetchProjectDashboardKPICardData,
    enabled: enableFetchProjectDashboardKPICardData,
  });

  useEffect(() => {
    setKPICardData({
      project_data: {
        project_name: projectName || "",
        logo_url: projectDashboardKPICardData?.project_data?.logo_url || "",
        address_line_1: projectDashboardKPICardData?.project_data?.address_line_1 || "",
        address_line_2: projectDashboardKPICardData?.project_data?.address_line_2 || "",
        phone_number: projectDashboardKPICardData?.project_data?.phone_number || "",
        total_sites: projectDashboardKPICardData?.project_data?.total_sites?.toString() || "",
        total_units: projectDashboardKPICardData?.project_data?.total_units?.toString() || "",
      },
      active_alerts_data: {
        active_alerts: projectDashboardKPICardData?.active_alerts_data?.active_alerts.toString() || "0",
        cmms_name: projectDashboardKPICardData?.active_alerts_data?.cmms_name || "",
        open_sky_spark_link: projectDashboardKPICardData?.active_alerts_data?.cmms_link || "",
        monthly_alerts: projectDashboardKPICardData?.active_alerts_data?.monthly_alerts || {
          JAN: 0,
          FEB: 0,
          MAR: 0,
          APR: 0,
          MAY: 0,
          JUN: 0,
          JUL: 0,
          AUG: 0,
          SEP: 0,
          OCT: 0,
          NOV: 0,
          DEC: 0,
        },
      },
      energy_savings_data: {
        total_savings: projectDashboardKPICardData?.energy_savings_data?.total_savings?.toString() || "0",
        carbon_reduction_savings: projectDashboardKPICardData?.energy_savings_data?.carbon_reduction_savings?.toString() || "0",
        monthly_usage: projectDashboardKPICardData?.energy_savings_data?.monthly_usage || {},
      },
      electric_demand_last_15_min: projectDashboardKPICardData?.electric_demand_last_15_min?.toString() || "0",
      sites_with_demand_response: projectDashboardKPICardData?.sites_with_demand_response?.toString() || "0",
      dr_link: projectDashboardKPICardData?.dr_link,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDashboardKPICardData]);

  const {
    data: allSitesData,
    isLoading: isAllSitesDataLoading,
    isSuccess: isAllSitesDataSuccess,
  } = useQuery({
    queryKey: ["allSites", { projectId }],
    queryFn: fetchAllSites,
  });

  useEffect(() => {
    if (!isAllSitesDataLoading && allSitesData !== null && allSitesData !== undefined) {
      const updatedData: AllSitesList[] = [];

      const allSitesOption: AllSitesList = {
        site_id: "all_sites",
        project_id: projectId as string,
        site_name: "All sites",
      };
      // console.log("superAdminItem", superAdminItem);
      // console.log("updatedData", updatedData);
      updatedData.push(allSitesOption);

      for (const i in allSitesData?.data) {
        const itemSub = allSitesData?.data[i];
        const { site_id, project_id, site_name } = itemSub;
        const sortedItem: AllSitesList = {
          site_id: site_id === "" ? "" : site_id,
          project_id: project_id === "" ? "" : project_id,
          site_name: site_name === "" ? "" : site_name,
        };
        updatedData.push(sortedItem);
      }
      // console.log("updatedData", updatedData);
      setAllSitesList(updatedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllSitesDataSuccess, allSitesData]);

  const {
    data: searchedAllSitesData,
    isLoading: isSearchedAllSitesLoading,
    isSuccess: isSearchedAllSitesSuccess,
  } = useQuery({
    queryKey: ["allSearchedSites", { projectDashboardRequestData }],
    queryFn: fetchSearchedAllSites,
    enabled: enableSearchQuery,
  });

  useEffect(() => {
    if (projectDashboardRequestData?.sortField !== "" && projectDashboardRequestData?.sortOrder !== "") setEnableSearchQuery(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDashboardRequestData]);

  useEffect(() => {
    if (!isSearchedAllSitesLoading && searchedAllSitesData !== undefined) {
      setEnableSearchQuery(false);
      if (searchedAllSitesData.message === "No sites found") {
        dispatch(setAllSitesData({}));
      } else {
        dispatch(setAllSitesData(searchedAllSitesData));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchedAllSitesSuccess, searchedAllSitesData, dispatch]);

  const setShowAlert = (show: boolean) => {
    setAlertState({ ...alertState, isAlert: show });
  };

  //console.log("selectedSitesRows", selectedSitesRows);
  // console.log("userRequestData", userRequestData);
  // console.log("userRole", userRole);
  // console.log("allSitesData", allSitesData);
  // console.log("projectDashboardKPICardData", projectDashboardKPICardData);
  // console.log("kpiCardData", kpiCardData);
  // console.log("fetchSearchedAllSites", searchedAllSitesData);
  // console.log("projectDashboardRequestData", projectDashboardRequestData);
  // console.log("enableFetchProjectDashboardKPICardData", enableFetchProjectDashboardKPICardData);
  // console.log("allSitesList", allSitesList);

  return (
    <>
      <Box sx={{ paddingLeft: isSmallScreen ? "16px" : "24px", paddingRight: isSmallScreen ? "16px" : "24px", paddingBottom: "16px" }}>
        {/* <AlertsComponent /> */}
        {!isSmallScreen && (
          <Box
            sx={{
              marginTop: "16px",
            }}
          />
        )}

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
                marginTop: isSmallScreen ? "16px" : "32px",
              }}
            />
          </>
        )}
        <AddNewSiteModel
          openAddNewSiteModel={openAddNewSiteModel}
          setOpenAddNewSiteModel={setOpenAddNewSiteModel}
          addSite={addSite}
          setAddSite={setAddSite}
          setEnableSearchQuery={setEnableSearchQuery}
          projectId={projectId}
          setAlertState={setAlertState}
          kpiCardData={kpiCardData}
        />
        <DeleteSiteModel
          openDeleteSiteModel={openDeleteSiteModel}
          setOpenDeleteSiteModel={setOpenDeleteSiteModel}
          setEnableSearchQuery={setEnableSearchQuery}
          setAlertState={setAlertState}
        />
        <BypassUnitsModel
          openBypassUnitsModel={openBypassUnitsModel}
          setOpenBypassUnitsModel={setOpenBypassUnitsModel}
          setAlertState={setAlertState}
          selectedSitesRows={selectedSitesRows}
          setEnableSearchQuery={setEnableSearchQuery}
        />
        <TakeUnitsOnlineModel
          openTakeUnitsOnlineModel={openTakeUnitsOnlineModel}
          setTakeUnitsOnlineModel={setTakeUnitsOnlineModel}
          setAlertState={setAlertState}
          setEnableSearchQuery={setEnableSearchQuery}
          selectedSitesRows={selectedSitesRows}
        />
        <AddNewUserModel
          openAddNewUserModel={openAddNewUserModel}
          setOpenAddNewUserModel={setOpenAddNewUserModel}
          addNewUser={addNewUser}
          setAddNewUser={setAddNewUser}
          allSitesList={allSitesList}
          projectId={projectId}
          selectedSiteOptions={selectedSiteOptions}
          setSelectedSiteOptions={setSelectedSiteOptions}
          setAlertState={setAlertState}
          setEnableFetchUserData={setEnableFetchUserData}
        />
        <DeleteUserModel
          openDeleteUserModel={openDeleteUserModel}
          setOpenDeleteUserModel={setOpenDeleteUserModel}
          setAlertState={setAlertState}
          setEnableFetchUserData={setEnableFetchUserData}
        />
        {isProjectDashboardKPICardDataLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "40px",
              marginBottom: "10px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <LogoAddressComponent kpiCardData={kpiCardData} />
            <Box
              sx={{
                marginTop: isSmallScreen ? "16px" : "32px",
              }}
            />
            <KPICards kpiCardData={kpiCardData} projectName={projectName} />
            <Box
              sx={{
                marginTop: isSmallScreen ? "16px" : "32px",
              }}
            />
            <EnergyDataCard
              kpiCardData={kpiCardData}
              energyType={energyType}
              setEnergyType={setEnergyType}
              setEnableFetchProjectDashboardKPICardData={setEnableFetchProjectDashboardKPICardData}
              projectName={projectName}
            />
          </>
        )}

        <Box
          sx={{
            marginTop: isSmallScreen ? "16px" : "32px",
          }}
        />
        <SitesTable
          setOpenAddNewSiteModel={setOpenAddNewSiteModel}
          setOpenDeleteSiteModel={setOpenDeleteSiteModel}
          setOpenBypassUnitsModel={setOpenBypassUnitsModel}
          setTakeUnitsOnlineModel={setTakeUnitsOnlineModel}
          isSearchedAllSitesLoading={isSearchedAllSitesLoading}
          projectDashboardSitesFilteredRows={projectDashboardSitesFilteredRows}
          setProjectDashboardSitesFilteredRows={setProjectDashboardSitesFilteredRows}
          setPaginationModel={setPaginationModelForSites}
          paginationModel={paginationModelForSites}
          setEnableSearchQuery={setEnableSearchQuery}
          setAddSite={setAddSite}
          projectName={projectName}
          projectDashboardRequestData={projectDashboardRequestData}
          setProjectDashboardRequestData={setProjectDashboardRequestData}
          projectId={projectId}
          selectedSitesRows={selectedSitesRows}
          setSelectedSitesRows={setSelectedSitesRows}
          userRole={userRole}
        />
        {(userRole === "SUPERADMIN" || userRole === "ADMIN") && (
          <>
            <Box
              sx={{
                marginTop: isSmallScreen ? "16px" : "32px",
              }}
            />
            <UserAdminTable
              setOpenAddNewUserModel={setOpenAddNewUserModel}
              paginationModel={paginationModelForUsers}
              setPaginationModel={setPaginationModelForUsers}
              setAddNewUser={setAddNewUser}
              setSelectedSiteOptions={setSelectedSiteOptions}
              setOpenDeleteUserModel={setOpenDeleteUserModel}
              enableFetchUserData={enableFetchUserData}
              setEnableFetchUserData={setEnableFetchUserData}
              userRequestData={userRequestData}
              setUserRequestData={setUserRequestData}
              userRole={userRole}
              userEmail={userEmail}
            />
          </>
        )}
      </Box>
      <Box sx={{ mt: "auto", width: "100%" }}>
        <InfoFooter />
      </Box>
    </>
  );
}
