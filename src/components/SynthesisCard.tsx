interface SynthesisCardProps {
  title: string;
  body: string;
}

export function SynthesisCard({ title, body }: SynthesisCardProps) {
  return (
    <div className="card synthesisCard">
      <h2 className="synthesisTitle">{title}</h2>
      <p className="synthesisBody">{body}</p>
    </div>
  );
}
