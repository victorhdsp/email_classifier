import { useState } from 'react'

let _setMode: ((mode: 'file' | 'text') => void) | null = null

export function useUploadMode() {
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file')
  _setMode = setUploadMode
  return { uploadMode, setUploadMode }
}

export function forceUploadModeChange(mode: 'file' | 'text') {
  if (_setMode) _setMode(mode)
}
