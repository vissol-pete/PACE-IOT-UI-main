import axios from "axios";
import { UpdateUnitType } from "../types/UnitDirectory/UnitDirectoryTypes";
import { AlertConfigResponse, AlertsState, AlertStatsParams } from "../types/Alerts/AlertTypes";
import { SubscriptionParams } from "../types/Upgrades/upgrades";
// Set global Axios defaults
//axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT;
// axios.defaults.headers.post["Content-Type"] = "application/json";

// const alertsUrl = "https://xchf9hbw7k.execute-api.us-east-1.amazonaws.com/dev-PaceAI";
// const siteUrl = "https://q550qvn3lg.execute-api.us-east-1.amazonaws.com/dev-PaceAI";
// const unitsDataUrl = "https://q550qvn3lg.execute-api.us-east-1.amazonaws.com/dev-PaceAI";
// Replace the hardcoded legacy URLs with the dynamic Amplify endpoint
// import awsconfig from "../aws-exports"; // Adjust path as needed
// Amplify stores the API gateway URL here automatically
//const apiBase = awsconfig.aws_cloud_logic_custom[0].endpoint; 
// Pull the env variable you just set in Amplify
const apiBase = process.env.REACT_APP_API_ENDPOINT || "https://fallback-url.com";
axios.defaults.baseURL = apiBase;
axios.defaults.timeout = 10000; // 10 seconds
const siteUrl = apiBase;
const unitsDataUrl = apiBase;// Use the Amplify-provided endpoint instead
//axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT;
// ---------------------------------------------------Project Directory---------------------------------------------------
export const fetchAllProjects = async () => {
  return (await axios.get(`projects/get_projects?page_number=1&page_size=10&sort_order=desc&sort_field=projectName`)).data;
};

export const fetchSearchedAllProjects = async (data: any) => {
  const name = data?.queryKey[1]?.projectDirectoryRequestData?.search_substring;
  const nextPage = Number(data?.queryKey[1]?.projectDirectoryRequestData?.pageNumber || 0) + 1;
  const page_size = data?.queryKey[1]?.projectDirectoryRequestData?.pageSize;
  const sort_order = data?.queryKey[1]?.projectDirectoryRequestData?.sortOrder;
  const sort_field = data?.queryKey[1]?.projectDirectoryRequestData?.sortField;

  return (
    await axios.get(
      `/projects/search_project?name=${name}&page_number=${nextPage}&page_size=${page_size}&sort_order=${sort_order}&sort_field=${sort_field}`
    )
  ).data;
};

export const fetchAllCountriesAndStates = async () => {
  return (await axios.get(`https://countriesnow.space/api/v0.1/countries/states`)).data;
};

export const createNewProject = async (data: any) => {
  // console.log("data in submit", data);
  return (await axios.post(`projects/add_project`, data)).data;
};

export const editProject = async (data: any) => {
  // console.log("edit data in submit", data);
  return (await axios.put(`${siteUrl}/projects/update_project`, data)).data;
};

export const deleteProject = async (data: any) => {
  console.log("edit data in submit", data);
  return (await axios.delete(`projects/delete_project?project_id=${data}`)).data;
};

export const uploadLogo = async (data: any) => {
  // console.log("uploadLogo data in submit", data);
  await fetch(data.url, {
    method: "PUT",
    headers: {
      "Content-Type": "",
    },
    body: data.file,
  });
};
// ---------------------------------------------------Project Dashboard---------------------------------------------------

export const fetchAllSites = async (data: any) => {
  // console.log("data in submit", data);
  const project_id = data?.queryKey[1]?.projectId;
  return (await axios.get(`sites/get_sites?&project_id=${project_id}`)).data;
};

export const fetchProjectDashboardKPICardData = async (data: any) => {
  // console.log("data in submit", data);
  const project_id = data?.queryKey[1]?.projectId;
  const energy_type = data?.queryKey[1]?.energyType;

  return (await axios.get(`${siteUrl}/projects/project_dashboard?project_id=${project_id}&energy_type=${energy_type}`)).data;
};

export const fetchSearchedAllSites = async (data: any) => {
  // console.log("data in submit", data);
  const name = data?.queryKey[1]?.projectDashboardRequestData?.search_substring;
  const nextPage = data?.queryKey[1]?.projectDashboardRequestData?.pageNumber + 1;
  const page_size = data?.queryKey[1]?.projectDashboardRequestData?.pageSize;
  const project_id = data?.queryKey[1]?.projectDashboardRequestData?.projectId;
  const sort_order =
    data?.queryKey[1]?.projectDashboardRequestData?.sortOrder === "" ? "asc" : data?.queryKey[1]?.projectDashboardRequestData?.sortOrder;
  const sort_field =
    data?.queryKey[1]?.projectDashboardRequestData?.sortField === "" ? "name" : data?.queryKey[1]?.projectDashboardRequestData?.sortField;

  return (
    await axios.get(
      `${siteUrl}/sites/search_site?name=${name}&page_number=${nextPage}&page_size=${page_size}&sort_order=${sort_order}&sort_field=${sort_field}&project_id=${project_id}`
    )
  ).data;
};

