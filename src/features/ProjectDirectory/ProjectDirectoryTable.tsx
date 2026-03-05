import { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Box, Link, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ProjectDirectoryRow } from "../../types";
import { setBreadcrumbText, setHeaderText } from "../../redux/Slice/Navigation/NavigationSlice";
import { selectAllProjectsData, setAddProjectState, setSelectedProjectId } from "../../redux/Slice/ProjectDirectory/ProjectDirectorySlice";

export default function ProjectDirectoryTable({
  projectDirectoryFilteredRows,
  setProjectDirectoryFilteredRows,
  setOpenLogoModel,
  isSearchedAllProjectsLoading,
  setLogoPreviewURL,
  setOpenAddNewProjectModel,
  setAddProject,
  paginationModel,
  setPaginationModel,
  setEnableSearchQuery,
  setOpenDeleteProjectModel,
  projectDirectoryRequestData,
  setProjectDirectoryRequestData,
  userRole,
}: any) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const allProjectsData = useSelector(selectAllProjectsData);
  const [totalRows, setTotalRows] = useState(10);
  const [sortModel, setSortModel] = useState(() => {
    const savedSortModel = localStorage.getItem("projectSortModel");
    return savedSortModel ? JSON.parse(savedSortModel) : [{field:'projectName',sort:'asc'}];
  });
  const [isInitialRender, setInitialRender] = useState(true)
  useEffect(()=>{
   if(isInitialRender) {
    setInitialRender(false)
   }
  },[isInitialRender])


  const columns: GridColDef<ProjectDirectoryRow>[] = [
    {
      field: "projectName",
      headerName: "Project name",
      renderCell: (params) => {
        // console.log(params);
        return (
          <Tooltip title={params.value} placement="bottom-start">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#193561", cursor: "pointer", fontSize: "16px" }}
              onClick={() => handleProjectNameClick(params.row)}
            >
              {params.value}
            </Link>
          </Tooltip>
        );
      },
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "logo",
      headerName: "Logo",
      renderCell: (params) => (
        <Tooltip title={params.value} placement="bottom-start">
          {params?.row?.logo !== "-" ? (
            <Link
              // href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#193561", cursor: "pointer", fontSize: "16px" }}
              onClick={() => handleLogoClick(params.row)}
            >
              {params.value}
            </Link>
          ) : (
            <>-</>
          )}
        </Tooltip>
      ),
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone number",
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "cmms",
      headerName: "CMMS",
      renderCell: (params) => (
        <Tooltip title={params.value} placement="bottom-start">
          {params?.row?.cmmsLink !== "-" ? (
            <Link
              href={`${params?.row?.cmmsLink}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#193561", cursor: "pointer", fontSize: "16px" }}
              onClick={() => handleCMMSClick(params.row)}
            >
              {params.value}
            </Link>
          ) : (
            <>-</>
          )}
        </Tooltip>
      ),
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "sites",
      headerName: "Sites",
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "units",
      headerName: "Units",
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "actions",
      type: "actions",
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <GridActionsCellItem
            disabled={userRole === "TECHNICIAN"}
            sx={{
              padding: 1,
              "& .MuiSvgIcon-root": {
                fontSize: "24px",
              },
            }}
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditClick(params.row)}
          />
          <GridActionsCellItem
            disabled={userRole === "TECHNICIAN"}
            sx={{
              padding: 1,
              "& .MuiSvgIcon-root": {
                fontSize: "24px",
              },
            }}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(params.row)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (allProjectsData !== null && allProjectsData !== undefined) {
      const updatedData: ProjectDirectoryRow[] = [];
      for (const i in allProjectsData?.data) {
        const itemSub = allProjectsData?.data[i];
        // console.log("itemSub", itemSub);
        const {
          project_id,
          name,
          logo_url,
          phone_number,
          cmms_name,
          cmms_link,
          sites_count,
          units_count,
          country,
          address_line1,
          address_line2,
          city,
          state,
          postal_code,
          primary_color_hex_code,
          secondary_color_hex_code,
          dr_link,
          logo_filename,
        } = itemSub;
        const sortedItem: ProjectDirectoryRow = {
          id: project_id === "" ? "" : project_id,
          projectName: name === "" ? "-" : name,
          logo: logo_url === null ? "-" : logo_url,
          phoneNumber: phone_number === null ? "-" : phone_number,
          cmms: cmms_name === null ? "-" : cmms_name,
          cmmsLink: cmms_link === null ? "-" : cmms_link,
          sites: sites_count,
          units: units_count,
          country: country === null ? "" : country,
          address_line1: address_line1 == null ? "" : address_line1,
          address_line2: address_line2 == null ? "" : address_line2,
          city: city === null ? "" : city,
          state: state === null ? "" : state,
          postal_code: postal_code === null ? "" : postal_code,
          primaryColorHexCode: primary_color_hex_code === null ? "" : primary_color_hex_code,
          secondaryColorHexCode: secondary_color_hex_code === null ? "" : secondary_color_hex_code,
          demandResponseLink: dr_link === null ? "" : dr_link,
          logo_filename: logo_filename,
        };
        updatedData.push(sortedItem);
      }
      setTotalRows(allProjectsData?.project_count);
      setProjectDirectoryFilteredRows(updatedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProjectsData]);

  const handleProjectNameClick = (row: ProjectDirectoryRow) => {
    console.log("Project Name clicked:", row);
    dispatch(setBreadcrumbText(["Project directory", row?.projectName]));
    dispatch(setHeaderText(row?.projectName));
    dispatch(setSelectedProjectId(row?.id));
    // if (row.id === "superAdmin") {
    //   navigate("project-directory/super-admin");
    // } else {
    navigate(`/project-directory/project-dashboard/${encodeURIComponent(row?.projectName)}/${row?.id}`);
    // }
  };

  const handleLogoClick = (row: ProjectDirectoryRow) => {
    // console.log("Logo clicked:", row);
    setLogoPreviewURL(row?.logo);
    setOpenLogoModel(true);
  };

  const handleCMMSClick = (row: ProjectDirectoryRow) => {
    // console.log("CMMS clicked:", row);
  };

  const handleEditClick = (row: any) => {
    // console.log("Row details for edit:", row);
    dispatch(setAddProjectState("edit"));
    setAddProject({
      project_id: row?.id,
      name: row?.projectName,
      country: row?.country,
      address_line1: row?.address_line1,
      address_line2: row?.address_line2,
      city: row?.city,
      state: row?.state,
      postal_code: row?.postal_code,
      phone_number: row?.phoneNumber,
      cmms_name: row?.cmms === "-" ? "" : row?.cmms,
      cmms_link: row?.cmmsLink === "-" ? "" : row?.cmmsLink,
      dr_link: row?.demandResponseLink,
      primaryColorHexCode: row?.primaryColorHexCode,
      secondaryColorHexCode: row?.secondaryColorHexCode,
      upload_logo: false, //row?.upload_logo,
      content_type: "", //row?.content_type,
      logo_filename: row?.logo_filename,
    });
    setOpenAddNewProjectModel(true);
  };

  const handleDeleteClick = (row: any) => {
    // console.log("Row details for delete:", row);
    dispatch(setSelectedProjectId(row?.id));
    setOpenDeleteProjectModel(true);
  };

  useEffect(() => {
    setProjectDirectoryRequestData({ ...projectDirectoryRequestData, pageNumber: paginationModel?.page, pageSize: paginationModel?.pageSize, sortOrder: sortModel[0].sort, sortField: sortModel[0].field });
    setEnableSearchQuery(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel]);

  const handleSortModelChange = (e: any) => {
     if (e?.length <= 0 || e[0].field ==='logo' || e[0].field ==='phoneNumber') return;
    setProjectDirectoryRequestData({ ...projectDirectoryRequestData, sortOrder: e[0]?.sort ?? "", sortField: e[0]?.field ?? "" });
    setSortModel(e);
    localStorage.setItem("projectSortModel", JSON.stringify(e)); // Save the sort model
  };

  // console.log("projectDirectoryTableData", projectDirectoryTableData);
  // console.log("allProjectsData", allProjectsData);
  // console.log("paginationModel", paginationModel);
  // console.log("selectAllProjectsData", selectAllProjectsData);
  // console.log("projectDirectoryFilteredRows", projectDirectoryFilteredRows);

  return (
    <Box>
      <DataGrid
        loading={isSearchedAllProjectsLoading}
        disableColumnMenu
        sx={{
          display: "grid",
          "& .MuiDataGrid-cell": {
            border: 1,
            borderRight: 0,
            borderTop: 1,
            borderLeft: 0,
            borderColor: "#E2E9F4",
          },
        }}
        autoHeight
        rows={projectDirectoryFilteredRows ?? []}
        columns={columns}
        paginationMode="server"
        rowCount={Math.ceil(totalRows)}
        onPaginationModelChange={(model:any)=>{
          if(!isInitialRender)
          setPaginationModel(model)
        }}
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 15, 50, 100]}
        initialState={{
          sorting: {
            sortModel: sortModel,
          },
        }}
        disableRowSelectionOnClick
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        onSortModelChange={handleSortModelChange}
        disableColumnFilter
      />
    </Box>
  );
}
