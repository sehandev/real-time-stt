import STTRecorder from '@/components/STTRecorder'

export default function STTPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Speech-to-Text Recorder</h1>
      <STTRecorder />
    </div>
  )
}