import React, { useEffect } from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { useDispatch } from "react-redux";
import { setBreadcrumbText, setHeaderText } from "../../redux/Slice/Navigation/NavigationSlice";
import InfoFooter from "../../features/ProjectDirectory/ProjectDashboard/InfoFooter";
import { useLocation } from "react-router-dom";

const listContainer = {
  listStyleType: "disc",
  pl: 2,
  paddingTop: 0,
};

const listItem = {
  display: "list-item",
  listStyleType: "disc",
  padding: 0,
  margin: 0,
};

const effectiveDate = "10/10/24";
const introductionText =
  "Welcome to PACE AI Cloud Portal. By accessing or using our services, you agree to comply with and be bound by the following Terms of Service. If you do not agree with these terms, please do not use our services.";
const termsSections = [
  {
    title: "1. ACCEPTANCE OF TERMS",
    content:
      "By using our services, you confirm that you are at least 18 years old and have the legal capacity to enter into these Terms of Service.",
  },
  {
    title: "2. SERVICES PROVIDED",
    content:
      "We provide [describe your services briefly, e.g., 'cloud storage solutions, data management tools, etc.']. The specific features and pricing can be found on our website.",
  },
  {
    title: "3. USER RESPONSIBILITIES",
    content: (
      <List sx={listContainer}>
        <ListItem sx={listItem}>You agree to use our services only for lawful purposes.</ListItem>
        <ListItem sx={listItem}>You are responsible for maintaining the confidentiality of your account information.</ListItem>
        <ListItem sx={listItem}>You must notify us immediately of any unauthorized use of your account.</ListItem>
      </List>
    ),
  },
  {
    title: "4. PAYMENT AND FEES",
    content: (
      <List sx={listContainer}>
        <ListItem sx={listItem}>Payments are processed through Stripe.</ListItem>
        <ListItem sx={listItem}>All fees are non-refundable unless specified otherwise.</ListItem>
        <ListItem sx={listItem}>
          If you choose a subscription service, you agree to provide accurate billing information and authorize us to charge your payment method.
        </ListItem>
      </List>
    ),
  },
  {
    title: "5. TERMINATION",
    content:
      "We reserve the right to suspend or terminate your account if you violate these Terms of Service. You may cancel your account at any time, but you will not receive a refund for any fees already paid.",
  },
  {
    title: "6. INTELLECTUAL PROPERTY",
    content:
      "All content, trademarks, and other intellectual property associated with our services are owned by PACE AI Cloud Portal. You may not use, reproduce, or distribute any content without our express written permission.",
  },
  {
    title: "7. LIMITATION OF LIABILITY",
    content:
      "To the fullest extent permitted by law, [Your Company Name] will not be liable for any direct, indirect, incidental, or consequential damages arising from your use of our services.",
  },
  {
    title: "8. CHANGES TO TERMS",
    content:
      "We may update these Terms of Service from time to time. We will notify you of any changes by posting the new Terms on our website. Your continued use of our services after such changes will constitute your acceptance of the new Terms.",
  },
  {
    title: "9. GOVERNING LAW",
    content:
      "These Terms of Service are governed by the laws of the United States. Any disputes arising from these Terms will be resolved in the courts of [Your Jurisdiction].",
  },
  {
    title: "10. CONTACT US",
    content: (
      <Box>
        <Typography>If you have any questions about these Terms of Service, please contact us at:</Typography>
        <Typography>Email: [Your Email Address]</Typography>
        <Typography>Phone: [Your Phone Number]</Typography>
        <Typography>Address: [Your Company Address]</Typography>
      </Box>
    ),
  },
];

const Terms: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    dispatch(setBreadcrumbText(["Terms of service"]));
    dispatch(setHeaderText("Terms of service"));
  }, [dispatch]);

  return (
    <>
      <Box sx={{ padding: 3, gap: 6, display: "flex", flexDirection: "column", marginTop: "24px" }}>
        <Typography variant="h3" gutterBottom>
          Effective Date: {effectiveDate}
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {introductionText}
        </Typography>

        {termsSections.map((section, index) => (
          <Box key={index} sx={{ ml: index < 9 ? 1 : 0 }}>
            {" "}
            {/* Indent only sections 1-9 */}
            <Typography variant="h2" sx={{ fontWeight: "bold", marginBottom: "24px" }}>
              {section.title}
            </Typography>
            <Typography variant="body1">{section.content}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: "auto", width: "100%" }}>
        <InfoFooter />
      </Box>
    </>
  );
};

export default Terms;
