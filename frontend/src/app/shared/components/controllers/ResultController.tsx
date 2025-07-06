import { useEffect } from 'react'
import { useResultServiceStore } from '../../store/useResultServiceStore'
import { gatewayService } from '@/app/dependences'

export function ResultController() {
  const results = useResultServiceStore((state) => state.results)
  const finishLoading = useResultServiceStore((state) => state.finishLoading)

  useEffect(() => {
    ;(async () => {
      const resultEntries = Object.entries(results)
      
      for (const [id, result] of resultEntries) {
        if (result.subject) continue

        try {
          const data = await gatewayService.getResult(id)
          if (data) finishLoading(data.id, data)
          
        } catch (error) {
          console.error(`Error fetching result with id ${id}:`, error)
        }
      }
    })()
  }, [])

  useEffect(() => {
    const eventSource = gatewayService.sseSubscribe()

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.id && data.subject) {
        console.log('ResultController: Received data from SSE:', data)
        finishLoading(data.id, data)
      } else {
        console.warn('ResultController: Received invalid data from SSE:', data)
      }

      return () => {
        eventSource.close()
      }
    }
  }, [])

  return null
}
