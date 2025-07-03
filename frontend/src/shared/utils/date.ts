export function getLocaleDateByString(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('pt-BR', 
    {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }
    )
}