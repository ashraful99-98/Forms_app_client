import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  MenuItem,
  Menu,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { styled, alpha } from "@mui/material/styles";
import {
  Search as SearchIcon,
  AccountCircle,
  MoreVert as MoreIcon,
  Add as AddIcon,
  Home as HomeIcon,
  AdminPanelSettings,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFormContext } from "../context/FormContext";
import Forms from "../Components/Form/Forms";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { createForm, fetchUserForms } = useFormContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    if (user?._id) fetchUserForms(user._id);
  }, [user, fetchUserForms]);

  const handleLogout = async () => {
    if (window.confirm("Really want to logout?")) {
      await logout();
      navigate("/");
    }
  };

  const handleCreateForm = async () => {
    if (!formName.trim() || !user?._id) return;
    const newForm = await createForm({
      name: formName,
      description: formDescription,
      createdBy: user._id,
    });
    if (newForm) {
      setOpen(false);
      setFormName("");
      setFormDescription("");
      navigate(`/form/${newForm._id}`);
    }
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      open={isMenuOpen}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      open={isMobileMenuOpen}
      onClose={() => setMobileMoreAnchorEl(null)}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem onClick={() => setOpen(true)}>
        <IconButton color="inherit">
          <AddIcon />
        </IconButton>
        <p>Create Form</p>
      </MenuItem>
      {user?.role === "admin" && (
        <MenuItem onClick={() => navigate("/admin")}>
          <IconButton color="inherit">
            <AdminPanelSettings />
          </IconButton>
          <p>Admin Panel</p>
        </MenuItem>
      )}
      <MenuItem onClick={() => setAnchorEl(null)}>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate("/")}
            >
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Dashboard
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
              {user?.role === "admin" && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate("/admin")}
                  startIcon={<AdminPanelSettings />}
                >
                  Admin Panel
                </Button>
              )}
              <Button
                variant="contained"
                color="inherit"
                sx={{ color: "#000" }}
                onClick={() => setOpen(true)}
                startIcon={<AddIcon />}
              >
                Create Form
              </Button>
              <IconButton
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <AccountCircle />
              </IconButton>
            </Box>
          )}

          {isMobile && (
            <Box>
              <IconButton
                color="inherit"
                onClick={(e) => setMobileMoreAnchorEl(e.currentTarget)}
              >
                <MoreIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {renderMenu}
      {renderMobileMenu}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a form, enter a name and description.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateForm}>Create</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ p: 2 }}>{user && <Forms userId={user._id} />}</Box>
    </Box>
  );
};

export default Dashboard;
