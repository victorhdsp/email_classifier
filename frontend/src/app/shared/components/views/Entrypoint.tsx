import AppContent from '@/app/shared/components/views/AppContent'
import { Providers } from '../providers'
import { Triggers } from '../triggers'

function App() {
  return (
    <Providers>
      <Triggers />
      <AppContent />
    </Providers>
  )
}

export default App
