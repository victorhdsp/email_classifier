import { create } from 'zustand'
import { EmailLoadingResult, EmailResult } from '../components/views/AppContent/types'
import { persist } from 'zustand/middleware'

type Result = EmailLoadingResult | EmailResult

interface ResultServiceStore {
  results: Result[]
  addLoadingResult: (result: EmailLoadingResult) => void
  finishLoading: (id: string, result: EmailResult) => void
  removeResult: (id: string) => void
}

export const useResultServiceStore = create<ResultServiceStore>()(
  persist(
    (set) => ({
      results: [],
      addLoadingResult: (result: EmailLoadingResult) =>
        set((state) => {
          const existingResult = state.results.find((r) => r.id === result.id)
          if (!existingResult) 
            return { results: [...state.results, result] }

          return { results: state.results }
        }),
      finishLoading: (id: string, result: EmailResult) =>
        set((state) => {
          const index = state.results.findIndex((r) => r.id === id)
          if (index === -1) {
            return { results: [...state.results, result] }
          }

          const results = state.results.map((r) => (r.id === id ? { ...r, ...result } : r))
          return { results }
        }),
      removeResult: (id: string) =>
        set((state) => ({
          results: state.results.filter((r) => r.id !== id),
        })),
    }),
    { name: 'analyze-storage' },
  ),
)
