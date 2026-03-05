import { useState, useEffect } from "react";
import { Box, Card, CardContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { ProjectDirectoryRequestData, AddProject, ProjectDirectoryRow } from "../../types";
import { setBreadcrumbText, setHeaderText } from "../../redux/Slice/Navigation/NavigationSlice";
import { setAllProjectsData } from "../../redux/Slice/ProjectDirectory/ProjectDirectorySlice";
import { selectUserRole } from "../../redux/Slice/Authentication/AuthenticationSlice";
import { ProjectDirectoryButtons, ProjectDirectoryTable, AddNewProjectModel, LogoModel, DeleteProjectModel } from "../../features";
import { fetchSearchedAllProjects, fetchAllProjects } from "../../services/apis";
import { AlertBar } from "../../components";
import { InfoFooter } from "../../features";

export default function ProjectDirectory() {
  const dispatch = useDispatch();
  const userRole = useSelector(selectUserRole);
  const [openAddNewProjectModel, setOpenAddNewProjectModel] = useState(false);
  const [projectDirectoryFilteredRows, setProjectDirectoryFilteredRows] = useState<ProjectDirectoryRow[]>([]);
  const [enableSearchQuery, setEnableSearchQuery] = useState(false);
  const [openLogoModel, setOpenLogoModel] = useState(false);
  const [logoPreviewURL, setLogoPreviewURL] = useState("");
  const [addProject, setAddProject] = useState<AddProject>({
    name: "",
    country: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    phone_number: "",
    cmms_name: "",
    cmms_link: "",
    dr_link: "",
    primaryColorHexCode: "",
    secondaryColorHexCode: "",
    upload_logo: false,
    content_type: "",
  });
  const [paginationModel, setPaginationModel] = useState<any>(() => {
    const savedPaginationModel = localStorage.getItem("projectPaginationModel");
    return savedPaginationModel ? JSON.parse(savedPaginationModel) : {
      page: 0,
      pageSize: 10,
    };
  });
  useEffect(()=>{
   localStorage.setItem('projectPaginationModel',JSON.stringify(paginationModel))
  },[paginationModel])

  const [openDeleteProjectModel, setOpenDeleteProjectModel] = useState(false);
  // const [showProjectAddedAlert, setProjectAddedAlert] = useState(false);
  // const [showProjectDeletedAlert, setShowProjectDeletedAlert] = useState(false);
  const [projectDirectoryRequestData, setProjectDirectoryRequestData] = useState<ProjectDirectoryRequestData>({
    search_substring: "",
    pageNumber: "0",
    pageSize: "10",
    sortOrder: "asc",
    sortField: "projectName",
  });
  const [alertState, setAlertState] = useState({
    isAlert: false,
    severity: "",
    title: "",
    description: "",
    resetOpen: false,
  });

  useEffect(() => {
    dispatch(setBreadcrumbText(["Project directory"]));
    dispatch(setHeaderText("Project directory"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: searchedAllProjectsData,
    isLoading: isSearchedAllProjectsLoading,
    isSuccess: isSearchedAllProjectsSuccess,
  } = useQuery({
    queryKey: ["allProjects", { projectDirectoryRequestData }],
    queryFn: fetchSearchedAllProjects,
    enabled: enableSearchQuery,
  });

  useEffect(() => {
    setEnableSearchQuery(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDirectoryRequestData]);

  useEffect(() => {
    if (!isSearchedAllProjectsLoading && searchedAllProjectsData !== undefined) {
      // console.log("fetchSearchedAllProjects", searchedAllProjectsData.message);
      setEnableSearchQuery(false);
      if (searchedAllProjectsData.message === "No projects found") {
        dispatch(setAllProjectsData({}));
      } else {
        dispatch(setAllProjectsData(searchedAllProjectsData));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchedAllProjectsSuccess, searchedAllProjectsData, dispatch]);

  const setShowAlert = (show: boolean) => {
    setAlertState({ ...alertState, isAlert: show });
  };

  const {
    data: allProjectsData,
    isLoading: isAllProjectsLoading,
    isSuccess: isAllProjectsSuccess,
  } = useQuery({
    queryKey: ["fetchAllProjects"],
    queryFn: fetchAllProjects,
  });

  // console.log("allProjectsData", allProjectsData);
  // console.log("fetchSearchedAllProjects", searchedAllProjectsData);
  // console.log("isSearchedAllProjectsLoading", isSearchedAllProjectsLoading);
  // console.log("isSearchedAllProjectsSuccess", isSearchedAllProjectsSuccess);
  // console.log("enableSearchQuery", enableSearchQuery);
  // console.log("projectDirectorySearchText", projectDirectorySearchText);
  // console.log("projectDirectoryRequestData", projectDirectoryRequestData);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Make sure the Box takes full viewport height
          padding: "16px 24px",
        }}
      >
        {/* Alert notifications */}
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

        {/* Main content */}
        <Card sx={{ marginTop: "10px", flex: 1 }}>
          <CardContent>
            <Box sx={{ marginTop: "10px" }} />
            <AddNewProjectModel
              openAddNewProjectModel={openAddNewProjectModel}
              setOpenAddNewProjectModel={setOpenAddNewProjectModel}
              addProject={addProject}
              setAddProject={setAddProject}
              setEnableSearchQuery={setEnableSearchQuery}
              // setProjectAddedAlert={setProjectAddedAlert}
              setAlertState={setAlertState}
            />
            <LogoModel
              openLogoModel={openLogoModel}
              setOpenLogoModel={setOpenLogoModel}
              logoPreviewURL={logoPreviewURL}
              setLogoPreviewURL={setLogoPreviewURL}
            />
            <DeleteProjectModel
              openDeleteProjectModel={openDeleteProjectModel}
              setOpenDeleteProjectModel={setOpenDeleteProjectModel}
              setEnableSearchQuery={setEnableSearchQuery}
              // onDeleteSuccess={() => setShowProjectDeletedAlert(true)}
              setAlertState={setAlertState}
            />
            {userRole === "SUPERADMIN" && (
              <ProjectDirectoryButtons
                setOpenAddNewProjectModel={setOpenAddNewProjectModel}
                projectDirectoryRequestData={projectDirectoryRequestData}
                setProjectDirectoryRequestData={setProjectDirectoryRequestData}
                userRole={userRole}
              />
            )}
            <ProjectDirectoryTable
              projectDirectoryFilteredRows={projectDirectoryFilteredRows}
              setProjectDirectoryFilteredRows={setProjectDirectoryFilteredRows}
              setOpenLogoModel={setOpenLogoModel}
              isSearchedAllProjectsLoading={isSearchedAllProjectsLoading}
              setLogoPreviewURL={setLogoPreviewURL}
              setOpenAddNewProjectModel={setOpenAddNewProjectModel}
              addProject={addProject}
              setAddProject={setAddProject}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
              setEnableSearchQuery={setEnableSearchQuery}
              setOpenDeleteProjectModel={setOpenDeleteProjectModel}
              projectDirectoryRequestData={projectDirectoryRequestData}
              setProjectDirectoryRequestData={setProjectDirectoryRequestData}
              userRole={userRole}
            />
          </CardContent>
        </Card>
      </Box>
      {/* Footer */}
      <Box sx={{ mt: 2 }}>
        <InfoFooter />
      </Box>
    </Box>
  );
}
