import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent, Divider, FormControl, InputLabel, Select, MenuItem, CircularProgress,Link } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "@mui/material/styles";
import { fetchSearchedAllProjects, submitSubscription } from "../../services/apis";
import { loadStripe } from "@stripe/stripe-js";
import { AlertBar } from "../../components";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY as string);

const basicCloudTitle = "BASIC CLOUD SERVICES";
const basicCloudDescription = "The Basic Cloud tier is the foundation of our \nservice and comes with everything you need to \nstart saving.";
const basicCloudPurchased = "INCLUDED";
const basicCloudFeatures = ["Energy optimization", "Demand reduction", "Basic fault detection/monitoring"];

const pacePremiumTitle = "PACE AI PREMIUM";
const pacePremiumPrice = "$1000";
const pacePremiumSubtitle = "Lifetime service with one purchase!";
const pacePremiumContact = "Contact sales";
const pacePremiumBenefits = [
  {
    title: "Predictive weather services",
    description: "Adjust building temps based on weather predictions to avoid peak demand costs",
  },
  {
    title: "Historical weather services",
    description: "Gain insights with historical utility bill data, weather data, and efficiency reports",
  },
];
const pacePremiumFooter = "Everything in the Basic Cloud Services tier, plus:";

interface PricingTierProps {
  siteId?: string | undefined;
}

