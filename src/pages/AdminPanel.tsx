import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import UserTable from "../Components/Admin/UserTable";
import FormTable from "../Components/Admin/FormTable";
import AdminHeader from "../Components/Admin/AdminHeader";

// Import MUI icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SecurityIcon from "@mui/icons-material/Security";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DnsIcon from "@mui/icons-material/Dns";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const cards = [
  {
    icon: <DashboardIcon fontSize="large" />,
    title: "Dashboard",
    description: "See relevant insights about your domain",
  },
  {
    icon: <PeopleIcon fontSize="large" />,
    title: "Users",
    description: "Add or manage users",
  },
  {
    icon: <SettingsIcon fontSize="large" />,
    title: "Groups",
    description: "Create groups and mailing lists",
  },
  {
    icon: <ApartmentIcon fontSize="large" />,
    title: "Buildings and resources",
    description: "Manage and monitor buildings, rooms, and resources",
  },
  {
    icon: <PhoneIphoneIcon fontSize="large" />,
    title: "Device management",
    description: "Secure corporate data on devices",
  },
  {
    icon: <SettingsIcon fontSize="large" />,
    title: "Apps",
    description: "Manage apps and their settings",
  },
  {
    icon: <SecurityIcon fontSize="large" />,
    title: "Security",
    description: "Manage security features",
  },
  {
    icon: <AssessmentIcon fontSize="large" />,
    title: "Reports",
    description: "Track usage of services",
  },
  {
    icon: <AttachMoneyIcon fontSize="large" />,
    title: "Billing",
    description: "View charges and manage licenses",
  },
  {
    icon: <ApartmentIcon fontSize="large" />,
    title: "Company profile",
    description: "Update information about your company",
  },
  {
    icon: <AdminPanelSettingsIcon fontSize="large" />,
    title: "Admin roles",
    description: "Add new admins",
  },
  {
    icon: <DnsIcon fontSize="large" />,
    title: "Domains",
    description: "Verify your domain or add domains",
  },
  {
    icon: <SwapHorizIcon fontSize="large" />,
    title: "Data migration",
    description: "Import email, calendar, and contacts",
  },
  {
    icon: <HelpOutlineIcon fontSize="large" />,
    title: "Support",
    description: "Talk to our support team",
  },
];

const AdminPanel: React.FC = () => {
  return (
    <>
      <AdminHeader />
      <Container maxWidth="xl">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={4}
        >
          {/* Top Cards Section */}
          <Grid container spacing={3} justifyContent="center">
            {cards.map((card, idx) => (
              <Grid key={idx} display="flex" justifyContent="center">
                <Card
                  sx={{
                    height: "100%",
                    width: "100%",
                    maxWidth: 280,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    textAlign: "center",
                    boxShadow: 3,
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Box sx={{ mb: 2, color: "primary.main" }}>{card.icon}</Box>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* View Report Button */}
          <Box textAlign="center" mt={5} mb={5}>
            <Button variant="contained" size="large">
              View Complete Report
            </Button>
          </Box>

          {/* User and Form Tables Section */}
          <Grid container spacing={4} justifyContent="center">
            <Grid>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>
                  Team Members
                </Typography>
                <UserTable isTeam={true} />
              </Paper>
            </Grid>

            <Grid>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>
                  Users
                </Typography>
                <UserTable isTeam={false} />
              </Paper>
            </Grid>
          </Grid>
          <FormTable />
        </Box>
      </Container>
    </>
  );
};

export default AdminPanel;
