import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
});

function QuizPage() {
  return (
    <div>
      <h1>Quiz Page</h1>
      <p>This is a test route.</p>
    </div>
  );
}
