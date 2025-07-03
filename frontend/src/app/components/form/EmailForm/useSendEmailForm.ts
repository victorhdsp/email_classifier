import { useState } from "react";
import { EmailResult, UploadedFile } from "../../../types";
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export function useSendEmailForm(setIsProcessing: (isProcessing: boolean) => void) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState('');

  function sendFile() {
    const formData = new FormData();
    if (!uploadedFile || !uploadedFile.file) 
      throw new Error("No file to upload");

    formData.append('file', uploadedFile.file);

    return axios.post('/v1/email/analyze/file', formData, {
      onUploadProgress: ({loaded, total}) => {
        const progress = Math.round((loaded * 100) / (total || 1));
        setUploadedFile({ ...uploadedFile, progress });
      },
    });
  }

  function sendText() {
    if (!textInput.trim())
      throw new Error("Text input is empty");

    return axios.post('/v1/email/analyze/json', { text: textInput });
  }

  async function sendSubmit(): Promise<EmailResult|null> {
    setIsProcessing(true);
    setIsUploading(true);

    let response;

    try {
      if (uploadMode === 'file')
        response = await sendFile();
      else if (uploadMode === 'text')
        response = await sendText();

      if (!response || !response)
        throw new Error("No data received from server");

    } catch (error) {
      setIsProcessing(false);
      setIsUploading(false);
      
      console.error("Error during file upload or text submission:", error);
      return null;
    };

    setIsProcessing(false);
    setIsUploading(false);
    setUploadedFile(null);

    return response.data;
  }

  return {
    isUploading,
    uploadedFile,
    setUploadedFile,
    uploadMode,
    setUploadMode,
    textInput,
    setTextInput,
    sendSubmit
  };
}