const PricingTier: React.FC<PricingTierProps> = ({ siteId }) => {
  const theme = useTheme();
  const [stripeSession, setStripeSession] = useState("");
  const [currentProject, setCurrentProject] = useState("");
  const [allProjects, setAllProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const email = useSelector((state: RootState) => state.authentication.email);
  const [subscribed, setSubscribed] = useState<string[]>([]);
  const [buttonText, setButtonText] = useState("SELECT TIER");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const cardContainerStyle = {
    maxWidth: "369px",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    padding: "10px",
  };

  console.log("siteId", siteId);

  // Check if the selected project is already subscribed based on url
  useEffect(() => {
    if (siteId) {
      setCurrentProject(siteId);
    }
  }, [siteId]);

  useEffect(() => {
    // Check if the selected project matches siteId to update button state and text
    if (siteId && currentProject === siteId) {
      setButtonText("PURCHASED");
      setIsButtonDisabled(true);
    } else {
      setButtonText("SELECT TIER");
      setIsButtonDisabled(false);
    }
  }, [currentProject, siteId]);

  useEffect(() => {
    const loadAllProjects = async () => {
      setIsLoadingProjects(true);
      const allProjectsList: string[] = [];
      const subProjectList: string[] = [];
      let pageNumber = 0;
      const pageSize = 50; // Fetch 50 results per page
      let hasMore = true;

      try {
        while (hasMore) {
          const projectDirectoryRequestData = {
            search_substring: "",
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
            sortOrder: "asc",
            sortField: "projectName",
          };

          const response = await fetchSearchedAllProjects({ queryKey: ["allProjects", { projectDirectoryRequestData }] });
          const fetchedProjects = response?.data || [];
          allProjectsList.push(...fetchedProjects.map((project: { name: string }) => project.name));
          subProjectList.push(
            ...fetchedProjects.filter((project: { is_subscribed: boolean }) => !project.is_subscribed).map((project: { name: string }) => project.name)
          );
          // Check if there are more pages
          hasMore = fetchedProjects.length === pageSize;
          pageNumber += 1;
        }
        setAllProjects(allProjectsList);
        setSubscribed(subProjectList);
      } catch (error) {
        console.error("Error fetching all projects:", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadAllProjects();
  }, []);

  // Handle selection of premium tier, start Stripe checkout session
  const handleSelectTier = async () => {
    setLoading(true);
    setError("");
    setShowError(false);

    try {
      const response = await submitSubscription({
        email,
        projectName: currentProject,
        successUrl: `${window.location.origin}/upgrades/success/${encodeURIComponent(currentProject)}`,
        cancelUrl: `${window.location.origin}/upgrades`,
      });

      if (response) {
        setStripeSession(response.sessionId);
      }
    } catch (error) {
      console.error("Error in subscription:", error);
      setError("There was an issue starting the subscription. Please try again.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to Stripe Checkout if session is available
  useEffect(() => {
    const redirectToCheckout = async () => {
      const stripe = await stripePromise;
      if (stripe && stripeSession) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: stripeSession,
        });
        if (error) {
          console.error("Error redirecting to checkout:", error.message);
          setError("There was an error redirecting to checkout. Please try again.");
        }
      }
    };

    if (stripeSession !== "") {
      redirectToCheckout();
    }
  }, [stripeSession]);

  return (
    <>
      <AlertBar severity="error" title={error} description={""} show={showError} setShow={setShowError} />
      <Typography variant="h2">Pace AI Cloud Portal Tiers</Typography>

      <Box sx={{ width: "100%", maxWidth: 466, marginTop: 2 }}>
        <Typography variant="body1" gutterBottom>
          Please select a project first to view the available upgrade tiers.
        </Typography>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="project-select-label">Select project</InputLabel>
          <Select
            labelId="project-select-label"
            id="project-select"
            value={currentProject}
            onChange={(event) => setCurrentProject(event.target.value)}
            label="Select project"
            disabled={isLoadingProjects}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: "196px", // Set maximum height for the dropdown
                  mt: 1, // Add a small margin from the select
                  overflowY: "auto", // Ensure scrolling within the max height
                },
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
            }}
          >
            <MenuItem value="">Select a project</MenuItem>
            {isLoadingProjects ? (
              <MenuItem disabled>Loading projects...</MenuItem>
            ) : (
              subscribed.map((project, index) => (
                <MenuItem key={index} value={project}>
                  {project}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Box>
      {currentProject && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: { xs: "column", sm: "row" },
            gap: "24px",
            marginTop: "24px",
          }}
        >
          {/* Basic Cloud Services Card */}
          <Card sx={cardContainerStyle}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {basicCloudTitle}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ whiteSpace: "pre-line" }}>
                {basicCloudDescription}
              </Typography>

              <Button
                variant="contained"
                disabled
                sx={{
                  backgroundColor: "#000",
                  color: "#757575",
                  width: "100%",
                  marginTop: "24px",
                  "&.Mui-disabled": {
                    backgroundColor: "#fff",
                    color: "rgba(0, 0, 0, 0.38)",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                {basicCloudPurchased}
              </Button>

              <Typography variant="body1" fontWeight="bold" sx={{ marginTop: "16px" }}>
                Features
              </Typography>

              <Box sx={{ marginTop: "8px" }}>
                {basicCloudFeatures.map((feature, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", marginTop: index === 0 ? 0 : "8px" }}>
                    <CheckCircleIcon sx={{ marginRight: "8px", color: `${theme.palette.primary.light} !important` }} />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Pace AI Premium Card */}
          <Card sx={cardContainerStyle}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {pacePremiumTitle}
              </Typography>
              <Typography variant="h1" color="primary" fontWeight="bold" gutterBottom>
                {pacePremiumPrice}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {pacePremiumSubtitle}
              </Typography>

              <Button
                onClick={handleSelectTier}
                variant="contained"
                sx={{
                  backgroundColor: "#26378C",
                  color: "#fff",
                  width: "100%",
                  marginTop: "16px",
                }}
                disabled={isButtonDisabled}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
              </Button>

              <Typography  onClick={()=>{navigate('/contact-us')}} variant="body1" color="textSecondary" sx={{ marginTop: "8px", textAlign: "center", textDecoration: "underline", fontSize:"16px", cursor: 'pointer' }}>
              {pacePremiumContact}
              </Typography>

              <Divider sx={{ marginY: "16px" }} />

              <Typography variant="body1" gutterBottom>
                {pacePremiumFooter}
              </Typography>

              <Box sx={{ marginTop: "8px" }}>
                {pacePremiumBenefits.map((benefit, index) => (
                  <Box key={index} sx={{ marginBottom: "16px", marginTop: "10px" }}>
                    <Typography variant="body1" fontWeight="bold">
                      {benefit.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "flex-start", marginTop: "8px" }}>
                      <CheckCircleIcon sx={{ marginRight: "8px", color: `${theme.palette.primary.light} !important` }} />
                      <Typography variant="body2">{benefit.description}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
};

export default PricingTier;
