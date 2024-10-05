import React from 'react';
import { useSTTStore } from '@/store/stt';

const STTHistory: React.FC = () => {
  const { transcripts } = useSTTStore();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Transcript History</h2>
      {transcripts.length === 0 ? (
        <p>No transcripts available.</p>
      ) : (
        <ul className="space-y-2">
          {transcripts.map((transcript, index) => (
            <li key={index} className="p-2 bg-gray-100 rounded">
              {transcript}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default STTHistory;