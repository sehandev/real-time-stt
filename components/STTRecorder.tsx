'use client'

import TypingAnimation from '@/components/magicui/typing-animation'
import { Button } from '@/components/ui/button'
import { useSTTStore } from '@/store/stt'
import { useEffect, useState } from 'react'

export default function STTRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const { addTranscript } = useSTTStore()
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const newRecognition = new SpeechRecognition()
      newRecognition.continuous = true
      newRecognition.interimResults = true

      newRecognition.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(' ')
        setTranscript(currentTranscript)
      }

      newRecognition.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        setIsRecording(false)
        setError(`Speech recognition error: ${event.error}`)
      }
      setRecognition(newRecognition)
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [])

  const startRecording = () => {
    setError(null)
    setIsRecording(true)
    setTranscript('')
    if (recognition) {
      recognition.start()
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (recognition) {
      recognition.stop()
    }
    addTranscript(transcript)
    // Add logic here to set the audioUrl if needed
    // setAudioUrl(/* URL of the recorded audio */)
  }

  return (
    <div>
      <Button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      {audioUrl && (
        <div className="mt-4">
          <audio src={audioUrl} controls />
        </div>
      )}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Transcript:</h2>
        <div className="bg-gray-100 p-4 rounded-lg min-h-[100px]">
          {transcript ? (
            <TypingAnimation text={transcript} />
          ) : (
            <p className="text-gray-500">Start recording to see the transcript...</p>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-4 text-red-500">
          {error}
        </div>
      )}
    </div>
  )
}
