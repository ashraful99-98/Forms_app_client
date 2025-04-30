import React, { useEffect } from "react";
import Dashboard from "./Dashboard";
import LandingPage from "./LandingPage";
import { useAuth } from "../context/AuthContext";
import { FormProvider } from "../context/FormContext";

const Home: React.FC = () => {
  const { user, fetchCurrentUser } = useAuth();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return user ? (
    <FormProvider>
      {" "}
      <Dashboard />
    </FormProvider>
  ) : (
    <LandingPage />
  );
};

export default Home;
