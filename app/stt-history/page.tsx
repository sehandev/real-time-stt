import STTHistory from '@/components/STTHistory';

export default function STTHistoryPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Speech-to-Text History</h1>
      <STTHistory />
    </div>
  );
}