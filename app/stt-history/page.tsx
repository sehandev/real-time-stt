import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";

export default function STTHistory() {
  const CARDS = [
    {
      id: 1,
      name: "Tony Reichert",
      role: "CEO",
      content: "This is a sample transcription.",
    },
    {
      id: 2,
      name: "Zoey Lang",
      role: "Tech Lead",
      content: "Another sample transcription.",
    },
    {
      id: 3,
      name: "Jane Doe",
      role: "Designer",
      content: "Yet another sample transcription.",
    },
  ];

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-white">STT History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((card) => (
          <NeonGradientCard key={card.id} className="max-w-sm items-center justify-center text-center">
            <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">{card.name}</h3>
            <p className="text-neutral-600 dark:text-neutral-400">{card.role}</p>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">{card.content}</p>
          </NeonGradientCard>
        ))}
      </div>
    </div>
  )
}