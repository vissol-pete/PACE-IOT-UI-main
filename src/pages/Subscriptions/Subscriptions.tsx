import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";
import UpgradesDashboard from "../../features/Upgrades/UpgradesDashboard";

import { setBreadcrumbText, setHeaderText } from "../../redux/Slice/Navigation/NavigationSlice";

export default function Subscriptions() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadcrumbText(["Upgrades"]));
    dispatch(setHeaderText("Upgrades"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <UpgradesDashboard />
    </>
  );
}
