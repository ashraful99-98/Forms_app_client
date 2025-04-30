import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Snackbar,
  Alert,
  Typography,
  Container,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useFormContext } from "../../context/FormContext";
import AdminHeader from "./AdminHeader";
import { format } from "timeago.js";
import { useNavigate } from "react-router-dom";

const FormTable: FC = () => {
  const { forms, fetchAllForms, deleteForm } = useFormContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchAllForms();
  }, [fetchAllForms]);

  const handleDeleteForm = async () => {
    try {
      if (!user?._id) {
        throw new Error("User ID missing");
      }
      await deleteForm(selectedFormId, user._id);
      setAlert({
        open: true,
        message: "Form deleted successfully!",
        severity: "success",
      });
      setOpenModal(false);
      fetchAllForms();
    } catch (error) {
      console.error(error);
      setAlert({
        open: true,
        message: "Failed to delete form.",
        severity: "error",
      });
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Title", flex: 0.8 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "questionCount", headerName: "Questions", flex: 0.5 },
    { field: "createdBy", headerName: "Created By", flex: 0.8 },
    { field: "createdAt", headerName: "Created At", flex: 0.4 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          onClick={() => {
            setOpenModal(true);
            setSelectedFormId(params.row.id);
          }}
        >
          <Delete sx={{ fontSize: 24, color: "#d32f2f" }} />
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.5,
      renderCell: (params) => (
        <Button onClick={() => navigate(`/form/${params.row.id as string}`)}>
          <Edit sx={{ fontSize: 24, color: "#0288d1" }} />
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  const rows = forms.map((form) => ({
    id: form._id,
    name: form.name,
    description: form.description,
    questionCount: form.questions ? form.questions.length : 0,
    // createdBy: form.createdBy.name,
    createdBy: form.createdBy || "Unknown",
    createdAt: format(form.createdAt),
  }));

  return (
    <>
      {/* <AdminHeader /> */}

      <Container maxWidth="xl">
        <div
          style={{
            minHeight: "100vh",
            paddingTop: 30,
            paddingBottom: 40,
          }}
        >
          <Box m="20px">
            {/* Title */}
            <Typography variant="h4" sx={{ mb: 3, color: "primary.main" }}>
              All Forms
            </Typography>

            {/* DataGrid */}
            <Box
              sx={{
                height: 650,
                width: "100%",
                m: "20px 0",
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "primary.main",
                    color: "#000",
                    fontSize: "16px",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                  "& .MuiDataGrid-cell": {
                    color: "black",
                    fontSize: "15px",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#1976d2",
                  },
                  boxShadow: 2,
                  borderRadius: 2,
                }}
              />
            </Box>

            {/* Confirm Deletion Modal */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  p: 4,
                  boxShadow: 24,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Confirm Deletion
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Are you sure you want to delete this form?
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteForm}
                  sx={{ mr: 2 }}
                >
                  Delete
                </Button>
                <Button variant="outlined" onClick={() => setOpenModal(false)}>
                  Cancel
                </Button>
              </Box>
            </Modal>

            {/* Snackbar Alert */}
            <Snackbar
              open={alert.open}
              autoHideDuration={4000}
              onClose={() => setAlert({ ...alert, open: false })}
            >
              <Alert
                onClose={() => setAlert({ ...alert, open: false })}
                severity={alert.severity}
                variant="filled"
              >
                {alert.message}
              </Alert>
            </Snackbar>
          </Box>
        </div>
      </Container>
    </>
  );
};

export default FormTable;
