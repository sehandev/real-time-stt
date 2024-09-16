'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import TypingAnimation from '@/components/magicui/typing-animation'

export default function STTRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const result = event.results[event.results.length - 1]
        const transcriptText = result[0].transcript
        setTranscript((prev) => prev + ' ' + transcriptText)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioUrl(audioUrl)
      }

      mediaRecorderRef.current.start()
      recognitionRef.current?.start()
      setIsRecording(true)
      setAudioUrl(null) // Clear previous recording
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    recognitionRef.current?.stop()
    setIsRecording(false)
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
    </div>
  )
}