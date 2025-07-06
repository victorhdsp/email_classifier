import { useEffect } from 'react'
import { useResultServiceStore } from '../../store/useResultServiceStore'
import { gatewayService } from '@/app/dependences'
import { logger } from '../../utils/logger'

export function ResultController() {
  const results = useResultServiceStore((state) => state.results)
  const finishLoading = useResultServiceStore((state) => state.finishLoading)

  useEffect(() => {
    ;(async () => {
      for (const result of results) {
        if (result.subject) continue

        try {
          const data = await gatewayService.getResult(result.id)
          if (data) finishLoading(data.id, data)
        } catch (error) {
          logger.error(`Error fetching result with id ${result.id}:`, error)
        }
      }
    })()
  }, [results, finishLoading])

  useEffect(() => {
    const eventSource = gatewayService.sseSubscribe()

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.id && data.subject) {
        logger.log('ResultController: Received data from SSE:', data)
        finishLoading(data.id, data)
      } else {
        logger.warn('ResultController: Received invalid data from SSE:', data)
      }

      return () => {
        eventSource.close()
      }
    }
  }, [])

  return null
}
