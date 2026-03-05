export interface SuperAdminTableRow {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
}

export interface AddSuperAdmin {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SuperAdminRequestData {
  search_substring?: string;
  pageNumber?: string;
  pageSize?: string;
  sortOrder?: string;
  sortField?: string;
  role?: string;
}
