import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  // Grid,
  TextField,
  Typography,
  Divider,
  Stack,
  useTheme,
  Alert,
  Link,
} from "@mui/material";
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
} from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import loginImg from "../images/login.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setMessage("");

  //   try {
  //     await login(email, password);
  //     setMessage("Login successful!");
  //     navigate("/");
  //   } catch (err: any) {
  //     setError(err?.message || "Login failed. Please try again.");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await login(email, password);
      if (user && user.isBlocked) {
        setError("Your account is blocked.");
        return;
      }

      setMessage("Login successful!");
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // marginTop: "60px",
      }}
    >
      <Grid
        container
        sx={{ boxShadow: 3, borderRadius: 4, overflow: "hidden" }}
      >
        {/* Left Side - Login Form */}
        <Grid sx={{ bgcolor: "background.paper", p: 6 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              LOGIN /{" "}
              <Link href="/" variant="h5">
                Home
              </Link>
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={4}>
              Login into your account..?
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            <Stack spacing={3}>
              <TextField
                label="Useremail"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.5,
                  background:
                    "linear-gradient(90deg, #6A11CB 0%, #2575FC 100%)",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textTransform: "none",
                }}
              >
                Login Now
              </Button>

              <Divider sx={{ my: 3 }}>OR</Divider>
              <Button
                variant="outlined"
                fullWidth
                sx={{ borderRadius: "30px", textTransform: "none" }}
                href="/register"
              >
                Signup Now
              </Button>
              <Divider sx={{ my: 3 }}>Login with Others</Divider>

              <Button
                startIcon={<GoogleIcon />}
                variant="outlined"
                fullWidth
                sx={{ borderRadius: "30px", textTransform: "none" }}
              >
                Login with Google
              </Button>

              <Button
                startIcon={<FacebookIcon />}
                variant="outlined"
                fullWidth
                sx={{ borderRadius: "30px", textTransform: "none" }}
              >
                Login with Facebook
              </Button>
            </Stack>
          </Box>
        </Grid>

        {/* Right Side - Image */}
        <Grid
          sx={{
            position: "relative",
            background: `url(${loginImg}) center/cover no-repeat`,
            [theme.breakpoints.down("md")]: {
              display: "none",
            },
          }}
        >
          <Box
            component="img"
            src={loginImg}
            alt="Login Illustration"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
