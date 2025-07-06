import axios from 'axios'
import { EmailLoadingResult, EmailResult } from '../components/views/AppContent/types'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { logger } from '../utils/logger'

export class GatewayService {
  constructor(private readonly baseUrl: string) {}

  async analyzeText(text: string): Promise<EmailLoadingResult> {
    if (!text.trim()) {
      throw new Error('Text input is empty')
    }
    const response = await axios.post<EmailLoadingResult>(
      `${this.baseUrl}/v2/email/analyze/json`,
      { text },
      { withCredentials: true },
    )
    if (!response.data.id) {
      throw new Error('Response does not contain a valid ID')
    }
    return response.data
  }

  async analyzeFile(
    file: File,
    onUploadProgress: (progress: number) => void,
  ): Promise<EmailLoadingResult> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post<EmailLoadingResult>(
      `${this.baseUrl}/v2/email/analyze/file`,
      formData,
      {
        withCredentials: true,
        onUploadProgress: ({ loaded, total }) => {
          const progress = total ? Math.round((loaded * 100) / total) : 0
          onUploadProgress(progress)
        },
      },
    )

    if (!response.data.id) {
      throw new Error('Response does not contain a valid ID')
    }
    return response.data
  }

  async getResult(id: string): Promise<EmailResult | null> {
    if (!id) {
      throw new Error('ID is required to fetch the result')
    }
    const response = await axios.get<EmailResult>(`${this.baseUrl}/v2/email/${id}`, {
      withCredentials: true,
    })

    if (response.status !== 200) {
      logger.error(`Failed to fetch result with id ${id}:`, response.statusText)
      return null
    }
    return response.data
  }

  sseSubscribe(): EventSource {
    const eventSource = new EventSourcePolyfill(`${this.baseUrl}/v2/sse`, {
      withCredentials: true,
    })

    eventSource.onerror = () => {}

    return eventSource
  }
}
