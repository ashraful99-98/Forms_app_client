import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import OneForm from "./OneForm";
import { FormType, useFormContext } from "../../context/FormContext";
import { useAuth } from "../../context/AuthContext";

interface FormsProps {
  userId?: string;
}

const Forms: React.FC<FormsProps> = ({ userId }) => {
  const { forms, fetchAllForms, fetchUserForms } = useFormContext();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // if (user.role === "admin") {
        //   await fetchAllForms();
        // } else if (user.role === "user") {
        //   await fetchUserForms(user._id); // use logged-in user's own ID
        // }

        await fetchUserForms(user._id);
      } catch (error) {
        console.error("Failed to fetch forms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [user?.role, user?._id, fetchAllForms, fetchUserForms]);

  return (
    <Container
      maxWidth="lg"
      // sx={{ justifyContent: "center", alignItems: "center" }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box mt={4} mb={2}>
            <Typography variant="h5" align="center" sx={{ color: "blue" }}>
              {/* {user?.role === "admin" ? "All Forms" : "My Forms"} */}
              My Forms
            </Typography>
          </Box>

          {forms.length > 0 ? (
            <Grid container spacing={3}>
              {forms.map((form: FormType) => (
                <Grid key={form._id}>
                  <OneForm form={form} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box display="flex" justifyContent="center" mt={4}>
              <Typography variant="h6">
                {user?.role === "admin"
                  ? "No forms available."
                  : "You haven't created any forms yet."}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Forms;
