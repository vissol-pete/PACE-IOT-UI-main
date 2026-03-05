import { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, TextField, InputAdornment, useTheme, useMediaQuery, Link } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { UserAdminTableRow } from "../../../types";
// import { userAdminTableRows } from "../../../data/ProjectDirectory/ProjectDashboard/ProjectDashboardData";
import { setAddUserState, setSelectedUserId } from "../../../redux/Slice/ProjectDirectory/ProjectDirectorySlice";
import { fetchSearchedUsers } from "../../../services/apis";

// function ExpandableCell({ value }: { value: any }) {
//   const [expanded, setExpanded] = useState(false);

//   if (!value) return null;

//   const displayValue = Array.isArray(value) ? value.join(", ") : value;
//   return (
//     <div>
//       {expanded ? displayValue : displayValue.slice(0, 200)}&nbsp;
//       {displayValue.length > 200 && (
//         <Link component="button" sx={{ fontSize: "inherit", letterSpacing: "inherit" }} onClick={() => setExpanded(!expanded)}>
//           {expanded ? "less" : "more"}
//         </Link>
//       )}
//     </div>
//   );
// }

export default function UserAdminTable({
  setOpenAddNewUserModel,
  // projectId,
  setAddNewUser,
  setSelectedSiteOptions,
  setOpenDeleteUserModel,
  enableFetchUserData,
  setEnableFetchUserData,
  setPaginationModel,
  paginationModel,
  userRequestData,
  setUserRequestData,
  userRole,
  userEmail,
}: any) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [userFilteredRows, setUserFilteredRows] = useState<UserAdminTableRow[]>([]);
  const [totalRows, setTotalRows] = useState(10);
  const [sortModel, setSortModel] = useState(() => {
    const savedSortModel = localStorage.getItem("userSortModel");
    return savedSortModel ? JSON.parse(savedSortModel) : [{field:"firstName",sort:"asc"}];
  });
  const [isInitialRender, setInitialRender] = useState(true)

  useEffect(()=>{
   if(isInitialRender) {
    setInitialRender(false)
   }
  },[isInitialRender])
  
  const cardStyles = {
    boxShadow: "0px 1px 14px 0px #00071624",
    padding: "16px",
    marginTop: isSmallScreen ? "8px" : "16px",
  };
  const columns: GridColDef<UserAdminTableRow>[] = [
    {
      field: "firstName",
      headerName: "First name",
      sortable: true,
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "lastName",
      headerName: "Last name",
      sortable: true,
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: isSmallScreen ? undefined : 1,
    },
    {
      field: "actions",
      type: "actions",
      flex: isSmallScreen ? undefined : 1,
      renderCell: (params) => {
        // console.log(params);
        return (
          <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <GridActionsCellItem
              disabled={params.row.role === "SUPERADMIN" || userEmail === params.row.email}
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
              sx={{
                padding: 1,
                "& .MuiSvgIcon-root": {
                  fontSize: "24px",
                },
              }}
              disabled={params.row.role === "SUPERADMIN" || userEmail === params.row.email}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDeleteClick(params.row)}
            />
          </div>
        );
      },
    },
  ];

  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["superAdminData", { userRequestData, role: userRole }],
    queryFn: fetchSearchedUsers,
    enabled: enableFetchUserData,
  });

  useEffect(() => {
    setEnableFetchUserData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRequestData]);

  useEffect(() => {
    if (userData !== null && userData !== undefined) {
      setEnableFetchUserData(false);
      const updatedData: UserAdminTableRow[] = [];
      for (const i in userData?.data) {
        const itemSub = userData?.data[i];
        const { id, first_name, last_name, email_address, role } = itemSub.dynamodb_data;
        const sortedItem: UserAdminTableRow = {
          id: id === "" ? "" : id,
          firstName: first_name === "" ? "-" : first_name,
          lastName: last_name === "" ? "-" : last_name,
          email: email_address === "" ? "-" : email_address,
          role: role === "" ? "-" : role,
          // sites: role === "ADMIN" ? ["All sites"] : sites.map((site: any) => site?.site_name),
          // sitesData: sites.map((site: any) => ({
          //   ...site,
          //   project_id: projectId,
          // })),
        };

        updatedData.push(sortedItem);
      }
      setUserFilteredRows(updatedData);
      setTotalRows(userData?.total_count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const handleEditClick = (row: any) => {
    // console.log("Row details for edit:", row);
    dispatch(setAddUserState("edit"));
    setOpenAddNewUserModel(true);
    setAddNewUser({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      role: row.role,
    });
    if (row.role === "TECHNICIAN") setSelectedSiteOptions(row?.sitesData);
  };

  const handleDeleteClick = (row: any) => {
    setOpenDeleteUserModel(true);
    dispatch(setSelectedUserId(row?.id));
    // console.log("Row details for delete:", row);
  };

  const handleUsersSearchText = (e: any) => {
    // console.log("handleUsersSearchText", e.target.value);
    setUserRequestData({ ...userRequestData, search_substring: e.target.value });
  };

  const handleSortModelChange = (e: any) => {
    // console.log("handleSortModelChange", e);
    if (e?.length <= 0) return;
    setUserRequestData({ ...userRequestData, sortOrder: e[0]?.sort ?? "", sortField: e[0]?.field ?? "" });
    setSortModel(e);
    localStorage.setItem("userSortModel", JSON.stringify(e)); // Save the sort model
  };

  useEffect(() => {
    setUserRequestData({ ...userRequestData, pageNumber: paginationModel?.page, pageSize: paginationModel?.pageSize, sortOrder: sortModel[0].sort, sortField: sortModel[0].field });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel]);

  // console.log("userData", userData);
  // console.log("userRole", userRole);

  // console.log("userRequestData", userRequestData);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h2">users ({userData?.data?.length ? userData?.data?.length : "0"})</Typography>
      <Paper sx={cardStyles}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: isSmallScreen ? "flex-start" : "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{
              marginRight: "10px",
            }}
            onClick={() => {
              setOpenAddNewUserModel(true);
              dispatch(setAddUserState("new"));
            }}
          >
            Add new user
          </Button>
          <TextField
            placeholder="Search..."
            label={userRequestData?.search_substring ? "Search" : ""}
            variant="standard"
            size="small"
            sx={{
              marginTop: isSmallScreen ? "10px" : "0",
              width: isSmallScreen ? "100%" : "auto",
            }}
            onChange={handleUsersSearchText}
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
        <DataGrid
          loading={isUserDataLoading}
          rows={userFilteredRows ?? []}
          columns={columns}
          getEstimatedRowHeight={() => 100}
          getRowHeight={() => "auto"}
          // slots={{ toolbar: GridToolbar }}
          sx={{
            "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
              py: 1,
            },
            "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
              py: "10px",
            },
            "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
              py: "22px",
            },
            display: "grid",
            "& .MuiDataGrid-cell": {
              border: 1,
              borderRight: 0,
              borderTop: 1,
              borderLeft: 0,
              borderColor: "#E2E9F4",
              whiteSpace: "pre-wrap",
            },
          }}
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
          disableColumnMenu
        />
      </Paper>
    </Box>
  );
}
