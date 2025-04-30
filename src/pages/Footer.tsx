import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Footer: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 6, mt: 8 }}>
      <Container>
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid
          //   item xs={12} md={6}
          >
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography>
              Some information about your app. Maybe your mission or vision
              statement.
            </Typography>
          </Grid>

          {/* Stay Updated Section */}
          <Grid
          //   item xs={12} md={6}
          >
            <Typography variant="h6" gutterBottom>
              Stay Updated
            </Typography>
            <Box component="form" sx={{ display: "flex", mt: 2 }}>
              <TextField
                variant="outlined"
                placeholder="Your email"
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
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
