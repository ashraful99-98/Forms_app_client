import React from "react";
import AdminHeader from "../../Components/Admin/AdminHeader";
import { Container } from "@mui/material";
import UserTable from "../../Components/Admin/UserTable";

const AdminTeam: React.FC = () => {
  return (
    <>
      <AdminHeader />

      <Container maxWidth="xl">
        <UserTable isTeam={true} />
      </Container>
    </>
  );
};

export default AdminTeam;
