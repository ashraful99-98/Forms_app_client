import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { FormType } from "../../context/FormContext";
import dayjs from "dayjs";
import { useFormContext } from "../../context/FormContext";

interface OneFormProps {
  form: FormType;
}

const OneForm: React.FC<OneFormProps> = ({ form }) => {
  const navigate = useNavigate();
  const { deleteForm } = useFormContext();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = () => {
    navigate(`/form/${form._id}`);
  };

  const handleEdit = () => {
    navigate(`/form/${form._id}`);
  };

  const handleDeleteConfirm = async () => {
    if (form._id && form.createdBy) {
      await deleteForm(form._id, form.createdBy);
      setSnackbarOpen(true);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <Grid>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 4,
            backgroundColor: "#fafafa",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: 8,
            },
          }}
        >
          <CardActionArea onClick={handleClick}>
            <CardMedia
              component="img"
              height="140"
              image="https://static.makeuseof.com/wp-content/uploads/2019/06/AutoGradingQuizResults-GoogleForms.jpg"
              alt="Form Preview"
            />
            <CardContent>
              <Typography gutterBottom variant="h6" noWrap>
                {form.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {form.description}
              </Typography>
              <Box mt={1}>
                <Typography variant="caption" color="text.secondary">
                  Opened: {dayjs(form.updatedAt).format("MMMM D, YYYY h:mm A")}
                </Typography>
              </Box>
            </CardContent>
          </CardActionArea>

          {/* Footer Actions */}
          <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => setDialogOpen(true)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this form? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Form deleted successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default OneForm;
