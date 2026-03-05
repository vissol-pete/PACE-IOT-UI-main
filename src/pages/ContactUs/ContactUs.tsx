import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useDispatch } from "react-redux";

import { setBreadcrumbText, setHeaderText } from "../../redux/Slice/Navigation/NavigationSlice";
import { MessageCard, ImmediateContactUsCard } from "../../features";
import { AlertBar } from "../../components";
import { InfoFooter } from "../../features";

export default function ContactUs() {
  const dispatch = useDispatch();
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    dispatch(setBreadcrumbText(["Contact us"]));
    dispatch(setHeaderText("Contact us"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ minHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ padding: "24px" }}>
        {description ? <AlertBar severity={severity} description={description} show={showAlert} setShow={setShowAlert} /> : <></>}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MessageCard setSeverity={setSeverity} setDescription={setDescription} setShowAlert={setShowAlert} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ImmediateContactUsCard />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: "auto", width: "100%" }}>
        <InfoFooter />
      </Box>
    </Box >
  );
}
