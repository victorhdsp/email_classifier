import { useState } from 'react'
import { EmailLoadingResult, UploadedFile } from '../../shared/components/views/AppContent/types'
import { AxiosError } from 'axios'
import { useToast } from '../../shared/components/providers/Toast/context'
import { useUploadMode } from './useUploadMode'
import { gatewayService } from '@/app/dependences'
import { logger } from '@/app/shared/utils/logger'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const SUPPORTED_FILE_TYPES = ['text/plain', 'application/pdf']

function validateFile(file: File) {
  logger.info(`Validating file: ${file.name}`)
  if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
    logger.warn(`Unsupported file type: ${file.type}`)
    throw new Error('Unsupported file type. Only .txt and .pdf are allowed.')
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    logger.warn(`File size exceeds limit: ${file.size} bytes`)
    throw new Error('File size exceeds 10 MB limit')
  }
  if (file.size === 0) {
    logger.warn('File is empty.')
    throw new Error('File is empty')
  }
  logger.info('File validation successful.')
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
      logger.info('File is small, analyzing as text.')
      const text = await file.text()
      return gatewayService.analyzeText(text)
    }

    logger.info('Analyzing as a file.')
    return gatewayService.analyzeFile(file, (progress) => {
      setUploadedFile((current) => (current ? { ...current, progress } : null))
    })
  }

  const handleSubmit = async (): Promise<EmailLoadingResult | null> => {
    logger.info(`Starting form submission with mode: ${uploadMode}`)
    setIsSubmitting(true)

    try {
      let result: EmailLoadingResult

      if (uploadMode === 'file') {
        if (!uploadedFile?.file) {
          logger.warn('File submission without a file.')
          throw new Error('No file selected.')
        }
        result = await handleFileSubmit(uploadedFile.file)
      } else {
        result = await gatewayService.analyzeText(textInput)
      }

      logger.info('Form submission successful.')
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

      logger.error(`Error during submission: ${errorMessage}`, error)
      return null
    } finally {
      setIsSubmitting(false)
      logger.info('Finished form submission attempt.')
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