export const createNewSite = async (data: any) => {
  console.log("data in submit", data);
  return (await axios.post(`sites/add_site`, data)).data;
};

export const editSite = async (data: any) => {
  console.log("data in submit", data);
  return (await axios.put(`${siteUrl}/sites/update_site`, data)).data;
};

export const deleteSite = async (data: any) => {
  console.log("delete Site in submit", data);
  return (await axios.delete(`sites/delete_site?site_id=${data}`)).data;
};

// ---------------------------------------------------Site Dashboard---------------------------------------------------

export const fetchSiteDashboardData = async ({ queryKey }: { queryKey: any }) => {
  const [, { siteId, energyType }] = queryKey;
  const response = await axios.get(`${siteUrl}/sites/site_dashboard?site_id=${siteId}&energy_type=${energyType}`);
  return response.data;
};

export const fetchUnitsData = async ({ queryKey }: { queryKey: any }) => {
  // console.log("data in submit fetchUnitsData", queryKey);
  const unit_name = queryKey[1]?.siteUnitsRequestData?.search_substring;
  const page_number = queryKey[1]?.siteUnitsRequestData?.pageNumber + 1;
  const page_size = queryKey[1]?.siteUnitsRequestData?.pageSize;
  const site_id = queryKey[1]?.siteUnitsRequestData?.site_Id;
  const sort_order = queryKey[1]?.siteUnitsRequestData?.sortOrder;
  const sort_field = queryKey[1]?.siteUnitsRequestData?.sortField;

  const response = await axios.get(
    `${unitsDataUrl}/units/search_unit?page_number=${page_number}&page_size=${page_size}&sort_order=${sort_order}&sort_field=${sort_field}&site_id=${site_id}&unit_name=${unit_name}`
  );
  return response.data;
};

export const createNewUnit = async (data: any) => {
  // console.log("data in submit", data);
  return (await axios.post(`units/add_unit`, data)).data;
};

export const editUnit = async (data: any) => {
  return (await axios.put(`${siteUrl}/units/update_unit`, data)).data;
};

export const deleteUnit = async (data: any) => {
  // console.log("delete Unit in submit", data);
  return (await axios.delete(`units/delete_unit?unit_id=${data}`)).data;
};

export const fetchFirmwareList = async () => {
  const response = await axios.get(`ota/firmware-list`);
  return response.data;
};

export const deployGreengrass = async () => {
  const response = await axios.post(`ota/greengrass-deployment`);
  return response.data;
};

export const deployFirmwareUpdate = async (data: any) => {
  console.log("data", data);
  const response = await axios.post(`ota/firmware-deployment`, data);
  return response.data;
};

export const bypassRebootOnline = async (data: any) => {
  console.log("data", data);
  const response = await axios.post(`ota/command-control-deployment`, data);
  return response.data;
};
// ---------------------------------------------------Unit Dashboard---------------------------------------------------
export const fetchUnitDashboardData = async ({ queryKey }: { queryKey: any }) => {
  const [, { unitId }] = queryKey;
  const response = await axios.get(`units/unit_dashboard?unit_id=${unitId}`);
  return response.data;
};

export const fetchDeviceList = async ({ queryKey }: { queryKey: any }) => {
  const [, { siteId }] = queryKey;
  const response = await axios.get(`units/get_devices?site_id=${siteId}`);
  return response.data;
};

export const updateUnitData = async (data: UpdateUnitType) => {
  console.log("Updating unit data with payload:", data);

  // Map existing keys to new keys and keep other data intact
  let formatted = {
    ...data,
    hvac_serial_num: data.unit_serial_num,
    hvac_model_number: data.unit_model_number,
    hvac_make: data.unit_brand,
  };

  // Delete the original keys that are no longer needed
  delete formatted.unit_serial_num;
  delete formatted.unit_model_number;
  delete formatted.unit_brand;

  // Send the formatted object in the API request
  const response = await axios.put(`units/update_unit`, formatted);
  return response.data;
};

export const getAlertConfig = async (unitId: number) => {
  const response = await axios.get(`alerts/${unitId}/get_alert_config`);
  return response.data;
};

export const editAlertConfig = async (data: AlertConfigResponse) => {
  console.log(data);
  const { unit_id, ...requestData } = data; // Destructure to remove unit_id from the request body
  console.log(unit_id);
  const response = await axios.post(`alerts/${unit_id}/edit_alert_config`, requestData);
  return response.data;
};

// ---------------------------------------------------User Management---------------------------------------------------

