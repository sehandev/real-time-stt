import { Button } from "@/components/ui/button"
import Link from 'next/link'

// Mock data for demonstration
const mockHistory = [
  { id: 1, date: '2024-03-15', text: 'This is a sample transcription...' },
  { id: 2, date: '2024-03-14', text: 'Another example of transcribed text...' },
]

export default function STTHistoryPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">STT History</h1>
      <Link href="/stt">
        <Button className="mb-4">New Recording</Button>
      </Link>
      <ul className="space-y-4">
        {mockHistory.map((item) => (
          <li key={item.id} className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">{item.date}</p>
            <p className="text-gray-800">{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}