import { useEffect, useState } from "react";
import { Box, Card, CardContent } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { InfoFooter } from "../../../features";

import { SuperAdminUsersTable, AddNewSuperAdminModel, DeleteSuperAdminModel } from "../../../features";
import { selectUserRole, selectUserEmail } from "../../../redux/Slice/Authentication/AuthenticationSlice";
import { fetchSearchedSuperAdmin } from "../../../services/apis";
import { SuperAdminTableRow, AddSuperAdmin, SuperAdminRequestData } from "../../../types";
import { AlertBar } from "../../../components";
import { setBreadcrumbText, setHeaderText } from "../../../redux/Slice/Navigation/NavigationSlice";

export default function SuperAdmin() {
  const userRole = useSelector(selectUserRole);
  const userEmail = useSelector(selectUserEmail);
  const dispatch = useDispatch();
  const [openSuperAdminModel, setOpenSuperAdminModel] = useState(false);
  const [openDeleteSuperAdminModel, setOpenDeleteSuperAdminModel] = useState(false);
  const [enableFetchUserData, setEnableFetchUserData] = useState(false);
  const [superAdminFilteredRows, setSuperAdminFilteredRows] = useState<SuperAdminTableRow[]>([]);
  const [addSuperAdmin, setAddSuperAdmin] = useState<AddSuperAdmin>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [alertState, setAlertState] = useState({
    isAlert: false,
    severity: "",
    title: "",
    description: "",
    resetOpen: false,
  });
  const [superAdminRequestData, setSuperAdminRequestData] = useState<SuperAdminRequestData>({
    search_substring: "",
    pageNumber: "0",
    pageSize: "10",
    sortOrder: "asc",
    sortField: "first_name",
    role: "SUPERADMIN",
  });
  const [paginationModel, setPaginationModel] = useState<any>(() => {
    const savedPaginationModel = localStorage.getItem("adminPaginationModel");
    return savedPaginationModel ? JSON.parse(savedPaginationModel) : {
      page: 0,
      pageSize: 10,
    };
  });
  useEffect(()=>{
   localStorage.setItem('adminPaginationModel',JSON.stringify(paginationModel))
  },[paginationModel])

  const [totalRows, setTotalRows] = useState(10);

  useEffect(() => {
    dispatch(setBreadcrumbText(["Project directory", "PACE Super Admins"]));
    dispatch(setHeaderText("PACE Super Admins"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setShowAlert = (show: boolean) => {
    setAlertState({ ...alertState, isAlert: show });
  };

  useEffect(() => {
    if (userRole === "SUPERADMIN") setEnableFetchUserData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  useEffect(() => {
    setEnableFetchUserData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [superAdminRequestData]);

  // const { data: userData, isLoading: isUserDataLoading } = useQuery({
  //   queryKey: ["superAdminData", { role: userRole }],
  //   queryFn: fetchSuperAdminData,
  //   enabled: enableFetchUserData,
  // });

  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["superAdminData", { superAdminRequestData }],
    queryFn: fetchSearchedSuperAdmin,
    enabled: enableFetchUserData,
  });

  useEffect(() => {
    if (userData !== null && userData !== undefined) {
      setEnableFetchUserData(false);
      const updatedData: SuperAdminTableRow[] = [];
      for (const i in userData?.data) {
        const itemSub = userData?.data[i];
        const { id, first_name, last_name, email_address } = itemSub.dynamodb_data;
        const sortedItem: SuperAdminTableRow = {
          id: id === "" ? "" : id,
          first_name: first_name === "" ? "-" : first_name,
          last_name: last_name === "" ? "-" : last_name,
          email_address: email_address === "" ? "-" : email_address,
        };

        updatedData.push(sortedItem);
      }
      setSuperAdminFilteredRows(updatedData);
      setTotalRows(userData?.total_count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  // console.log("enableFetchUserData", enableFetchUserData);
  // console.log("userData", userData);
  // console.log("addSuperAdmin", addSuperAdmin);
  // console.log("superAdminRequestData", superAdminRequestData);
  return (
    <Box sx={{ minHeight: "92vh", display: "flex", flexDirection: "column" }}>
      <Box>
        {alertState.isAlert && (
          <AlertBar
            severity={alertState.severity}
            title={alertState.title}
            description={alertState.description}
            show={alertState.isAlert}
            setShow={setShowAlert}
          />
        )}
        <Card sx={{ marginTop: "16px", marginBottom: "16px", marginLeft: "24px", marginRight: "24px", padding: "16px" }}>
          <CardContent sx={{ padding: "0px" }}>
            <AddNewSuperAdminModel
              openSuperAdminModel={openSuperAdminModel}
              setOpenSuperAdminModel={setOpenSuperAdminModel}
              addSuperAdmin={addSuperAdmin}
              setAddSuperAdmin={setAddSuperAdmin}
              setAlertState={setAlertState}
              setEnableFetchUserData={setEnableFetchUserData}
            />
            <DeleteSuperAdminModel
              openDeleteSuperAdminModel={openDeleteSuperAdminModel}
              setOpenDeleteSuperAdminModel={setOpenDeleteSuperAdminModel}
              setEnableFetchUserData={setEnableFetchUserData}
              setAlertState={setAlertState}
            />
            <SuperAdminUsersTable
              setOpenSuperAdminModel={setOpenSuperAdminModel}
              setOpenDeleteSuperAdminModel={setOpenDeleteSuperAdminModel}
              superAdminFilteredRows={superAdminFilteredRows}
              isUserDataLoading={isUserDataLoading}
              setAddSuperAdmin={setAddSuperAdmin}
              superAdminRequestData={superAdminRequestData}
              setSuperAdminRequestData={setSuperAdminRequestData}
              setPaginationModel={setPaginationModel}
              paginationModel={paginationModel}
              totalRows={totalRows}
              userEmail={userEmail}
            />
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ mt: "auto", width: "100%" }}>
        <InfoFooter />
      </Box>
    </Box>
  );
}
