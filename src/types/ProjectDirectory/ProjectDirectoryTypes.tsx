export interface ProjectDirectoryRow {
  id: string;
  projectName: string;
  logo: string;
  phoneNumber: string;
  cmms: string;
  cmmsLink?: string;
  sites: string;
  units: string;
  country?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  primaryColorHexCode?: string;
  secondaryColorHexCode?: string;
  demandResponseLink?: string;
  logo_filename?: string;
}

export interface ProjectDirectoryRequestData {
  search_substring?: string;
  pageNumber?: string;
  pageSize?: string;
  sortOrder?: string;
  sortField?: string;
}

export interface AddProject {
  project_id?: string;
  name: string;
  country: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  phone_number: string;
  cmms_name: string;
  cmms_link?: string;
  dr_link?: string;
  primaryColorHexCode: string;
  secondaryColorHexCode: string;
  upload_logo: boolean;
  content_type?: string;
}

export interface AllCountriesAndStates {
  countryName: string;
  states: [SelectedCountriesStates];
  countryCode: string;
}

export interface SelectedCountriesStates {
  name: string;
  state_code: string;
}
