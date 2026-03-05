import React from "react";
import { Box } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import HeroHeader from "./HeroHeader";
import PricingTier from "./PricingTier";
import PartnerUpgrades from "./PartnerUpgrades";
import { AlertBar } from "../../components";
import InfoFooter from "../ProjectDirectory/ProjectDashboard/InfoFooter";
import { Typography } from "@mui/material";

const UpgradesDashboard: React.FC = () => {
  const { message, siteId } = useParams<{ message?: string; siteId?: string }>();
  const [showAlert, setShowAlert] = React.useState(message === "success");

  return (
    <Box>
      <Box sx={{ marginTop: "35px" }}></Box>
      <HeroHeader />

      <Box sx={{ padding: "24px" }}>
        {message === "success" && siteId && (
          <Box sx={{ mb: 2 }}>
            <AlertBar
              severity="success"
              description="PACE AI Cloud Portal successfully upgraded to the Premium tier"
              setShow={setShowAlert}
              show={showAlert}
            />
          </Box>
        )}
        <PricingTier siteId={siteId} />
        <PartnerUpgrades />
      </Box>
      <Box sx={{ mt: "auto", width: "100%" }}>
        <InfoFooter />
      </Box>
    </Box>
  );
};

export default UpgradesDashboard;
