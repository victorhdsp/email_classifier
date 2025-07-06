import axios, { AxiosError } from 'axios'
import { EmailLoadingResult, EmailResult } from '../components/views/AppContent/types'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { logger } from '../utils/logger'

export class GatewayService {
  constructor(private readonly baseUrl: string) {}

  async analyzeText(text: string): Promise<EmailLoadingResult> {
    logger.info('Starting text analysis.')
    if (!text.trim()) {
      logger.warn('Text input is empty.')
      throw new Error('Text input is empty')
    }
    try {
      const response = await axios.post<EmailLoadingResult>(
        `${this.baseUrl}/v2/email/analyze/json`,
        { text },
        { withCredentials: true },
      )
      if (!response.data.id) {
        logger.warn('Response does not contain a valid ID.')
        throw new Error('Response does not contain a valid ID')
      }
      logger.info(`Text analysis request successful, ID: ${response.data.id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      logger.error(`Error during text analysis: ${axiosError.message}`)
      throw error
    }
  }

  async analyzeFile(
    file: File,
    onUploadProgress: (progress: number) => void,
  ): Promise<EmailLoadingResult> {
    logger.info(`Starting file analysis for: ${file.name}`)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post<EmailLoadingResult>(
        `${this.baseUrl}/v2/email/analyze/file`,
        formData,
        {
          withCredentials: true,
          onUploadProgress: ({ loaded, total }) => {
            const progress = total ? Math.round((loaded * 100) / total) : 0
            logger.info(`File upload progress: ${progress}%`)
            onUploadProgress(progress)
          },
        },
      )

      if (!response.data.id) {
        logger.warn('File analysis response does not contain a valid ID.')
        throw new Error('Response does not contain a valid ID')
      }
      logger.info(`File analysis request successful, ID: ${response.data.id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      logger.error(`Error during file analysis: ${axiosError.message}`)
      throw error
    }
  }

  async getResult(id: string): Promise<EmailResult | null> {
    logger.info(`Fetching result for ID: ${id}`)
    if (!id) {
      logger.warn('Get result call with empty ID.')
      throw new Error('ID is required to fetch the result')
    }
    try {
      const response = await axios.get<EmailResult>(`${this.baseUrl}/v2/email/${id}`, {
        withCredentials: true,
      })

      if (response.status !== 200) {
        logger.error(`Failed to fetch result with id ${id}: ${response.statusText}`)
        return null
      }
      logger.info(`Successfully fetched result for ID: ${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      logger.error(`Error fetching result for ID ${id}: ${axiosError.message}`)
      throw error
    }
  }

  sseSubscribe(): EventSource {
    logger.info('Subscribing to SSE endpoint.')
    const eventSource = new EventSourcePolyfill(`${this.baseUrl}/v2/sse`, {
      withCredentials: true,
    })

    eventSource.onopen = () => {
      logger.info('SSE connection opened.')
    }

    eventSource.onerror = (error) => {
      logger.error('SSE connection error.', error)
    }

    return eventSource
  }
}
