import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Divider,
  Stack,
  Alert,
  Link,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import signUpimg from "../images/signUp.png";

const AdminRegister: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [agree, setAgree] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setError("You must agree to the terms and policy");
      return;
    }
    try {
      const res = await axios.post(
        "https://form-app-server-4-7.onrender.com/api/auth/admin/register",
        // "http://localhost:8000/api/auth/admin/register",
        {
          name,
          email,
          password,
        }
      );
      setMessage(res.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setMessage("");
      setError(err.response?.data?.message || "Registration failed");
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
        sx={{
          boxShadow: 3,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Left Side - Register Form */}
        <Grid sx={{ bgcolor: "background.paper", p: 6 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Create Admin Account
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={4}>
              Create your free account
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
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Email address"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />

              <Stack direction="row" alignItems="center" spacing={1}>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  style={{ transform: "scale(1.2)", marginRight: "8px" }}
                />
                <Typography variant="body2">
                  I agree to the{" "}
                  <Link href="#" underline="hover">
                    terms & policy
                  </Link>
                </Typography>
              </Stack>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#3d5928",
                  "&:hover": { backgroundColor: "#314a22" },
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Signup
              </Button>

              <Divider sx={{ my: 3 }}>Already have an account?</Divider>

              <Button
                variant="outlined"
                fullWidth
                href="/login"
                sx={{
                  borderRadius: "30px",
                  textTransform: "none",
                }}
              >
                Login Now
              </Button>
            </Stack>
          </Box>
        </Grid>

        {/* Right Side - Image */}
        <Grid
          sx={{
            position: "relative",
            background: `url(${signUpimg}) center/cover no-repeat`,
            [theme.breakpoints.down("md")]: {
              display: "none",
            },
          }}
        >
          <Box
            component="img"
            src={signUpimg}
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

export default AdminRegister;
