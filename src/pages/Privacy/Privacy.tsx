import React, { useEffect } from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { useDispatch } from "react-redux";
import { setBreadcrumbText, setHeaderText } from "../../redux/Slice/Navigation/NavigationSlice";
import InfoFooter from "../../features/ProjectDirectory/ProjectDashboard/InfoFooter";
import { useLocation } from "react-router-dom";

const listContainer = {
  listStyleType: "disc",
  paddingLeft: "1rem", // Reduced padding for tighter indentation
  margin: 0,
  marginTop: "-24px",
};

const listItem = {
  display: "list-item",
  listStyleType: "disc",
  padding: "2px 0", // Small vertical padding between items
  margin: 0,
};

const effectiveDate = "10/10/24";
const introductionText =
  "At PACE AI Cloud Portal, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and protect your personal information when you visit our website or use our services.";
const privacySections = [
  {
    title: "1. INFORMATION WE COLLECT",
    content: (
      <>
        <Typography variant="body1" paragraph>
          We collect personal information to provide and improve our services. The types of information we collect include:
        </Typography>
        <List sx={listContainer}>
          <ListItem sx={listItem}>
            Personal Identification Information: such as your name, email address, mailing address, phone number, and payment information.
          </ListItem>
          <ListItem sx={listItem}>Usage Data: such as your IP address, browser type, operating system, and pages visited on our site.</ListItem>
          <ListItem sx={listItem}>
            Cookies and Tracking Technologies: We may use cookies and similar tracking technologies to enhance your experience and gather information
            about how you use our website.
          </ListItem>
        </List>
      </>
    ),
  },
  {
    title: "2. HOW WE USE YOUR INFORMATION",
    content: (
      <>
        <Typography variant="body1" paragraph>
          We use your personal information for various purposes, including:
        </Typography>
        <List sx={listContainer}>
          <ListItem sx={listItem}>To provide and maintain our services</ListItem>
          <ListItem sx={listItem}>To process transactions and send you related information, such as purchase confirmations</ListItem>
          <ListItem sx={listItem}>To send you newsletters, marketing, and promotional materials (you can opt-out at any time)</ListItem>
          <ListItem sx={listItem}>To improve our website and customer service</ListItem>
          <ListItem sx={listItem}>To detect, prevent, and address technical issues or security threats</ListItem>
        </List>
      </>
    ),
  },
  {
    title: "3. SHARING YOUR INFORMATION",
    content: (
      <>
        <Typography variant="body1" paragraph>
          We do not sell or rent your personal information. However, we may share your information in the following situations:
        </Typography>
        <List sx={listContainer}>
          <ListItem sx={listItem}>
            With service providers: We share information with trusted third parties who assist us in operating our website, conducting our business,
            or servicing you.
          </ListItem>
          <ListItem sx={listItem}>
            For legal reasons: We may disclose your information to comply with a legal obligation, enforce our terms of service, or protect the rights
            and safety of our users or others.
          </ListItem>
        </List>
      </>
    ),
  },
  {
    title: "4. SECURITY OF YOUR INFORMATION",
    content: (
      <Typography variant="body1" paragraph>
        We take reasonable steps to protect the personal information you provide from unauthorized access, disclosure, alteration, or destruction.
        However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
      </Typography>
    ),
  },
  {
    title: "5. YOUR RIGHTS AND CHOICES",
    content: (
      <>
        <Typography variant="body1" paragraph>
          You have the following rights regarding your personal information:
        </Typography>
        <List sx={listContainer}>
          <ListItem sx={listItem}>Access: You can request access to the personal information we hold about you.</ListItem>
          <ListItem sx={listItem}>Correction: You can request corrections to any inaccurate or incomplete information.</ListItem>
          <ListItem sx={listItem}>Deletion: You can request the deletion of your personal information, subject to certain exceptions.</ListItem>
          <ListItem sx={listItem}>
            Opt-out: You can opt out of receiving marketing communications at any time by following the unsubscribe instructions in our emails.
          </ListItem>
        </List>
      </>
    ),
  },
  {
    title: "6. COOKIES AND TRACKING TECHNOLOGIES",
    content: (
      <Typography variant="body1" paragraph>
        We use cookies to personalize content, analyze site traffic, and improve your experience on our website. You can control the use of cookies
        through your browser settings.
      </Typography>
    ),
  },
  {
    title: "7. THIRD-PARTY LINKS",
    content: (
      <Typography variant="body1" paragraph>
        Our website may contain links to third-party websites. We are not responsible for the privacy practices of other sites and encourage you to
        read their privacy policies.
      </Typography>
    ),
  },
  {
    title: "8. CHILDREN’S PRIVACY",
    content: (
      <Typography variant="body1" paragraph>
        Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we
        become aware that we have inadvertently collected such information, we will take steps to delete it.
      </Typography>
    ),
  },
  {
    title: "9. CHANGES TO THIS PRIVACY POLICY",
    content: (
      <Typography variant="body1" paragraph>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we will notify you of any significant
        updates.
      </Typography>
    ),
  },
  {
    title: "10. CONTACT US",
    content: (
      <Box>
        <Typography sx={{ marginBottom: "16px" }}>If you have any questions about this Privacy Policy, please contact us at:</Typography>
        <Typography>PACE AI Cloud Portal</Typography>
        <Typography>Email: [Your Email Address]</Typography>
        <Typography>Phone: [Your Phone Number]</Typography>
        <Typography>Address: [Your Company Address]</Typography>
      </Box>
    ),
  },
];

const Privacy: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    dispatch(setBreadcrumbText(["Privacy Policy"]));
    dispatch(setHeaderText("Privacy Policy"));
  }, [dispatch]);

  return (
    <>
      <Box sx={{ padding: 3, gap: 6, display: "flex", flexDirection: "column", marginTop: "24px" }}>
        <Typography variant="h3">Effective Date: {effectiveDate}</Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line", marginTop: "-24px" }}>
          {introductionText}
        </Typography>

        {privacySections.map((section, index) => (
          <Box key={index} sx={{ ml: index < 9 ? 1 : 0 }}>
            <Typography variant="h2" sx={{ fontWeight: "bold", marginBottom: "16px" }}>
              {section.title}
            </Typography>
            {section.content}
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: "auto", width: "100%" }}>
        <InfoFooter />
      </Box>
    </>
  );
};

export default Privacy;
