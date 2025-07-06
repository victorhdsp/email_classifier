import AppContent from '@/app/shared/components/views/AppContent'
import { Providers } from '../providers'
import { Triggers } from '../triggers'
import { Controllers } from '../controllers'
import '@/app/dependences'

function App() {
  return (
    <Providers>
      <Triggers />
      <Controllers />
      <AppContent />
    </Providers>
  )
}

export default App
