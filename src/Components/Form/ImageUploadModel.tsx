// final attam
import React, { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useUpload } from "../../context/UploadContext";

// Correct type based on your ImageContextData
interface ImageContextData {
  question: number | null;
  option: number | null;
}

interface ImageUploadModelProps {
  open: boolean; // ✅ Correct prop name
  onClose: () => void; // ✅ Correct prop name
  updateImageLink: (imageLink: string, context: ImageContextData) => void;
  context: ImageContextData;
}

const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB

const ImageUploadModel: React.FC<ImageUploadModelProps> = ({
  open,
  onClose,
  updateImageLink,
  context,
}) => {
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageWarning, setImageWarning] = useState("");

  const { uploadImage } = useUpload();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageWarning("");
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setImageWarning("Please select an image.");
      return;
    }

    if (image.size > MAX_IMAGE_SIZE) {
      setImageWarning("File size is too big. Maximum allowed is 3MB.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(image.type)) {
      setImageWarning("Only JPG, PNG, GIF, or WEBP images are allowed.");
      return;
    }

    try {
      const uploadedImage = await uploadImage(image);
      const imageLink = uploadedImage.url;

      if (!imageLink) {
        setImageWarning("Image upload failed, no image URL returned.");
        return;
      }

      updateImageLink(imageLink, context);
      onClose();
    } catch (error: any) {
      const resMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while uploading.";
      setImageWarning(resMessage);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Upload Image</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Upload an image for your question. Only JPG, PNG, GIF, or WEBP formats
          allowed, up to 3MB.
        </DialogContentText>
        <TextField
          type="file"
          fullWidth
          onChange={handleFileChange}
          inputProps={{ accept: "image/*" }}
        />
        {imageWarning && (
          <p style={{ color: "red", marginTop: "10px" }}>{imageWarning}</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpload} color="primary" variant="contained">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageUploadModel;
