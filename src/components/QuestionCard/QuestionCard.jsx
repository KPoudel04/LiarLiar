import './QuestionCard.css';

export default function QuestionCard({ title, subtitle }) {
  return (
    <section className="question-card">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </section>
  );
}
