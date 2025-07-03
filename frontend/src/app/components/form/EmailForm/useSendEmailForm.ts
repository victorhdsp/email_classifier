import { useState } from "react";
import { EmailResult, UploadedFile } from "../../../types";
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

function sendText(text: string) {
  if (!text.trim())
    throw new Error("Text input is empty");

  return axios.post('/v1/email/analyze/json', { text });
}

function protectFile(uploadedFile: UploadedFile) {
  if (!['text/plain', 'application/pdf'].includes(uploadedFile.file.type))
    throw new Error("Unsupported file type. Only .txt and .pdf are allowed.");

  if (uploadedFile.file.size > 10 * 1024 * 1024) // 10 MB limit
    throw new Error("File size exceeds 10 MB limit");

  if (uploadedFile.file.size === 0)
    throw new Error("File is empty");
}

export function useSendEmailForm(setIsProcessing: (isProcessing: boolean) => void) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState('');

  function sendFile() {
    const formData = new FormData();

    if (!uploadedFile || !uploadedFile.file)
      throw new Error("No file to upload");

    protectFile(uploadedFile);

    formData.append('file', uploadedFile.file);

    return axios.post('/v1/email/analyze/file', formData, {
      onUploadProgress: ({ loaded, total }) => {
        const progress = Math.round((loaded * 100) / (total || 1));
        setUploadedFile({ ...uploadedFile, progress });
      },
    });
  }

  async function sendSubmit(): Promise<EmailResult | null> {
    setIsProcessing(true);
    setIsUploading(true);

    let response;

    try {
      if (uploadMode === 'file')
        response = await sendFile();
      else if (uploadMode === 'text')
        response = await sendText(textInput);

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
    setTextInput('');

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