// updalted landing page
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  TextField,
  Link,
  IconButton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAuth } from "../context/AuthContext";
// import feature1 from "../images/Feature11.png";
// import feature2 from "../images/Feature2.jpeg";
// import feature3 from "../images/Feature3.jpg";

const LandingPage = () => {
  const { user, logout } = useAuth();

  const features = [
    {
      title: "Feature 1",
      description: "Short description of Feature 1.",
      backgroundImage: "/images/Feature11.png",
    },
    {
      title: "Feature 2",
      description: "Short description of Feature 2.",
      backgroundImage: "/images/Feature2.jpeg",
    },
    {
      title: "Feature 3",
      description: "Short description of Feature 3.",
      backgroundImage: "/images/Feature3.jpg",
    },
  ];

  return (
    <>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Form App
          </Typography>
          {user ? (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          ) : (
            <>
              <Link
                component={RouterLink}
                to="/login"
                color="inherit"
                underline="none"
                sx={{ mx: 1 }}
              >
                Login
              </Link>
              <Link
                component={RouterLink}
                to="/register"
                color="inherit"
                underline="none"
                sx={{ mx: 1 }}
              >
                Register
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container>
          <Typography variant="h2" gutterBottom>
            Welcome to Form App
          </Typography>
          <Typography variant="h5">
            This is a short description of what your app does.
          </Typography>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Grid
          container
          spacing={4}
          sx={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {features.map((feature, index) => (
            // <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                position: "relative",
                backgroundImage: `url(${feature.backgroundImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: 1,
                borderColor: "grey.300",
                borderRadius: 2,
                overflow: "hidden",
                height: 300,
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 3,
                  transform: "translateY(-5px)",
                },
              }}
            >
              {/* Dark overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1,
                }}
              />
              {/* Text content */}
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                  color: "white",
                  p: 4,
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography>{feature.description}</Typography>
              </Box>
            </Box>
            // </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer Section */}
      <Box sx={{ backgroundColor: "#f5f5f5", py: 6, mt: 8 }}>
        <Container>
          <Grid
            container
            spacing={4}
            sx={{ alignItems: "center", justifyContent: "center" }}
          >
            {/* About Section */}
            <Grid>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              <Typography>
                Some information about your app. Maybe your mission or vision
                statement.
              </Typography>
            </Grid>

            {/* Stay Updated Section */}
            <Grid>
              <Typography variant="h6" gutterBottom>
                Stay Updated
              </Typography>
              <Box component="form" sx={{ display: "flex", mt: 2 }}>
                <TextField
                  variant="outlined"
                  placeholder="Login Your email"
                  size="small"
                  fullWidth
                  sx={{ mr: 1 }}
                />
                <IconButton
                  type="submit"
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": { backgroundColor: "primary.dark" },
                  }}
                  href="/login"
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;
