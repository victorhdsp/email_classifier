import { useState } from 'react'
import { EmailLoadingResult, UploadedFile } from '../../shared/components/views/AppContent/types'
import { AxiosError } from 'axios'
import { useToast } from '../../shared/components/providers/Toast/context'
import { useUploadMode } from './useUploadMode'
import { gatewayService } from '@/app/dependences'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const SUPPORTED_FILE_TYPES = ['text/plain', 'application/pdf']

function validateFile(file: File) {
  if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type. Only .txt and .pdf are allowed.')
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('File size exceeds 10 MB limit')
  }
  if (file.size === 0) {
    throw new Error('File is empty')
  }
}

export function useSendEmailForm() {
  const { setUploadMode, uploadMode } = useUploadMode()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [textInput, setTextInput] = useState('')
  const toast = useToast()

  const handleFileSubmit = async (file: File): Promise<EmailLoadingResult> => {
    validateFile(file)

    if (file.type === 'text/plain' && file.size < 1024 * 1024) {
      const text = await file.text()
      return gatewayService.analyzeText(text)
    }

    return gatewayService.analyzeFile(file, (progress) => {
      setUploadedFile((current) => (current ? { ...current, progress } : null))
    })
  }

  const handleSubmit = async (): Promise<EmailLoadingResult | null> => {
    setIsSubmitting(true)

    try {
      let result: EmailLoadingResult

      if (uploadMode === 'file') {
        if (!uploadedFile?.file) throw new Error('No file selected.')
        result = await handleFileSubmit(uploadedFile.file)
      } else {
        result = await gatewayService.analyzeText(textInput)
      }

      setUploadedFile(null)
      setTextInput('')
      return result
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : (error as Error).message

      toast.showToast({
        title: 'Ocorreu um erro',
        description: errorMessage,
        variant: 'error',
      })

      console.error('Error during submission:', error)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    uploadedFile,
    setUploadedFile,
    uploadMode,
    setUploadMode,
    textInput,
    setTextInput,
    handleSubmit,
  }
}
