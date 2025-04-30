import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed
import { Box, Typography } from "@mui/material";

const AdminRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1">
          You must be an admin to access this page.
        </Typography>
      </Box>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
