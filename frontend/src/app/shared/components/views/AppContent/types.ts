export interface EmailLoadingResult extends Partial<EmailResult> {
  id: string
  timestamp: string
}

export interface EmailResult {
  id: string
  subject: string
  type: 'Produtivo' | 'Improdutivo'
  text: string
  timestamp: string
}

export interface UploadedFile {
  file: File
  progress: number
  name: string
  size: string
}
