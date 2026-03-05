export type SiteDashboardData = {
  project_data: {
    project_name: string;
    logo_filename: string;
    logo_url: string;
    project_id?: string;
  };
  site_data: {
    site_id: number;
    site_name: string;
    address_line1: string;
    address_line2: string | null;
    total_units: number;
    country?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
  energy_savings_data: {
    monthly_usage: {
      [year: string]: {
        JAN: number;
        FEB: number;
        MAR: number;
        APR: number;
        MAY: number;
        JUN: number;
        JUL: number;
        AUG: number;
        SEP: number;
        OCT: number;
        NOV: number;
        DEC: number;
      };
    };
    total_savings: number;
    carbon_reduction_savings: number;
  };
  active_alerts_data: {
    active_alerts: number;
    monthly_alerts: {
      JAN: number;
      FEB: number;
      MAR: number;
      APR: number;
      MAY: number;
      JUN: number;
      JUL: number;
      AUG: number;
      SEP: number;
      OCT: number;
      NOV: number;
      DEC: number;
    };
    cmms_name: string;
    cmms_link: string;
  };
  electric_demand_last_15_min: number;
  dr_event_enrolled: boolean;
  download_operations_report: string;
};

export type AlertsChartData = {
  options: {
    chart: {
      id: string;
      toolbar: any;
    };
    xaxis: {
      categories: string[];
      title: {
        text?: string;
      };
      labels: {
        style: any;
      };
    };
    yaxis: {
      title: {
        text: string;
        style: any;
      };
      labels: {
        style: any;
      };
    };
    colors: string[];
    dataLabels: {
      enabled: boolean;
    };
  };
  series: {
    name: string;
    data: number[];
  }[];
};