export const fetchSearchedSuperAdmin = async (data: any) => {
  // console.log("data in submit", data);
  const keyword = data?.queryKey[1]?.superAdminRequestData?.search_substring;
  const nextPage = data?.queryKey[1]?.superAdminRequestData?.pageNumber + 1;
  const page_size = data?.queryKey[1]?.superAdminRequestData?.pageSize;
  const sort_order = data?.queryKey[1]?.superAdminRequestData?.sortOrder;
  const sort_field = data?.queryKey[1]?.superAdminRequestData?.sortField;
  const role = data?.queryKey[1]?.superAdminRequestData?.role;
  // const project_id = data?.queryKey[1]?.superAdminRequestData?.role === "SUPERADMIN" ? "" : "";

  return (
    await axios.get(
      `user/get_user?role=${role}&keyword=${keyword}&page_number=${nextPage}&page_size=${page_size}&sort_order=${sort_order}&sort_field=${sort_field}`
    )
  ).data;
};

export const fetchSearchedUsers = async (data: any) => {
  // console.log("data in submit", data);
  const keyword = data?.queryKey[1]?.userRequestData?.search_substring;
  const nextPage = data?.queryKey[1]?.userRequestData?.pageNumber + 1;
  const page_size = data?.queryKey[1]?.userRequestData?.pageSize;
  const sort_order = data?.queryKey[1]?.userRequestData?.sortOrder;
  const sort_field = data?.queryKey[1]?.userRequestData?.sortField;
  const role = data?.queryKey[1]?.role;
  const project_id = data?.queryKey[1]?.userRequestData?.projectID;

  return (
    await axios.get(
      `user/get_user?role=${role}&project_id=${project_id}&keyword=${keyword}&page_number=${nextPage}&page_size=${page_size}&sort_order=${sort_order}&sort_field=${sort_field}`
    )
  ).data;
};

export const fetchSuperAdminData = async (data: any) => {
  // console.log("data in submit", data.queryKey[1]);
  const role = data?.queryKey[1].role;
  return (await axios.get(`user/get_user?role=${role}`)).data;
};

export const createNewUser = async (data: any) => {
  // console.log("data in submit", data);
  return (await axios.post(`user/create_user`, data)).data;
};

export const editUser = async (data: any) => {
  console.log("data in submit", data);
  let userData = {};
  if (data.role === "ADMIN") {
    userData = {
      first_name: data?.first_name,
      last_name: data?.last_name,
      email_address: data?.email_address,
      role: data.role,
      project_id: data?.project_id,
      site_ids: "all_sites",
    };
  } else if (data.role === "TECHNICIAN") {
    userData = {
      first_name: data?.first_name,
      last_name: data?.last_name,
      email_address: data?.email_address,
      site_ids: data?.site_ids,
      role: data.role,
      project_id: data?.project_id,
    };
  } else {
    userData = {
      first_name: data?.first_name,
      last_name: data?.last_name,
      email_address: data?.email_address,
      role: "SUPERADMIN",
    };
  }
  return (await axios.put(`user/edit_user?user_id=${data.user_id}`, userData)).data;
};

export const deleteUser = async (data: any) => {
  // console.log("data in submit", data);
  return (await axios.delete(`user/delete_user?user_id=${data}`)).data;
};

export const fetchUserData = async (data: any) => {
  // console.log("data in submit", data.queryKey[1]);
  const role = data?.queryKey[1].role;
  const project_id = data?.queryKey[1].project_id;

  return (await axios.get(`user/get_user?role=${role}&project_id=${project_id}`)).data;
};

export const checkUserExist = async (data: any) => {
  // console.log("data in submit", data);
  const email = data?.queryKey[1].email;
  return (await axios.get(`user/get_user?email_address=${email}`)).data;
};

// ---------------------------------------------------Frequently Asked Questions---------------------------------------------------
export const fetchGeneralSchematicsFile = async () => {
  return (await axios.get(`/faq?flag=general_schematics`)).data;
};

export const fetchQuickStartNotesFile = async () => {
  return (await axios.get(`/faq?flag=quick_start_notes`)).data;
};

// ---------------------------------------------Contact Us---------------------------------------------------------
export const submitContactUsForm = async (data: any) => {
  return (await axios.post(`contact-us`, data)).data;
};

// ---------------------------------------------Subscriptions---------------------------------------------------------

export const submitSubscription = async (params: SubscriptionParams) => {
  try {
    const response = await axios.post(
      // Todo: update the URL to universal
      `https://4ju6bgst01.execute-api.us-east-1.amazonaws.com/dev-PaceAI/mobilize_integration/create_subscriptions`,
      JSON.stringify(params), // Convert params to JSON string
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 0, // Optional: Sets no timeout as in the Postman example
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in submitSubscription:", error);
    throw error; // Re-throw the error to handle it in `handleSelectTier`
  }
};

// ---------------------------------------------Alerts and Notifications---------------------------------------------------------
export const fetchAlerts = async (): Promise<AlertsState> => {
  const response = await axios.get(`alerts/get_active_alerts`);
  return response.data;
};

export const fetchAlertStats = async (params: AlertStatsParams) => {
  const response = await axios.get(`alerts/get_stats/${params.field}/${params.id}`);
  return response.data;
};
