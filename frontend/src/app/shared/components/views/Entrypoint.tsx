import AppContent from '@/app/shared/components/views/AppContent'
import { Providers } from '../providers'
import { Triggers } from '../triggers'
import { Controllers } from '../controllers'
import Clarity from '@microsoft/clarity'
import '@/app/dependences'

function App() {
  const projectId = 'saw3w9aq2t'

  Clarity.init(projectId)

  return (
    <Providers>
      <Triggers />
      <Controllers />
      <AppContent />
    </Providers>
  )
}

export default App
