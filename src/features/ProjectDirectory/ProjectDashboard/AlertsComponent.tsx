import { Box } from "@mui/material";

import { AlertBar } from "../../../components";
import { useState } from "react";

export default function AlertsComponent() {
  const [showDesc1, setShowDesc1] = useState(true);
  const [showDesc2, setShowDesc2] = useState(true);

  return (
    <Box>
      <AlertBar
        severity={"info"}
        title={"6 out of 22 sites are not enrolled in demand response."}
        description={
          "Enrolling your sites in ‘Demand Response’ can help reduce energy costs during peak demand periods and enhance sustainability efforts."
        }
        show={showDesc1}
        setShow={setShowDesc1}
      />
      <Box
        sx={{
          marginTop: "20px",
        }}
      />
      <AlertBar
        severity={"info"}
        title={"Upgrade your project to increase your savings further."}
        description={
          "Subscribe to our in-app upgrade for extra energy savings based on weather forecasts."
        }
        show={showDesc2}
        setShow={setShowDesc2}
      />
      <Box
        sx={{
          marginTop: "20px",
        }}
      />
      <AlertBar
        severity={"error"}
        title={"Demand response event in progress. "}
        description={
          "Demand response is active for one or more sites. You may see reduced energy usage. Contact support if you need assistance."
        }
        isClose={false}
        show={true}
        setShow={undefined}
      />
      <Box
        sx={{
          marginTop: "20px",
        }}
      />
      <AlertBar
        severity={"error"}
        title={"Predictive maintenance suggested."}
        description={
          "One or more units at your site(s) may need preventative maintenance to keep running smoothly. Please check site(s) with active alarms for more details."
        }
        isClose={false}
        show={true}
        setShow={undefined}
      />
    </Box>
  );
}
