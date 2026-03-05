import { Outlet } from "react-router-dom";

import { SideNavDrawer } from "../../features";
import ScrollToTop from "../../utils/ScrollToTop";

export default function Routes() {
  return (
    <SideNavDrawer>
      <ScrollToTop />
      <Outlet />
    </SideNavDrawer>
  );
}
