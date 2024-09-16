import { Button } from "@/components/ui/button";

export default function STT() {
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className="text-4xl md:text-7xl font-bold text-center text-white relative z-20">
        Speech-to-Text
      </h1>
      <Button className="mt-8 bg-white text-black hover:bg-gray-200">Start Recording</Button>
      {/* Add STT functionality here */}
    </div>
  )
}