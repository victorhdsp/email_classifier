import { useTour } from '@reactour/tour'
import { useEffect } from 'react'

export function TourAutoTrigger() {
  const { setIsOpen } = useTour()

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour')
    if (!hasSeenTour) {
      setIsOpen(true)
      localStorage.setItem('hasSeenTour', 'true')
    }
  }, [setIsOpen])

  return null
}
