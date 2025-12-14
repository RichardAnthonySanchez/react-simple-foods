import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

type DietOption = "none" | "vegan" | "gluten free" | "dairy free";

export const Route = createFileRoute("/")({
  component: QuizPage,
});

function QuizPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goals, setGoals] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [budget, setBudget] = useState("");

  const navigate = useNavigate();

  const steps = [
    {
      question: " What's your name?",
      state: name,
      setState: setName,
      type: "text",
    },
    {
      question: "What's your email",
      state: email,
      setState: setEmail,
      type: "email",
    },
    {
      question: "What are your goals?",
      state: goals,
      setState: setGoals,
      type: "options",
      options: [
        {
          value: "gain 10 pounds of muscle",
          label: "Gain 10 pounds of muscle",
        },
        { value: "lose 10 pounds", label: "Lose 10 pounds" },
        { value: "maintain weight", label: "Maintain current weight" },
      ],
    },
    {
      question: "What's your weight?",
      state: weight,
      setState: setWeight,
      type: "text",
    },
    {
      question: "What's your height?",
      state: height,
      setState: setHeight,
      type: "text",
    },

    {
      question: "What are your dietary restrictions?",
      state: dietaryRestrictions,
      setState: setDietaryRestrictions,
      type: "options",
      options: [
        { value: "none" as DietOption, label: "None" },
        { value: "vegan" as DietOption, label: "Vegan" },
        { value: "gluten free" as DietOption, label: "Gluten free" },
        { value: "dairy free" as DietOption, label: "Dairy free" },
      ],
    },
    {
      question: "What's your preferred cooking time?",
      state: cookingTime,
      setState: setCookingTime,
      type: "options",
      options: [
        { value: "30 mins", label: "30 minutes" },
        { value: "1 hour", label: "1 hour" },
        { value: "2 hours", label: "2 hours" },
      ],
    },
    {
      question: "What's your budget for groceries?",
      state: budget,
      setState: setBudget,
      type: "options",
      options: [
        { value: "less than 100", label: "Less than $100/week" },
        { value: "100 to 300", label: "Between $100 - $300/week" },
        { value: "more than 300", label: "Over $300/week" },
      ],
    },
  ];

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tag =
      dietaryRestrictions !== "none" ? dietaryRestrictions : undefined;

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate({
        to: "/meals",
        search: {
          tags: tag ? [tag] : [],
        },
      });
    }
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 invisible">Nutrition Quiz</h1>
      {step > 0 && (
        <button onClick={handleBack} className="btn btn-neutral mb-6">
          {"<"}
        </button>
      )}

      <form onSubmit={handleNext} className="space-y-4">
        <div>
          <label className="block text-xl font-bold text-center mb-6">
            {steps[step].question}
          </label>
          {steps[step].type === "options" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {steps[step].options &&
                steps[step].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => steps[step].setState(option.value)}
                    className={`p-4 border rounded-lg ${steps[step].state === option.value ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
          ) : (
            <input
              type={steps[step].type}
              value={steps[step].state}
              onChange={(e) => steps[step].setState(e.target.value)}
              placeholder={`Enter your ${steps[step].question.toLowerCase()}`}
              className="mt-1 input input-bordered w-full"
            />
          )}
        </div>
        <div className="mb-4 text-center text-gray-500">{`Question ${step + 1} of ${steps.length}`}</div>
        <div className="flex justify-between">
          <button type="submit" className="mt-4 btn btn-primary w-full">
            {step < steps.length - 1 ? "Next" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
