import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Paper,
  Grid,
  Box,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  ViewList as ViewListIcon,
  StarBorder as StarBorderIcon,
  Send as SendIcon,
  Palette as PaletteIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  MoreVert as MoreIcon,
  AccountCircle as AccountCircleIcon,
  FilterNone as FilterNoneIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { SnackbarCloseReason } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { useFormContext } from "../../context/FormContext";
import { useAuth } from "../../context/AuthContext";
import QuestionsTab, { FormDataType } from "./QuestionsTab";
import ResponseTab from "../Response/ResponseTab";
import { FormType } from "../../context/FormContext";

const useStyles = makeStyles({
  paper: {
    padding: "16px",
    marginTop: "8px",
    marginBottom: "8px",
  },
  button: {
    marginLeft: "8px",
  },
});

interface QuestionType {
  questionText: string;
  questionType: string;
  options: string[];
  required: boolean;
}

const EditForm: React.FC = () => {
  const classes = useStyles();
  const { formId } = useParams<{ formId: string }>();
  const { user, logout } = useAuth();
  const { fetchFormById } = useFormContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [value, setValue] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [formID, setFormID] = useState<string>("");
  // const [formDetails, setFormDetails] = useState<FormType>({});

  const getEmptyForm = (): FormType => ({
    _id: "",
    name: "",
    description: "",
    createdBy: "",
    questions: [],
    formType: "",
    stared: false,
    createdAt: "",
    updatedAt: "",
  });

  const [formDetails, setFormDetails] = useState<FormType>(getEmptyForm());

  const [openOfAlert, setOpenOfAlert] = useState<boolean>(false);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );

  useEffect(() => {
    if (formId) {
      setFormID(formId);
      fetchFormById(formId)
        .then((data: FormType) => setFormDetails(data))
        .catch((error: any) => {
          const resMessage =
            error.response?.data?.message || error.message || error.toString();
          console.error(resMessage);
        });
    }
  }, [formId, fetchFormById]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClickOfAlert = () => setOpenOfAlert(true);

  const handleCloseOfAlert = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setOpenOfAlert(false);
  };

  const clipToClipboard = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/s/${formDetails._id}`
    );
    handleClickOfAlert();
    handleClose();
  };

  const sendForm = () => handleClickOpen();

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = async () => {
    if (window.confirm("Really want to logout?")) {
      await logout();
      navigate("/");
    }
  };

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileAnchorEl}
      open={Boolean(mobileAnchorEl)}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => setValue(0)}>Questions</MenuItem>
      <MenuItem onClick={() => setValue(1)}>Responses</MenuItem>
      <MenuItem onClick={sendForm}>
        <SendIcon sx={{ mr: 1 }} /> Send
      </MenuItem>
      <MenuItem>
        <PaletteIcon sx={{ mr: 1 }} /> Theme
      </MenuItem>
      <MenuItem component="a" href={`/s/${formDetails._id}`} target="_blank">
        <VisibilityIcon sx={{ mr: 1 }} /> Preview
      </MenuItem>
      <MenuItem>
        <SettingsIcon sx={{ mr: 1 }} /> Settings
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <AccountCircleIcon sx={{ mr: 1 }} /> Logout
      </MenuItem>
    </Menu>
  );

  const renderProfileMenu = (
    <Menu
      anchorEl={profileAnchorEl}
      open={Boolean(profileAnchorEl)}
      onClose={handleProfileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuClose}>
        <IconButton color="inherit">
          <AccountCircleIcon />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <IconButton color="inherit">
          <AccountCircleIcon />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div>
      {user &&
      (user.role === "admin" ||
        (user.role === "user" && formDetails?.createdBy === user._id)) ? (
        <>
          <AppBar position="static" color="default" elevation={2}>
            <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              {/* Left Section: ViewListIcon, Title, Star Icon */}
              <Box display="flex" alignItems="center">
                <IconButton edge="start" sx={{ color: "#140078" }}>
                  <ViewListIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{ mt: "8.5px", ml: 1, mr: 1, color: "black" }}
                >
                  {formDetails?.name}
                </Typography>
                <IconButton>
                  <StarBorderIcon />
                </IconButton>
              </Box>

              {/* Center Section: Tabs */}
              {!isMobile && (
                <Box flex={1} display="flex" justifyContent="center">
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                  >
                    <Tab label="Questions" />
                    <Tab label="Responses" />
                  </Tabs>
                </Box>
              )}

              {/* Right Section: Actions */}
              {!isMobile ? (
                <Box display="flex" alignItems="center">
                  <a
                    href={`/s/${formDetails._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  </a>
                  <IconButton onClick={sendForm}>
                    <SendIcon />
                  </IconButton>
                  <IconButton>
                    <PaletteIcon />
                  </IconButton>
                  <IconButton>
                    <SettingsIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={handleProfileMenuOpen}>
                    <AccountCircleIcon />
                  </IconButton>
                </Box>
              ) : (
                <IconButton edge="end" onClick={handleMobileMenuOpen}>
                  <MoreIcon />
                </IconButton>
              )}
            </Toolbar>
          </AppBar>

          {renderMobileMenu}
          {renderProfileMenu}

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Copy and share link.</DialogTitle>
            <DialogContent>
              <Paper className={classes.paper}>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1">
                    {`${window.location.origin}/s/${formDetails._id}`}
                  </Typography>
                  <IconButton
                    className={classes.button}
                    size="medium"
                    onClick={clipToClipboard}
                  >
                    <FilterNoneIcon />
                  </IconButton>
                </Grid>
              </Paper>
              <DialogContentText />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            open={openOfAlert}
            autoHideDuration={3000}
            onClose={handleCloseOfAlert}
            message="Copied to clipboard"
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseOfAlert}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />

          <TabPanel value={value} index={0}>
            <QuestionsTab formData={formDetails as FormDataType} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ResponseTab formData={formDetails} formId={formID} />
          </TabPanel>
        </>
      ) : (
        <Box mt={4} textAlign="center">
          <Typography variant="h6" color="error">
            You're not the owner of the form
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default EditForm;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
