import SparklesText from "@/components/magicui/sparkles-text";
import TypingAnimation from "@/components/magicui/typing-animation";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black">
      <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
        <SparklesText
          text="Real-time STT"
          className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white"
          sparklesCount={30}
          colors={{
            first: '#A07CFE',
            second: '#FE8FB5',
          }}
        />
      </div>
      <div className="flex flex-col items-center space-y-4 mt-8">
        <TypingAnimation 
          text="Welcome to our Speech-to-Text application"
          className="text-white text-2xl"
          duration={100}
        />
        <div className="flex space-x-4 mt-4">
          <Button asChild className="bg-white text-black hover:bg-gray-200">
            <Link href="/stt">Go to STT</Link>
          </Button>
          <Button asChild variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700">
            <Link href="/stt-history">View STT History</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
