import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface UploadedImageType {
  _id: string;
  public_id: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UploadContextType {
  uploadedImages: UploadedImageType[];
  uploadImage: (file: File) => Promise<UploadedImageType>;
  fetchUploadedImages: () => Promise<void>;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImageType[]>([]);

  const uploadImage = async (file: File): Promise<UploadedImageType> => {
    const formData = new FormData();
    formData.append("myfile", file);

    try {
      const res = await axios.post(
        // "http://localhost:8000/api/images",
        "https://forms-app-47.vercel.app/api/images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Important if server uses cookies!
        }
      );

      if (!res.data?.image) {
        throw new Error("No image data returned from server.");
      }

      const uploaded = res.data.image as UploadedImageType;
      setUploadedImages((prev) => [...prev, uploaded]);
      return uploaded;
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message ||
          "Image upload failed. Please try again."
      );
    }
  };

  const fetchUploadedImages = async () => {
    try {
      // const res = await axios.get("http://localhost:8000/api/images", {
      const res = await axios.get(
        "https://forms-app-47.vercel.app/api/images",
        {
          withCredentials: true,
        }
      );

      const images = res.data.images as UploadedImageType[];
      setUploadedImages(images);
    } catch (error: any) {
      console.error(
        "Failed to fetch uploaded images:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchUploadedImages();
  }, []);

  return (
    <UploadContext.Provider
      value={{ uploadedImages, uploadImage, fetchUploadedImages }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = (): UploadContextType => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
};
