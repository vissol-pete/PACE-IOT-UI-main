import { useEffect, useState } from "react";
import { Box, Button, InputAdornment, TextField, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";

import { SuperAdminTableRow } from "../../../types";
import { setAddUserState, setSelectedUserId } from "../../../redux/Slice/ProjectDirectory/ProjectDirectorySlice";

export default function SuperAdminUsersTable({
  setOpenSuperAdminModel,
  setOpenDeleteSuperAdminModel,
  superAdminFilteredRows,
  isUserDataLoading,
  setAddSuperAdmin,
  superAdminRequestData,
  setSuperAdminRequestData,
  setPaginationModel,
  paginationModel,
  totalRows,
  userEmail,
}: any) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [sortModel, setSortModel] = useState(() => {
    const savedSortModel = localStorage.getItem("adminSortModel");
    return savedSortModel ? JSON.parse(savedSortModel) : [{field:'first_name',sort:'asc'}];
  });
  const [isInitialRender, setInitialRender] = useState(true)

  useEffect(()=>{
   if(isInitialRender) {
    setInitialRender(false)
   }
  },[isInitialRender])

  const columns: GridColDef<SuperAdminTableRow>[] = [
    {
      field: "first_name",
      headerName: "First Name",
      sortable: true,
      flex: 1,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      flex: 1,
    },
    {
      field: "email_address",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <GridActionsCellItem
            disabled={userEmail === params.row.email_address}
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
            disabled={userEmail === params.row.email_address}
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

  const handleEditClick = (row: any) => {
    // console.log("Row details for edit:", row);
    dispatch(setAddUserState("edit"));
    setAddSuperAdmin({
      id: row?.id,
      firstName: row?.first_name,
      lastName: row?.last_name,
      email: row?.email_address,
    });

    setOpenSuperAdminModel(true);
  };

  const handleDeleteClick = (row: any) => {
    setOpenDeleteSuperAdminModel(true);
    dispatch(setSelectedUserId(row?.id));
    // console.log("Row details for delete:", row);
  };

  const handleSuperAdminSearchText = (e: any) => {
    // console.log("handleSuperAdminSearchText", e.target.value);
    setSuperAdminRequestData({ ...superAdminRequestData, search_substring: e.target.value });
  };

  const handleSortModelChange = (e: any) => {
    // console.log("handleSortModelChange", e);
    if(e?.length<=0) return
    setSuperAdminRequestData({ ...superAdminRequestData, sortOrder: e[0]?.sort ?? "", sortField: e[0]?.field ?? "" });
    setSortModel(e);
    localStorage.setItem("adminSortModel", JSON.stringify(e)); // Save the sort model
  };

  useEffect(() => {
    setSuperAdminRequestData({ ...superAdminRequestData, pageNumber: paginationModel?.page, pageSize: paginationModel?.pageSize, sortOrder: sortModel[0].sort, sortField: sortModel[0].field });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
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
            setOpenSuperAdminModel(true);
            dispatch(setAddUserState("new"));
          }}
        >
          add new user
        </Button>
        <TextField
          placeholder="Search..."
          label={superAdminRequestData?.search_substring ? "Search" : ""}
          variant="standard"
          size="small"
          sx={{
            marginTop: isSmallScreen ? "10px" : "0",
            width: isSmallScreen ? "100%" : "auto",
          }}
          onChange={handleSuperAdminSearchText}
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
        rows={superAdminFilteredRows ?? []}
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
        disableColumnMenu
      />
    </Box>
  );
}
