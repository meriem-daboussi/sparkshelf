// ...existing code...

interface Props {
  id?: string
  title: string
  description: string
  difficulty: string
  cost?: number | null
}

export default function ProjectCard({ title, description, difficulty, cost }: Props) {
  return (
    <div className="border border-gray-700 rounded-lg p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p>{description}</p>
      <p className="text-sm text-gray-400">
        Difficulty: {difficulty} | Cost: {typeof cost === 'number' ? `${cost} TND` : 'N/A'}
      </p>
    </div>
  )
}
// ...existing code...