import { ToastProvider } from '@/app/shared/components/providers/Toast'
import { TourProvider } from '@/app/shared/components/providers/Tour'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TourProvider>
      <ToastProvider>{children}</ToastProvider>
    </TourProvider>
  )
}
