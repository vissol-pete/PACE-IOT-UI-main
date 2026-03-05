import { createBrowserRouter } from "react-router-dom";
import Routes from "./Routes";

import ProjectDirectory from "../../pages/ProjectDirectory/ProjectDirectory";
import ProjectDashboard from "../../pages/ProjectDirectory/ProjectDashboard/ProjectDashboard";
import SuperAdmin from "../../pages/ProjectDirectory/SuperAdmin/SuperAdmin";
import SiteDashboard from "../../pages/ProjectDirectory/ProjectDashboard/SiteDashboard/SiteDashboard";
import UnitDashboard from "../../pages/ProjectDirectory/ProjectDashboard/UnitDashboard/UnitDashboard";
import FrequentlyAskedQuestions from "../../pages/FrequentlyAskedQuestions/FrequentlyAskedQuestions";
import Subscriptions from "../../pages/Subscriptions/Subscriptions";
import ContactUs from "../../pages/ContactUs/ContactUs";
import Alerts from "../../pages/Alerts/Alerts";
import Settings from "../../pages/Settings/Settings";
import Terms from "../../pages/Terms/Terms";
import Privacy from "../../pages/Privacy/Privacy";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Routes />,
    children: [
      {
        path: "",
        element: <ProjectDirectory />,
      },
      {
        path: "project-directory/project-dashboard/:projectName/:projectId",
        element: <ProjectDashboard />,
      },
      {
        path: "project-directory/super-admin",
        element: <SuperAdmin />,
      },
      {
        path: "project-directory/project-dashboard/site-dashboard/:projectName/:projectId/:siteName/:siteId",
        element: <SiteDashboard />,
      },
      {
        path: "project-directory/project-dashboard/site-dashboard/unit-dashboard/:projectName/:projectId/:siteName/:siteId/:unitName/:unitId",
        element: <UnitDashboard />,
      },
      {
        path: "upgrades/:message?/:siteId?",
        element: <Subscriptions />,
      },
      {
        path: "faq",
        element: <FrequentlyAskedQuestions />,
      },
      {
        path: "contact-us",
        element: <ContactUs />,
      },
      {
        path: "alerts",
        element: <Alerts />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      }
    ],
  },
]);
