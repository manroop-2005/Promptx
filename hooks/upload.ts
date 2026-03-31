import axios from "axios";
import { useState } from "react";

// Utility to get mime type from file extension
const getMimeType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext) return 'application/octet-stream';
  if (['jpg', 'jpeg'].includes(ext)) return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'mp4') return 'video/mp4';
  if (ext === 'mov') return 'video/quicktime';
  if (ext === 'webm') return 'video/webm';
  return 'application/octet-stream';
};

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dd5bk5dti/auto/upload';
const UPLOAD_PRESET = 'PromptX-upload';

interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  resource_type: string;
  [key: string]: any;
}

const useCloudinaryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (fileUri: string) => {
    setIsUploading(true);

    try {
      const fileName = fileUri.split('/').pop() || `file_${Date.now()}`;
      const mimeType = getMimeType(fileName);

      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: mimeType,
      } as any);

      formData.append('upload_preset', UPLOAD_PRESET);

      
      const response = await axios.post(
        CLOUDINARY_URL,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Requested-With': 'XMLHttpRequest',
          },
          timeout: 30000,
        }
      );

      return response.data as CloudinaryUploadResult;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadToCloudinary, isUploading };
};

export default useCloudinaryUpload;