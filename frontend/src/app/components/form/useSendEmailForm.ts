import { useState } from "react";
import { EmailResult, UploadedFile } from "../../types";
import axios, { AxiosError } from 'axios';
import { useToast } from "../shared/Toast/context";
import { useUploadMode } from "./useUploadMode";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const SUPPORTED_FILE_TYPES = ['text/plain', 'application/pdf'];

function validateFile(file: File) {
    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
        throw new Error("Unsupported file type. Only .txt and .pdf are allowed.");
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error("File size exceeds 10 MB limit");
    }
    if (file.size === 0) {
        throw new Error("File is empty");
    }
}

async function analyzeText(text: string): Promise<EmailResult> {
    if (!text.trim()) {
        throw new Error("Text input is empty");
    }
    const response = await axios.post('/v1/email/analyze/json', { text });
    return response.data;
}

async function analyzeFile(file: File, onUploadProgress: (progress: number) => void): Promise<EmailResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/v1/email/analyze/file', formData, {
        onUploadProgress: ({ loaded, total }) => {
            const progress = total ? Math.round((loaded * 100) / total) : 0;
            onUploadProgress(progress);
        },
    });
    return response.data;
}

export function useSendEmailForm() {
    const { setUploadMode, uploadMode} = useUploadMode()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [textInput, setTextInput] = useState('');
    const toast = useToast();

    const handleFileSubmit = async (file: File): Promise<EmailResult> => {
        validateFile(file);

        if (file.type === 'text/plain' && file.size < 1024 * 1024) {
            const text = await file.text();
            return analyzeText(text);
        }

        return analyzeFile(file, (progress) => {
            setUploadedFile((current) => current ? { ...current, progress } : null);
        });
    };

    const handleSubmit = async (): Promise<EmailResult | null> => {
        setIsSubmitting(true);

        try {
            let result: EmailResult;

            if (uploadMode === 'file') {
                if (!uploadedFile?.file) throw new Error("No file selected.");
                result = await handleFileSubmit(uploadedFile.file);
            } else {
                result = await analyzeText(textInput);
            }

            setUploadedFile(null);
            setTextInput('');
            return result;

        } catch (error) {
            const errorMessage = error instanceof AxiosError
                ? error.response?.data?.error || error.message
                : (error as Error).message;

            toast.showToast({
                title: 'Ocorreu um erro',
                description: errorMessage,
                variant: 'error'
            });

            console.error("Error during submission:", error);
            return null;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isSubmitting,
        uploadedFile,
        setUploadedFile,
        uploadMode,
        setUploadMode,
        textInput,
        setTextInput,
        handleSubmit,
    };
}