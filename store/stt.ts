import { create } from 'zustand'

interface STTState {
  transcripts: string[]
  addTranscript: (transcript: string) => void
}

export const useSTTStore = create<STTState>((set) => ({
  transcripts: [],
  addTranscript: (transcript) => set((state) => ({ transcripts: [...state.transcripts, transcript] })),
}))
