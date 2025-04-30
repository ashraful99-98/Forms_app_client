import React from "react";
import FormTable from "../../Components/Admin/FormTable";
import AdminHeader from "../../Components/Admin/AdminHeader";
import { Container } from "@mui/material";

const AdminForms: React.FC = () => {
  return (
    <>
      <AdminHeader />

      <Container maxWidth="xl">
        <FormTable />
      </Container>
    </>
  );
};

export default AdminForms;
