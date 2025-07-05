import { TourProvider as SystemTourProvider } from '@reactour/tour'
import { useTourProvider } from '@/app/shared/hooks/useTourProvider'

interface TourProps {
  children: React.ReactNode
}

export function TourProvider({ children }: TourProps) {
  const { beforeClose, currentStep, setCurrentStep, steps } = useTourProvider()

  return (
    <SystemTourProvider
      steps={steps}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      beforeClose={beforeClose}
    >
      {children}
    </SystemTourProvider>
  )
}
