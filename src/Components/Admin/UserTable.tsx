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
import { useAuth } from "../../context/AuthContext";
import {
  AddBusinessRounded,
  AdminPanelSettingsOutlined,
  Block,
  Delete,
  Mail,
  LockOpen,
} from "@mui/icons-material";
import AdminHeader from "./AdminHeader";
import { format } from "timeago.js";

type Props = {
  isTeam: boolean;
};

const UserTable: FC<Props> = ({ isTeam }) => {
  const {
    users,
    user,
    fetchAllUsers,
    updateUserRole,
    blockUser,
    unblockUser,
    deleteUser,
  } = useAuth();

  const [openModal, setOpenModal] = useState(false);
  const [modalAction, setModalAction] = useState<
    "block" | "unblock" | "delete" | "updateRole"
  >("block");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUniqueId, setSelectedUniqueId] = useState("");
  const [selectedUserRole, setSelectedUserRole] = useState("");
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleUserAction = async () => {
    try {
      if (modalAction === "block") {
        await blockUser(selectedUserId);
        setAlert({
          open: true,
          message: "User blocked successfully!",
          severity: "success",
        });
      } else if (modalAction === "unblock") {
        await unblockUser(selectedUserId);
        setAlert({
          open: true,
          message: "User unblocked successfully!",
          severity: "success",
        });
      } else if (modalAction === "delete") {
        await deleteUser(selectedUserId);
        setAlert({
          open: true,
          message: "User deleted successfully!",
          severity: "success",
        });
      } else if (modalAction === "updateRole") {
        await updateUserRole(selectedUniqueId, selectedUserRole);
        setAlert({
          open: true,
          message: "User role updated successfully!",
          severity: "success",
        });
      }
      setOpenModal(false);
      fetchAllUsers();
    } catch (error) {
      console.error(error);
      setAlert({ open: true, message: "Action failed.", severity: "error" });
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.6 },
    { field: "role", headerName: "Role", flex: 0.4 },
    { field: "status", headerName: "Status", flex: 0.4 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.5,
      // renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "updateRole",
      headerName: "Promote to Admin",
      flex: 0.5,
      renderCell: (params) => {
        const row = params.row;
        return row.role === "admin" ? (
          <AdminPanelSettingsOutlined sx={{ fontSize: 24, color: "#388e3c" }} />
        ) : user?.role !== "moderator" ? (
          <Button
            onClick={() => {
              setOpenModal(true);
              setModalAction("updateRole");
              setSelectedUniqueId(row.uniqueId);
              setSelectedUserRole("admin");
            }}
          >
            <AddBusinessRounded sx={{ fontSize: 24, color: "#1976d2" }} />
          </Button>
        ) : null;
      },
    },
    // {
    //   field: "blockUnblock",
    //   headerName: "Block / Unblock",
    //   flex: 0.5,
    //   renderCell: (params) => {
    //     const row = params.row;
    //     return row.isBlocked ? (
    //       <Button
    //         onClick={() => {
    //           setOpenModal(true);
    //           setSelectedUserId(row.uniqueId);
    //           setModalAction("unblock");
    //         }}
    //       >
    //         <LockOpen sx={{ fontSize: 24, color: "#43a047" }} />
    //       </Button>
    //     ) : (
    //       <Button
    //         onClick={() => {
    //           setOpenModal(true);
    //           setSelectedUserId(row.uniqueId);
    //           setModalAction("block");
    //         }}
    //       >
    //         <Block sx={{ fontSize: 24, color: "#e53935" }} />
    //       </Button>
    //     );
    //   },
    // },

    {
      field: "blockUnblock",
      headerName: "Block / Unblock",
      flex: 0.5,
      renderCell: (params) => {
        const row = params.row;
        return row.role === "admin" ? (
          <AdminPanelSettingsOutlined sx={{ fontSize: 24, color: "#388e3c" }} />
        ) : row.isBlocked ? (
          <Button
            onClick={() => {
              setOpenModal(true);
              setSelectedUserId(row.uniqueId);
              setModalAction("unblock");
            }}
          >
            <LockOpen sx={{ fontSize: 24, color: "#43a047" }} />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setOpenModal(true);
              setSelectedUserId(row.uniqueId);
              setModalAction("block");
            }}
          >
            <Block sx={{ fontSize: 24, color: "#e53935" }} />
          </Button>
        );
      },
    },
    // {
    //   field: "delete",
    //   headerName: "Delete",
    //   flex: 0.4,
    //   renderCell: (params) => (
    //     <Button
    //       onClick={() => {
    //         setOpenModal(true);
    //         setSelectedUserId(params.row.uniqueId);
    //         setModalAction("delete");
    //       }}
    //     >
    //       <Delete sx={{ fontSize: 24, color: "#d32f2f" }} />
    //     </Button>
    //   ),
    // },

    {
      field: "delete",
      headerName: "Delete",
      flex: 0.4,
      renderCell: (params) => {
        const row = params.row;
        return row.role === "admin" ? (
          <Block sx={{ fontSize: 24, color: "#388e3c" }} />
        ) : (
          <Button
            onClick={() => {
              setOpenModal(true);
              setSelectedUserId(row.uniqueId);
              setModalAction("delete");
            }}
          >
            <Delete sx={{ fontSize: 24, color: "#d32f2f" }} />
          </Button>
        );
      },
    },

    {
      field: "emailAction",
      headerName: "Email",
      flex: 0.4,
      renderCell: (params) => (
        <a href={`mailto:${params.row.email}`}>
          <Mail sx={{ fontSize: 24, color: "#0288d1" }} />
        </a>
      ),
    },
  ];

  const rows = users
    .filter((user) =>
      isTeam ? ["admin", "moderator"].includes(user.role) : true
    )
    .map((user) => ({
      id: user._id,
      uniqueId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      status: user.isBlocked ? "Blocked" : "Active",
      // createdAt: user.createdAt,
      createdAt: format(user.createdAt),
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
            // backgroundColor: "#fafafa",
          }}
        >
          <Box m="20px">
            <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
              {isTeam ? "Team Users" : "All Users"}
            </Typography>

            <Box
              m="20px 0"
              height="80vh"
              sx={{
                "& .MuiDataGrid-root": { border: "1px solid #e0e0e0" },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#1565c0",
                  color: "#000",
                  fontSize: "16px",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-row": {
                  backgroundColor: "#f9f9f9",
                  "&:hover": { backgroundColor: "#f1f1f1" },
                },
                "& .MuiDataGrid-cell": {
                  color: "#424242",
                },
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: "#1565c0",
                  color: "#fff",
                },
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
              />
            </Box>

            {/* Modal */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#fff",
                  padding: 4,
                  borderRadius: 2,
                  width: 400,
                  boxShadow: 24,
                }}
              >
                <Typography variant="h6" mb={2}>
                  {modalAction === "block"
                    ? "Block User"
                    : modalAction === "unblock"
                    ? "Unblock User"
                    : modalAction === "delete"
                    ? "Delete User"
                    : "Promote User"}
                </Typography>
                <Typography mb={4}>
                  Are you sure you want to{" "}
                  {modalAction === "updateRole" ? "promote" : modalAction} this
                  user?
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color={
                      modalAction === "delete"
                        ? "error"
                        : modalAction === "updateRole"
                        ? "success"
                        : "warning"
                    }
                    onClick={handleUserAction}
                  >
                    {modalAction === "updateRole"
                      ? "Promote"
                      : modalAction.charAt(0).toUpperCase() +
                        modalAction.slice(1)}
                  </Button>
                </Box>
              </Box>
            </Modal>

            {/* Snackbar */}
            <Snackbar
              open={alert.open}
              autoHideDuration={4000}
              onClose={() => setAlert({ ...alert, open: false })}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={() => setAlert({ ...alert, open: false })}
                severity={alert.severity}
                sx={{ width: "100%" }}
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

export default UserTable;
